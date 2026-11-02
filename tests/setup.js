jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));
