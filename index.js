const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.urlencoded());

const csrfProtection = csrf({ cookie: true });

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

const validate = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
 
  const errors = [];

  if (!firstName) {
    errors.push("Please provide a first name.");
  }
  
  if(!lastName){
    errors.push('Please provide a last name.');
  }

  if (!email) {
    errors.push("Please provide an email.");
  }

  if(!password){
    errors.push("Please provide a password.")
  }

  if(password !== confirmedPassword){
    errors.push("The provided values for the password and password confirmation fields did not match.");
  }


  req.errors = errors;
  next();
};

app.get("/", (req, res) => {
  res.render('index', { users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("form", { csrfToken: req.csrfToken() })
});

app.post("/create", csrfProtection, validate, (req, res)=>{
  const { firstName, lastName, email} = req.body;
  //console.log(req.body)
  if (req.errors.length > 0) {
    res.render("form", {
      firstName,
      lastName,
      email,
      errors: req.errors,
    })  
    return;
}
    users.push({id:users.length + 1,firstName, lastName, email})
    res.redirect('/');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
