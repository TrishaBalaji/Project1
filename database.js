const path = require("path");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

const table1Path = path.join(__dirname, "table1.db");
const table2Path = path.join(__dirname, "table2.db");
const table3Path = path.join(__dirname, "table3.db");

const usersDB = new sqlite3.Database(table1Path); 
const productsDB = new sqlite3.Database(table2Path);
const storesDB = new sqlite3.Database(table3Path);

module.exports = {usersDB, productsDB, storesDB, initializeDatabases};

async function initializeDatabases() {
  await table1();
  await table2();
  await table3();
}

async function table1()
{
    const db = await sqlite.open({
        filename: table1Path,
        driver: sqlite3.Database
    });
    
    await db.exec("DROP TABLE IF EXISTS Users");
    await db.exec("CREATE TABLE Users (username TEXT, password TEXT, firstname TEXT, lastname TEXT, email TEXT, associated_store TEXT, products_to_manage REAL)");

    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['Sbsss','neelamas','Sirisha', 'Neelamaygam','sirisha@gmail.com', 'Food Basics', '1500']);
    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['Tbsss','balajt','Trisha', 'Balaji','trisha@gmail.com', 'Food Basics', '2300']);
    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['Poppy','yeelamap','Prisha', 'Neelaman','poppy@gmail.com', 'No Frills', '900']);
    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['Dolly','castlesss','Deanna', 'Goldberg','goldberg@gmail.com', 'Food Basics', '1800']);
    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['David','hemsworth','David', 'Smith','davidisthebest@gmail.com', 'No Frills', '1500']);
    await db.run("INSERT INTO Users VALUES (?,?,?,?,?,?,?)", ['Erica','uniteduk','Erica', 'Lee','eric.17.sha@gmail.com', 'Sobeys', '3000']);

    const results = await db.all("SELECT rowid as id, * FROM Users");
    console.log(results);

    await db.close();
}

async function table2()
{
    const db = await sqlite.open({
        filename: table2Path,
        driver: sqlite3.Database
    });

    await db.exec("DROP TABLE IF EXISTS Products");
    await db.exec("CREATE TABLE Products (item TEXT, price REAL, amount_sold INT, amount_stocked INT, discounts TEXT, popularity TEXT, competitors TEXT)");

    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Pringles','5.99','650', '700','0.50', 'med', 'Lays']);
    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Lays','3.99','900', '985','0.60', 'high', 'Pringles']);
    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Doritos','4.50','850', '900','0.30', 'high', 'Pringles']);
    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Cheetos','6.25','780', '878','0.00', 'low', 'Lays']);
    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Ms.Vickies','4.99','667', '770','0.00', 'med', 'Lays']);
    await db.run("INSERT INTO Products VALUES (?,?,?,?,?,?,?)", ['Ruffles','3.99','489', '600','0.20', 'low', 'Ms.Vickies']);

    const results = await db.all("SELECT rowid as id, * FROM Products");
    console.log(results);

    await db.close();
}

async function table3()
{
    const db = await sqlite.open({
        filename: table3Path,
        driver: sqlite3.Database
    });

    await db.exec("DROP TABLE IF EXISTS Stores");
    await db.exec("CREATE TABLE Stores (name TEXT, customers_served INT, products_stocked INT, competitors TEXT, financial_position BOOL, product_shipments INT)");

    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['No Frills','1000','650', 'Freshco','good', '700']);
    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['Food Basics','2000','900', 'Loblaws','bad', '950']);
    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['Loblaws','3000','850', 'Food Basics','bad', '900']);
    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['Sobeys','2500','780', 'Longos','good', '820']);
    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['Longos','1500','667', 'Sobeys','good', '900']);
    await db.run("INSERT INTO Stores VALUES (?,?,?,?,?,?)", ['Freshco','2000','489', 'No Frills','bad', '900']);

    const results = await db.all("SELECT rowid as id, * FROM Stores");
    console.log(results);

    await db.close();
}
