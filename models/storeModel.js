const { storesDB } = require("../database/database");

function getAllStores(callback) {
  storesDB.all("SELECT * FROM Stores", callback);
}

function addStore(store, callback) {
  const query = `INSERT INTO Stores VALUES (?, ?, ?, ?, ?, ?)`;
  storesDB.run(query, [
    store.name,
    store.customers_served,
    store.products_stocked,
    store.competitors,
    store.financial_position,
    store.product_shipments
  ], callback);
}

function deleteStore(name, callback) {
  storesDB.run("DELETE FROM Stores WHERE name = ?", [name], callback);
}

module.exports = { getAllStores, addStore, deleteStore };
