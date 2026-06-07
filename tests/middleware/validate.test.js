const { validateBody } = require('../../src/middleware/validate');
const Joi = require('joi');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('passes when body is valid', () => {
  const schema = Joi.object({ name: Joi.string().required() });
  const middleware = validateBody(schema);
  const req = { body: { name: 'Alice' } };
  const res = mockRes();
  const next = jest.fn();
  middleware(req, res, next);
  expect(next).toHaveBeenCalledWith();
});

test('returns 400 when body is invalid', () => {
  const schema = Joi.object({ name: Joi.string().required() });
  const middleware = validateBody(schema);
  const req = { body: {} };
  const res = mockRes();
  const next = jest.fn();
  middleware(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(next).not.toHaveBeenCalled();
});
