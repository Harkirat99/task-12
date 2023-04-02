const { User, UserSession, Task } = require("../../Models");
let bcrypt = require("bcrypt");
let moment = require("moment");
module.exports = class UserController {


  async getMyTasks(req, res) {

    let input = req.body;

    let user_id = req.authUser.user_id;
    
    // pagination logic
    let limit = parseInt(isset(input.limit, 10));
    let offset = 0 + (isset(input.page, 1) - 1) * limit;
    if (offset < 1) {
      offset = 0;
    }

    let entities = await Task.findAll({
        where:{
            user_id: user_id
        }
    })

    if(entities.length == 0) {
        return res.status(400).send({
            type:"RXERROR",
            message:"No Records Found!"
        })
    }

    return res.status(200).send({
        type:"RXSUCCESS",
        message:"Data Fetched Successfully!",
        data: entities
    })
  }

  async createTask(req, res) {

    let input = req.body;
    let user_id = req.authUser.user_id
    // validate parameteres
    let result = validateParameters(["title", "description", "due"], input);
    if (result != 'valid') {
        let error = formatJoiError(result.errors);
        return res.status(400).send({
        type: "RXERROR",
        message: "Invalid params",
        errors: error
        });
    }

    let data = await Task.create({
        user_id: user_id,
        title: input.title,
        description: input.description,
        due: moment().add(parseInt(input.due), 'days').format('YYYY-MM-DD HH:mm:ss')
    })

    return res.status(200).send({
        type:"RXERROR",
        message: "Data Created Successfully!",
        data: data
    })
    
  }

  async updateTask(req, res) {

    let input = req.body;

    let result = validateParameters(["task_id"], input);

    if (result != 'valid') {
        let error = formatJoiError(result.errors);
        return res.status(400).send({
        type: "RXERROR",
        message: "Invalid params",
        errors: error
        });
    }
    let user_id = req.authUser.user_id;


    let task = await Task.findOne({
        where:{
            id: input.task_id,
            user_id: user_id
        }
    })

    if(task == null) {
        return res.status(400).send({
            type:"RXERROR",
            message:"No Task Found!"
        })
    }

    let updateStatement = {};

    if(input.title) {
        updateStatement.title = input.title
    }
    if(input.description) {
        updateStatement.description = input.description
    }
    if(input.due) {
        let timestamp = moment(task.due).add(input.due, 'days').format('YYYY-MM-DD HH:mm:ss')
        updateStatement.due = timestamp
    }

    await Task.update(updateStatement, {
        where:{
            id: input.task_id,
            user_id: user_id
        }
    })

    return res.status(200).send({
        type:"RXSUCCESS",
        message: "Data Updated Successfully!"
    })
  }

  async deleteTask(req, res) {

    let input = req.body;

    let user_id = req.authUser.user_id;

    let result = validateParameters(["task_id"], input);

    if (result != 'valid') {
        let error = formatJoiError(result.errors);
        return res.status(400).send({
        type: "RXERROR",
        message: "Invalid params",
        errors: error
        });
    }


    await Task.destroy({
        where:{
            id: input.task_id,
            user_id: user_id
        }
    })

    return res.status(200).send({
        type: "RXSUCCESS",
        message: "Task Removed Successfully!"
    })
  }



};



