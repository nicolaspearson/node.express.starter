/* eslint-disable @typescript-eslint/no-explicit-any */
type Mock<T> = { [K in keyof T]: jest.Mock<any> };
