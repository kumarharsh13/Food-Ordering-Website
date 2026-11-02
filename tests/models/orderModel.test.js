const db = require('../../src/config/db');
const orderModel = require('../../src/models/orderModel');

afterEach(() => jest.clearAllMocks());

test('getPending returns only pending orders', async () => {
  db.query.mockResolvedValueOnce([[{ order_id: 'abc', status: 'pending' }]]);
  const result = await orderModel.getPending();
  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining("status = 'pending'"),
    undefined
  );
  expect(result[0].status).toBe('pending');
});

test('setDispatched updates status to dispatched', async () => {
  db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
  await orderModel.setDispatched('abc');
  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining("status = 'dispatched'"),
    ['abc']
  );
});

test('getByUserIdAndStatus filters by user and status', async () => {
  db.query.mockResolvedValueOnce([[{ order_id: 'abc', user_id: 2 }]]);
  await orderModel.getByUserIdAndStatus(2, 'dispatched');
  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining('user_id = ?'),
    expect.arrayContaining([2, 'dispatched'])
  );
});
