import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '../generated/prisma/enums';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
};

const tokens = { accessToken: 'access', refreshToken: 'refresh' };

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('POST /auth/register calls service.register and returns tokens', async () => {
    mockAuthService.register.mockResolvedValue(tokens);

    const result = await controller.register({
      email: 'a@b.com',
      password: 'Password1!',
      firstName: 'A',
      lastName: 'B',
      role: Role.STUDENT,
    });

    expect(result).toEqual(tokens);
    expect(mockAuthService.register).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/login calls service.login and returns tokens', async () => {
    mockAuthService.login.mockResolvedValue(tokens);

    const result = await controller.login({ email: 'a@b.com', password: 'Password1!' });

    expect(result).toEqual(tokens);
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/refresh calls service.refresh and returns tokens', async () => {
    mockAuthService.refresh.mockResolvedValue(tokens);

    const result = await controller.refresh({ refreshToken: 'rt' });

    expect(result).toEqual(tokens);
    expect(mockAuthService.refresh).toHaveBeenCalledWith('rt');
  });

  it('POST /auth/logout calls service.logout with userId from request', async () => {
    mockAuthService.logout.mockResolvedValue(undefined);

    await controller.logout({ user: { id: 'user-uuid', email: 'a@b.com', role: Role.STUDENT } });

    expect(mockAuthService.logout).toHaveBeenCalledWith('user-uuid');
  });
});
