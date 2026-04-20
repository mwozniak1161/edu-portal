import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Role } from '../generated/prisma/enums';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMail = {
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
};

const baseUser = {
  id: 'user-uuid',
  email: 'test@example.com',
  password: '$2b$12$hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  role: Role.STUDENT,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  classId: null,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: MailService, useValue: mockMail },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a user and returns tokens when email is unique', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(baseUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ token: 'rt-uuid' });
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        role: Role.STUDENT,
      });

      expect(result).toMatchObject({ accessToken: 'access-token', refreshToken: 'refresh-token' });
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('sends welcome email after user creation', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(baseUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ token: 'rt-uuid' });
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      await service.register({
        email: 'test@example.com',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        role: Role.STUDENT,
      });

      expect(mockMail.sendWelcomeEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test',
        'Password1!',
      );
    });

    it('still returns tokens when welcome email is not awaited', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(baseUser);
      mockPrisma.refreshToken.create.mockResolvedValue({ token: 'rt-uuid' });
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      mockMail.sendWelcomeEmail.mockResolvedValueOnce(undefined);

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        role: Role.STUDENT,
      });

      expect(result.accessToken).toBe('access-token');
    });

    it('throws ConflictException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(baseUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'Password1!',
          firstName: 'Test',
          lastName: 'User',
          role: Role.STUDENT,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      const hashed = await bcrypt.hash('Password1!', 1);
      mockPrisma.user.findUnique.mockResolvedValue({ ...baseUser, password: hashed });
      mockPrisma.refreshToken.create.mockResolvedValue({ token: 'rt-uuid' });
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login({ email: 'test@example.com', password: 'Password1!' });

      expect(result).toMatchObject({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    it('throws UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@example.com', password: 'Password1!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 1);
      mockPrisma.user.findUnique.mockResolvedValue({ ...baseUser, password: hashed });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('rotates refresh token and returns new tokens', async () => {
      const hashed = await bcrypt.hash('old-refresh-token', 1);
      mockJwt.verify.mockReturnValue({ sub: 'user-uuid', email: 'test@example.com', role: Role.STUDENT });
      mockPrisma.refreshToken.findMany.mockResolvedValue([{
        id: 'rt-id',
        token: hashed,
        revoked: false,
        expiresAt: new Date(Date.now() + 60000),
        userId: 'user-uuid',
        user: baseUser,
      }]);
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({ token: 'new-rt' });
      mockJwt.sign.mockReturnValueOnce('new-access').mockReturnValueOnce('new-refresh');

      const result = await service.refresh('old-refresh-token');

      expect(result).toMatchObject({ accessToken: 'new-access', refreshToken: 'new-refresh' });
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'rt-id' },
        data: { revoked: true },
      });
    });

    it('throws UnauthorizedException when JWT verify fails', async () => {
      mockJwt.verify.mockImplementation(() => { throw new Error('bad token'); });

      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when no matching stored token found', async () => {
      mockJwt.verify.mockReturnValue({ sub: 'user-uuid', email: 'test@example.com', role: Role.STUDENT });
      mockPrisma.refreshToken.findMany.mockResolvedValue([]);

      await expect(service.refresh('some-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for expired token', async () => {
      const hashed = await bcrypt.hash('old-token', 1);
      mockJwt.verify.mockReturnValue({ sub: 'user-uuid', email: 'test@example.com', role: Role.STUDENT });
      mockPrisma.refreshToken.findMany.mockResolvedValue([{
        id: 'rt-id',
        token: hashed,
        revoked: false,
        expiresAt: new Date(Date.now() - 1000),
        userId: 'user-uuid',
        user: baseUser,
      }]);

      await expect(service.refresh('old-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('revokes all active refresh tokens for the user', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      await service.logout('user-uuid');

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid', revoked: false },
        data: { revoked: true },
      });
    });
  });
});
