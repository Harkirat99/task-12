let User = require("../../Models/User");
let fs = require("fs");
const saltRounds = 10;

module.exports = class UserController {
  login(req, res) {
    res.send({ status: "200", type: "RXERROR", message: "No user found!!!" });
  }
};
