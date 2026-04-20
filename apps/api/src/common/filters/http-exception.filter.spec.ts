import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
const mockGetRequest = jest.fn().mockReturnValue({ url: '/test', method: 'GET' });
const mockArgumentsHost = {
  switchToHttp: jest.fn().mockReturnValue({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  }),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    jest.clearAllMocks();
    mockStatus.mockReturnValue({ json: mockJson });
    mockGetResponse.mockReturnValue({ status: mockStatus });
    mockArgumentsHost.switchToHttp.mockReturnValue({
      getResponse: mockGetResponse,
      getRequest: mockGetRequest,
    });
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('formats a plain string HttpException correctly', () => {
    filter.catch(new HttpException('Not Found', HttpStatus.NOT_FOUND), mockArgumentsHost as never);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: HttpStatus.NOT_FOUND, message: 'Not Found' }),
    );
  });

  it('forwards object HttpException fields including details', () => {
    const exception = new HttpException(
      { message: 'Validation failed', error: 'Bad Request', details: { field: 'email' } },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost as never);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'Bad Request',
        details: { field: 'email' },
      }),
    );
  });

  it('maps Prisma P2002 to 409 Conflict', () => {
    const prismaError = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });

    filter.catch(prismaError, mockArgumentsHost as never);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: HttpStatus.CONFLICT, error: 'Conflict' }),
    );
  });

  it('maps Prisma P2025 to 404 Not Found', () => {
    const prismaError = Object.assign(new Error('Record not found'), { code: 'P2025' });

    filter.catch(prismaError, mockArgumentsHost as never);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: HttpStatus.NOT_FOUND, error: 'Not Found' }),
    );
  });

  it('returns 500 for unknown errors without exposing internals', () => {
    filter.catch(new Error('Something broke internally'), mockArgumentsHost as never);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const body = mockJson.mock.calls[0][0] as Record<string, unknown>;
    expect(body['statusCode']).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body['message']).toBe('Internal server error');
    expect(body['details']).toBeUndefined();
  });
});
