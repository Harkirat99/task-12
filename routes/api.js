let express = require("express");
let router = express.Router();
let TaskController = require('../app/Controllers/Api/TaskController')
let UserController = require("../app/Controllers/Api/UserController");

var user = new UserController();
var task = new TaskController();


router.post("/login", [], (req, res) => {
  return user.login(req, res);
});

router.post("/logout", [], (req, res) => {
  return user.logout(req, res);
});

router.post("/getMyTasks", [], (req, res) => {
  return user.getMyTasks(req, res);
});

router.post("/createTask", [], (req, res) => {
  return user.createTask(req, res);
});

router.post("/updateTask", [], (req, res) => {
  return user.updateTask(req, res);
});


router.post("/deleteTask", [], (req, res) => {
  return user.deleteTask(req, res);
});


module.exports = router;
