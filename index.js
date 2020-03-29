const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const {pool} = require('./database');
const app = express();
app.use(cors({origin:"*"}));
app.options('*', cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const {editClass,addClass,getUserClass,studentList,studentAdd,updateQuestion,deleteQuestion,examList,createUser,createExam,addQuestion, getAllQuestionByExamID,checkAdmin, loginAdmin} = require('./admin')

app.post('/admin', createUser)
app.post('/admin/addExam', createExam)
app.get('/admin/examList/:adminKEY', examList)
app.get('/admin/quesList/:examID', getAllQuestionByExamID)
app.post('/admin/addQues/:examID', addQuestion)

app.put('/admin/update/:examID/:quesID', updateQuestion)
app.post('/admin/login', loginAdmin)
app.get('/admin/check/:adminKEY', checkAdmin)
app.post('/admin/student/add', studentAdd)
app.post('/admin/student/class/add', addClass)
app.post('/admin/student/class/edit/:className', editClass)
app.get('/admin/student/list/:classID', studentList)
app.get('/admin/student/class', getUserClass)
app.delete('/:adminID/:examID/:quesID/delete', deleteQuestion)
app.post('/login', (req, res)=>{
    const user = req.body.user
    const GET_QUERY = `SELECT * FROM userdata WHERE userName = ?`
    pool.query(GET_QUERY, user,(error, reposon)=>{
        if(error) return res.json(error)
        else if (reposon == "") return res.json({found:false,message:"user not found"})
        else{
            return res.json({found:true})
        
        }
    })
})
app.get('/exam/:examID/questions', (req, res)=>{
    const exam_id = req.params.examID

    const GET_QUEST = `SELECT * FROM questions WHERE exam_id = ?`
    pool.query(GET_QUEST, exam_id, (error, resp)=>{
        if(error) return res.json({error:true})
        else if(resp =="") return res.json({error:true, message:"exam not found"})
        else{
            return res.json({success:true, data:resp})
        }
    })
})



app.listen(7000);