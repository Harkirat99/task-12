const { User, UserSession } = require("../../Models");
let bcrypt = require("bcrypt");
let sha256 = require("sha256");
let moment = require("moment");
let { Op } = require("sequelize");
let { formatJoiError, ucfirst, isset, strlen, strpos, count, authUser, in_array, rand, validateParameters } = require('../../../helper/helper');

module.exports = class UserController {

  async login(req, res) {

    // request input
    let input = req.body;

    // validate parameteres
    let result = validateParameters(["email", "password", "name"], input);
    if (result != 'valid') {
      let error = formatJoiError(result.errors);
      return res.status(400).send({
        type: "RXERROR",
        message: "Invalid params",
        errors: error
      });
    }

    // Input params
    let email = isset(input.email, "");
    let name = isset(input.name, "");
    let password = isset(input.password);

    let responseMessage = "";
    let username;

    // check if email already exists
    let userData = await User.findOne({
      where: { email: email },
    });

    if (userData == null) {

      // create username & password
      username = await this.createUsername(email);
      password = bcrypt.hash(input.password, 12)

      userData = await User.create({
        name: name,
        email: email,
        username: username.replace(/[^0-9A-Za-z\_]+/gm, ""),
        password: password
      });

      responseMessage = "Account created Successfully"
    } else {

      let compare = await bcrypt.compare(password, userData.password);

      if (!compare) {
        return res.status(400).send({
          type: "RXERROR",
          message: "Invalid Password"
        })
      }
      responseMessage = "Logged in Successfully"
    }

    // create new token
    let token = sha256(
      "TASK_USER" + userData.id + "-" + Math.floor(Date.now() / 1000)
    );

    // expire old session
    await UserSession.update({ expires_at: Sequelize.literal("now()"), }, {
      where: {
        user_id: userData.id,
      },
    }
    );


    // create new session
    await UserSession.create({
      user_id:  userData.id,
      token: token,
      expires_at: moment().add(1, "year").format("YYYY-MM-DD HH:mm:ss"),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    // expire old session
    await UserSession.update({ expires_at: Sequelize.literal("now()"), }, {
      where: {
        user_id: user_id,
      },
    }
    );

    // create new
    await UserSession.create({
      user_id: userData.id,
      token: token,
      expires_at: moment().add(1, "year").format("YYYY-MM-DD HH:mm:ss"),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return res.send({
      "type": "RXSUCCESS",
      "message": responseMessage,
      "data": userData
    });



  }
  
  async  logout(req, res) {

    // request input
    let input = req.body;

    // get user_id from token
    let user_id = req.authUser.user_id

    // validate parameteres
    let result = validateParameters(["email"], input);
    if (result != 'valid') {
      let error = formatJoiError(result.errors);
      return res.status(400).send({
        type: "RXERROR",
        message: "Invalid params",
        errors: error
      });
    }

    let data = await User.findOne({
      where:{
        id: user_id
      }
    })

    if(data == null) {
      return res.status(404).send({
        type:"RXERROR",
        message: "You are not authorized to logout"
      })
    }else{
      await User.destroy({
        where:{
          id: user_id
        }
      })
    }

    return res.status(200).send({
      type:"RXSUCCESS",
      message:"Logged out successfully!"
    })
  }


  async createUsername(email) {
    let username;
    let uniqueUsername = false;

    // Iterate
    do {
      if (email == null) {
        username = "myUSER" + rand(1111, 9999) + rand(1111, 9999);
      } else {
        username = email.split("@")[0] + "" + rand(111, 999);
      }

      // Check the assigned username is unique
      if (count(await User.findAll({ where: { username: username } })) < 1) {
        uniqueUsername = true;
      }
    } while (!uniqueUsername);

    return username;
  }
};



