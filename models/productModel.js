const { productsDB } = require("../database/database");

function getAllProducts(callback) {
  productsDB.all("SELECT * FROM Products", callback);
}

function addProduct(product, callback) {
  const query = `INSERT INTO Products VALUES (?, ?, ?, ?, ?, ?, ?)`;
  productsDB.run(query, [
    product.item,
    product.price,
    product.amount_sold,
    product.amount_stocked,
    product.discounts,
    product.popularity,
    product.competitors
  ], callback);
}

function deleteProduct(item, callback) {
  productsDB.run("DELETE FROM Products WHERE item = ?", [item], callback);
}

function updateProduct(product, callback) {
  const query = `
    UPDATE Products
    SET price = ?, amount_sold = ?, amount_stocked = ?, discounts = ?, popularity = ?, competitors = ?
    WHERE item = ?
  `;
  productsDB.run(query, [
    product.price,
    product.amount_sold,
    product.amount_stocked,
    product.discounts,
    product.popularity,
    product.competitors,
    product.item
  ], callback);
}

function getProductByItem(item, callback) {
  productsDB.get("SELECT * FROM Products WHERE item = ?", [item], callback);
}

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductByItem
};
