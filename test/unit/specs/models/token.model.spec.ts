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

  test('should verify an existing token correctly', async () => {
    const tokeString =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1MjIwMzExLCJleHAiOjE2MTUzMDY3MTF9.X8jGb1EJBSfOF3RGvxcNhHAJ1QxMq6dYJVvXs-OEGV0';
    const token = new Token(tokeString);
    expect(token.tokenString).toEqual(tokeString);
    expect(token.verifyToken()).toMatchObject({
      exp: expect.any(Number),
      iat: expect.any(Number),
      id: 1,
    });
  });
});
