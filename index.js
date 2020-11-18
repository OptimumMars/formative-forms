const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.set("view engine", "pug");

app.use(cookieParser())

const csrfProtection = csrf({ cookie: true });

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render('index', { users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("form", { csrfToken: req.csrfToken() })
});

// app.get("/create")


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
