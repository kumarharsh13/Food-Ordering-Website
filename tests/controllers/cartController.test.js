jest.mock('../../src/models/menuModel');
jest.mock('../../src/models/orderModel');

const menuModel = require('../../src/models/menuModel');
const orderModel = require('../../src/models/orderModel');
const cartController = require('../../src/controllers/cartController');

const mockReq = (body = {}, sessionCart = []) => ({
  body,
  user: { id: 1, name: 'Test' },
  session: { cart: sessionCart, user: { id: 1, name: 'Test' } },
  flash: jest.fn(),
});
const mockRes = () => {
  const res = {};
  res.render = jest.fn();
  res.redirect = jest.fn();
  res.sendStatus = jest.fn();
  return res;
};

afterEach(() => jest.clearAllMocks());

test('checkout fetches price from DB and ignores client subprice', async () => {
  menuModel.getById = jest.fn().mockResolvedValue({ item_id: 5, item_price: 200 });
  orderModel.create = jest.fn().mockResolvedValue({});

  const req = mockReq({ itemid: '5', quantity: '2', subprice: '1' });
  const res = mockRes();
  const next = jest.fn();

  await cartController.checkout(req, res, next);

  expect(orderModel.create).toHaveBeenCalledWith(
    expect.objectContaining({ itemId: '5', quantity: 2, price: 400 })
  );
});

test('checkout skips items with quantity 0', async () => {
  menuModel.getById = jest.fn().mockResolvedValue({ item_id: 5, item_price: 200 });
  orderModel.create = jest.fn().mockResolvedValue({});

  const req = mockReq({ itemid: '5', quantity: '0', subprice: '200' });
  const res = mockRes();
  const next = jest.fn();

  await cartController.checkout(req, res, next);
  expect(orderModel.create).not.toHaveBeenCalled();
});
