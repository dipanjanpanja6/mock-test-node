const { pool } = require("./database");
const jwt = require("jsonwebtoken");
const randomId = require("randomid");
const DECODE = "decode";

exports.examList = (req, res) => {
  const id = req.params.adminKEY;

  const GET_ADMIN = `SELECT * FROM adminac WHERE adminId = "${id}"`;
  pool.query(GET_ADMIN, (error, resp) => {
    if (error) return res.json({ error: true, message: "admin not exist" });
    else if (resp == "")
      return res.json({ error: true, message: "admin not exist" });
    else {
      const GET_EXAM = `SELECT * FROM exam`;
      pool.query(GET_EXAM, (error, respo) => {
        if (error) return res.json({ error: true });
        else if (respo == "") return res.json({ error: true });
        else return res.json({ success: true, data: respo });
      });
    }
  });
};
exports.checkAdmin = (req, res) => {
  const id = req.params.adminKEY;

  const GET_ADMIN = `SELECT * FROM adminac WHERE adminId = "${id}"`;
  pool.query(GET_ADMIN, (error, resp) => {
    if (error) return res.json({ error: true, message: "admin not exist" });
    else if (resp == "")
      return res.json({ error: true, message: "admin not exist" });
    return res.json({ success: true, message: "Woohooo you'r admin" });
  });
};
exports.loginAdmin = (req, res) => {
  const data = {
    userName: req.body.userName,
    password: req.body.password
  };

  if (data.userName == "") return res.json({ userName: "must not empty" });
  if (data.password == "") return res.json({ password: "must not empty" });

  const GET_ADMIN = `SELECT * FROM adminac WHERE userName = "${data.userName}" AND password = "${data.password}"`;
  pool.query(GET_ADMIN, (error, response) => {
    if (error) return res.json({ error: true });
    else if (response == "")
      return res.json({
        error: true,
        message: "Administrator not registered!!"
      });
    else {
      const admin_id = response[0].adminId;
      return res.json({ admin_id, success: true });
    }
  });
};
exports.createExam = (req, res) => {
  const data = {
    testName: req.body.testName,
    time: req.body.time,
    total_marks: req.body.total_marks,
    class: req.body.class
  };

  if (data.testName == "") return res.json({ title: "must not empty" });
  if (data.time == "") return res.json({ time: "must not empty" });
  if (data.total_marks == "") return res.json({ marks: "must not empty" });
  if (data.class == "") return res.json({ class: "select any class" });

  const exam_id = randomId(14, "aA0");
  const d = {
    exam_id: exam_id,
    time: data.time,
    testName: data.testName,
    createdAt: new Date().toISOString(),
    total_marks: data.total_marks,
    class: data.class
  };
  //return res.json(d)
  const ADD_EXAM = `INSERT INTO exam SET ?`;
  pool.query(ADD_EXAM, d, (err, resp) => {
    if (err) return res.json(err);
    return res.json({ exam_id, success: true });
  });
};
exports.createUser = (req, res) => {
  const user = req.body.user;
  const time = req.body.time;

  if (user == "" || time == "") return res.json({ data: "empty data" });

  const data = {
    userName: user
  };
  const ADD_USER = `INSERT INTO userdata SET ?`;
  pool.query(ADD_USER, data, (error, resp) => {
    if (error) return res.json(error);
    else {
      return res.json({ success: true, resp });
    }
  });
};
exports.getAllQuestionByExamID = (req, res) => {
  const exam_id = req.params.examID;

  const GET_QUEST = `SELECT * FROM questions WHERE exam_id = ?`;
  pool.query(GET_QUEST, exam_id, (error, resp) => {
    if (error) return res.json({ error: true });
    // else if(resp =="") return res.json({error:true, message:"exam not found"})
    else {
      return res.json({ success: true, data: resp });
    }
  });
};
exports.addQuestion = (req, res) => {
  const exam_id = req.params.examID;

  const ques = {
    questions: req.body.questions,
    option_1: req.body.option_1,
    option_2: req.body.option_2,
    option_3: req.body.option_3,
    option_4: req.body.option_4,
    ans: req.body.ans,
    marks: req.body.marks
  };

  if (ques.questions == "") return res.json({ questions: "must not be empty" });
  if (ques.option_1 == "") return res.json({ option_1: "must not be empty" });
  if (ques.option_2 == "") return res.json({ option_2: "must not be empty" });
  if (ques.option_3 == "") return res.json({ option_3: "must not be empty" });
  if (ques.option_4 == "") return res.json({ option_4: "must not be empty" });

  if (ques.marks == "") return res.json({ marks: "must not be empty" });
  if (ques.ans === "") return res.json({ ans: "select any one" });

  const data = {
    questions: ques.questions,
    option_1: ques.option_1,
    option_2: ques.option_2,
    option_3: ques.option_3,
    option_4: ques.option_4,
    ans: ques.ans,
    marks: ques.marks,
    exam_id: exam_id
  };
  const ADD_QUES = `INSERT INTO questions SET ?`;
  pool.query(ADD_QUES, data, (err, resp) => {
    if (err) {
      return res.json({ error: true });
    } else {
      return res.json({ success: true });
    }
  });
};
exports.deleteQuestion = (req, res) => {
  const adminID = req.params.adminID;
  const examID = req.params.examID;
  const quesID = req.params.quesID;

  const GET_ADMIN = `SELECT * FROM adminac WHERE adminId = "${adminID}"`;
  const GET_QUEST = `SELECT * FROM questions WHERE id = "${quesID}"`;
  const GET_EXAM = `SELECT * FROM exam WHERE exam_id="${examID}"`;
  const DELETE_QUES = `DELETE FROM questions WHERE id = "${quesID}" `;
  pool.query(GET_ADMIN, (error, resp) => {
    if (error) return res.json({ error: true, message: "admin not exist" });
    else if (resp == "")
      return res.json({ error: true, message: "admin not exist" });
    else {
      pool.query(GET_EXAM, (error, resp) => {
        if (error)
          return res.json({ error: true, message: "exam not available" });
        else if (resp == "")
          return res.json({ error: true, message: "exam not available" });
        else {
          pool.query(GET_QUEST, (error, resp) => {
            if (error)
              return res.json({
                error: true,
                message: "Question ID not exist"
              });
            else if (resp == "")
              return res.json({
                error: true,
                message: "Question ID not exist"
              });
            else {
              pool.query(DELETE_QUES, (err, resp) => {
                if (error)
                  return res.json({
                    error: true,
                    message: "Question not exist"
                  });
                else if (resp == "")
                  return res.json({
                    error: true,
                    message: "Question not found"
                  });
                return res.json({ success: true });
              });
            }
          });
        }
      });
    }
  });
};
exports.updateQuestion = (req, res) => {
  const exam_id = req.params.examID;
  const ques_id = req.params.quesID;

  const ques = {
    questions: req.body.questions,
    option_1: req.body.option_1,
    option_2: req.body.option_2,
    option_3: req.body.option_3,
    option_4: req.body.option_4,
    ans: req.body.ans,
    marks: req.body.marks
  };
  console.log(ques);
  if (ques.questions == "") return res.json({ questions: "must not be empty" });
  if (ques.option_1 == "") return res.json({ option_1: "must not be empty" });
  if (ques.option_2 == "") return res.json({ option_2: "must not be empty" });
  if (ques.option_3 == "") return res.json({ option_3: "must not be empty" });
  if (ques.option_4 == "") return res.json({ option_4: "must not be empty" });

  if (ques.marks == "") return res.json({ marks: "must not be empty" });
  if (ques.ans === "") return res.json({ ans: "select any one" });

  const ADD_QUES = `UPDATE questions SET questions='${ques.questions}',ans='${ques.ans}',option_1='${ques.option_1}',option_2='${ques.option_2}',option_3='${ques.option_3}',option_4='${ques.option_4}',marks='${ques.marks}' WHERE id='${ques_id}' AND exam_id='${exam_id}'`;
  pool.query(ADD_QUES, (err, resp) => {
    if (err) {
      return res.json({ error: err });
    } else {
      return res.json({ success: true });
    }
  });
};
exports.studentAdd = (req, res) => {
  const userData = {
    userName: req.body.userName,
    userClass: req.body.userClass,
    userLoginID: req.body.userLoginID
  };
  if (userData.userName === "" || userData.userClass === "") {
    return res.json({ userName: "is require", userClass: "is require" });
  }
  const data = {
    userName: userData.userName,
    user_id: randomId(20, "aA0"),
    class: userData.userClass,
    createdAt: new Date().toISOString(),
    login_id: userData.userLoginID
  };
  const ADD_QUES = `INSERT INTO userdata SET ?`;
  pool.query(ADD_QUES, data, (err, resp) => {
    if (err) return res.json({ error: err });
    return res.json({ resp });
  });
};
exports.getUserClass = (req, res) => {
  const GET_CLASS = `SELECT class FROM class`;
  pool.query(GET_CLASS, (error, response) => {
    if (error) return res.json({ error });
    if (response == "") return res.json({ error: "error" });
    return res.json({ success: true, data: response });
  });
};
exports.addClass = (req, res) => {
  const classID = req.body.class;
  const time = new Date().toISOString();
  const GET_CLASS = `SELECT class FROM class WHERE class="${classID}"`;
  pool.query(GET_CLASS, (error, response) => {
    if (error) return res.json({ error });
    else if (response != "") return res.json({ classAE: "class alredy exist" });
    else {
      const ADD_CLASS = `INSERT INTO class(class, createdAt) VALUES ("${classID}","${time}")`;
      pool.query(ADD_CLASS, (error, response) => {
        if (error) return res.json(error);
        if ((response = "")) return res.json({ error: true });
        return res.json({ success: true, data: response });
      });
    }
  });
};
exports.editClass =async(req,res) =>{
  const classID = req.body.class;
  const className=req.params.className;

      const EDIT_CLASS = `UPDATE class SET class="${classID}" WHERE class = "${className}"`;
      pool.query(EDIT_CLASS, (error, response) => {
        if (error) return res.json(error);
        if ((response = "")) return res.json({ error: true });
        else{
          const updateUserClass= `UPDATE userdata SET class= "${classID}" WHERE class = "${className}"`
          pool.query(updateUserClass, (error, response) => {
            if (error) return res.json(error);
            if ((response = "")) return res.json({ error: true });
        
            return res.json({ success: true, data: response });
          })
        }
      });
    
}
exports.studentList = (req, res) => {
  const classID = req.params.classID;
  const GET_STUDENT_BY_ID = `SELECT * FROM userdata WHERE class="${classID}"`;
  pool.query(GET_STUDENT_BY_ID, (ERR, resp) => {
    if (ERR) return res.json({ error: ERR });
    // else if ("") throw ERR;
    else {
      return res.json({
        success: true,
        data: resp
      });
    }
  });
};
