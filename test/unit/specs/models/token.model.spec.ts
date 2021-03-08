import { Token } from '@/common/models/token.model';

describe('Token', () => {
  test('should generate and verify a token correctly', async () => {
    const token = new Token();
    expect(token.tokenString).toBeUndefined();
    expect(token.generateToken({ id: 1 })).toBeUndefined();
    expect(token.tokenString).toBeDefined();
    expect(token.verifyToken()).toMatchObject({
      exp: expect.any(Number),
      iat: expect.any(Number),
      id: 1,
    });
  });
});
