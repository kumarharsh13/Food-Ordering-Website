const db = require("../../src/config/db");
const menuModel = require("../../src/models/menuModel");

afterEach(() => jest.clearAllMocks());

test("updatePriceById updates using item_id not item_name", async () => {
  db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
  await menuModel.updatePriceById(5, 150);
  expect(db.query).toHaveBeenCalledWith(
    "UPDATE menu SET item_price = ? WHERE item_id = ?",
    [150, 5],
  );
});

test("getAll returns all menu rows", async () => {
  db.query.mockResolvedValueOnce([[{ item_id: 1, item_name: "Omelette" }]]);
  const result = await menuModel.getAll();
  expect(result).toHaveLength(1);
});
