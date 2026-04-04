const express = require("express");
const app = express();
const mustacheExpress = require('mustache-express');

const bodyParser = require("body-parser");
const {usersDB, productsDB, storesDB, initializeDatabases} = require("./database"); // Import the database connection

app.engine("html", mustacheExpress());
app.set("view engine", "html");

app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname)); // Serve static files (like script.js)


app.get('/mypage',function(req, res) {

    var TPL = 
    {title: "Grocery Item Tracker"
        , message:"This page shows user, product and store data!"
        , tables:["Users","Products","Stores"]
        , warning: false
        , error: true

    }

    res.render('mypage', TPL); //module not found error given when running server 
    //error resolved - had to install mustache-express and correct the typo in dirname (two underscores not one)
})


app.get("/", (req, res) => {
  // Render the login form with an optional error message
  res.render("mypage", { error: req.query.error });
});

app.post("/mypage", (req, res) => {
  const { username, password } = req.body; // Server-side validation (basic check)
  if (!username || !password) {
    return res.redirect("/?error=Missing username or password");
  }
  const query = `SELECT * FROM Users WHERE username = ? AND password = ?`;
  usersDB.get(query, [username, password], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.redirect("/?error=Database error");
    }
    if (user) {
      // Successful login, redirect to dashboard
      res.redirect("/product?username=" + user.username);
    } else {
      // Failed login
      res.redirect("/?error=Invalid username or password");
    }
  });
});

app.get("/product", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.redirect("/?error=Unauthorized access");
  }

  productsDB.all("SELECT * FROM Products", (err, products) => {
    if (err) {
      console.error(err);
      return res.send("Error loading products");
    }

    storesDB.all("SELECT * FROM Stores", (err, stores) => {
      if (err) {
        console.error(err);
        return res.send("Error loading stores");
      }

      res.render("product", {
        username,
        products,
        stores
      });
    });
  });
});

app.post("/deleteProduct", (req, res) => {
  const { item, username } = req.body;

  productsDB.run("DELETE FROM Products WHERE item = ?", [item], (err) => {
    if (err) console.error(err);
    res.redirect("/product?username=" + encodeURIComponent(username));
  });
});

app.post("/addProduct", (req, res) => {
  const { item, price, amount_sold, amount_stocked, discounts, popularity, competitors } = req.body;

  const query = `
    INSERT INTO Products VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  productsDB.run(query, [item, price, amount_sold, amount_stocked, discounts, popularity, competitors], (err) => {
    if (err) console.error(err);
    res.redirect("/product?username=" + encodeURIComponent(username));
  });
});

app.post("/deleteStore", (req, res) => {
  const { name, username } = req.body;

  storesDB.run("DELETE FROM Stores WHERE name = ?", [name], (err) => {
    if (err) console.error(err);
    res.redirect("/product?username=" + encodeURIComponent(username));
  });
});

app.post("/addStore", (req, res) => {
  const { username, name, customers_served, products_stocked, competitors, financial_position, product_shipments } = req.body;

  const query = `
    INSERT INTO Stores VALUES (?, ?, ?, ?, ?, ?)
  `;

  storesDB.run(query, [name, customers_served, products_stocked, competitors, financial_position, product_shipments], (err) => {
    if (err) console.error(err);
    res.redirect("/product?username=" + encodeURIComponent(username));
  });
});

app.use(express.json()); 

app.post("/updateProduct", (req, res) => {
  const { item, price, amount_sold, amount_stocked, discounts, popularity, competitors } = req.body;

  const query = `
    UPDATE Products
    SET price = ?, amount_sold = ?, amount_stocked = ?, discounts = ?, popularity = ?, competitors = ?
    WHERE item = ?
  `;

  productsDB.run(query, [price, amount_sold, amount_stocked, discounts, popularity, competitors, item], (err) => {
    if (err) console.error(err);
    res.sendStatus(200);
  });
});

app.get("/dashboard", (req, res) => {
  const username = req.query.username;

  productsDB.all("SELECT * FROM Products", (err, products) => {
    if (err) return res.send("Error loading products");

    //Related to dashboard
    const totalProducts = products.length;

    const avgPrice = (
      products.reduce((sum, p) => sum + parseFloat(p.price), 0) /
      totalProducts
    ).toFixed(2);

    const topProduct = products.reduce((a, b) =>
      parseInt(a.amount_sold) > parseInt(b.amount_sold) ? a : b
    ).item;

    const maxDiscount = products.reduce((a, b) =>
      parseFloat(a.discounts) > parseFloat(b.discounts) ? a : b
    ).discounts;

    res.render("dashboard", {
      username,
      products,
      totalProducts,
      avgPrice,
      topProduct,
      maxDiscount
    });
  });
});

function renderProductPage(res, username, extraData = {}) {
  productsDB.all("SELECT * FROM Products", (err, products) => {
    if (err) {
      console.error(err);
      return res.send("Error loading products");
    }

    storesDB.all("SELECT * FROM Stores", (err, stores) => {
      if (err) {
        console.error(err);
        return res.send("Error loading stores");
      }

      res.render("product", {
        username,
        products,
        stores,
        ...extraData
      });
    });
  });
}

app.post("/stockCalculator", (req, res) => {
  const { item, username } = req.body;

  productsDB.get(
    "SELECT amount_sold FROM Products WHERE item = ?",
    [item],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.render("product", {
          stockError: "Database error occurred."
        });
      }

      if (!row) {
        return res.render("product", {
          stockError: `Item "${item}" not found in the database.`
        });
      }

      const sold = parseInt(row.amount_sold);
      const yearly = sold * 12;

      return renderProductPage(res, username, {
        stockResult: {
          item,
          sold,
          yearly
        }
      });
    }
  );
});

app.post("/revenueCalculator", (req, res) => {
  const { item, username } = req.body;

  productsDB.get(
    "SELECT price, amount_sold FROM Products WHERE item = ?",
    [item],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.render("product", {
          revenueError: "Database error occurred."
        });
      }

      if (!row) {
        return res.render("product", {
          revenueError: `Product "${item}" not found in the database.`
        });
      }

      const price = parseFloat(row.price);
      const sold = parseInt(row.amount_sold);
      const yearlyRevenue = (price * sold * 12).toFixed(2);

      renderProductPage(res, username, {
        revenueResult: {
          item,
          price,
          sold,
          yearlyRevenue
        }
      });
    }
  );
});

initializeDatabases().then(() => {
  app.listen(8081, function () {
    console.log("server listening...");
  });
}).catch((err) => {
  console.error("Database initialization failed:", err);
});

