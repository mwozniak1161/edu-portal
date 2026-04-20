import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

const mockExecutionContext = {
  switchToHttp: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('wraps a string response in { data }', (done) => {
    interceptor
      .intercept(mockExecutionContext as never, { handle: () => of('hello') })
      .subscribe((result) => {
        expect(result).toEqual({ data: 'hello' });
        done();
      });
  });

  it('wraps an object response in { data }', (done) => {
    const payload = { id: '1', email: 'user@example.com' };
    interceptor
      .intercept(mockExecutionContext as never, { handle: () => of(payload) })
      .subscribe((result) => {
        expect(result).toEqual({ data: payload });
        done();
      });
  });

  it('wraps null in { data: null }', (done) => {
    interceptor
      .intercept(mockExecutionContext as never, { handle: () => of(null) })
      .subscribe((result) => {
        expect(result).toEqual({ data: null });
        done();
      });
  });

  it('wraps an array in { data: [...] }', (done) => {
    const list = [{ id: '1' }, { id: '2' }];
    interceptor
      .intercept(mockExecutionContext as never, { handle: () => of(list) })
      .subscribe((result) => {
        expect(result).toEqual({ data: list });
        done();
      });
  });
});
