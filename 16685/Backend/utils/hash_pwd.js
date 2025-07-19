const bcrypt = require("bcryptjs");

const plainPassword = "admin@12345"; 

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
