const db = require('../../src/config/db');
const adminModel = require('../../src/models/adminModel');

afterEach(() => jest.clearAllMocks());

test('findByEmail returns admin row when found', async () => {
  db.query.mockResolvedValueOnce([[{ admin_id: 1, admin_name: 'admin_fury', admin_email: 'admin_fury@gmail.com', admin_password: '$2a$10$xxx' }]]);
  const result = await adminModel.findByEmail('admin_fury@gmail.com');
  expect(result).toMatchObject({ admin_id: 1, admin_name: 'admin_fury' });
  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining('WHERE admin_email = ?'),
    ['admin_fury@gmail.com']
  );
});

test('findByEmail returns null when not found', async () => {
  db.query.mockResolvedValueOnce([[]]);
  const result = await adminModel.findByEmail('nobody@example.com');
  expect(result).toBeNull();
});
