const {pool}= require('./database');
const jwt = require('jsonwebtoken');
const randomId = require('randomid')


const DECODE = 'decode'

exports.examList=(req,res)=>{
    const id = req.params.adminKEY

    const GET_ADMIN = `SELECT * FROM adminac WHERE adminId = "${id}"`
    pool.query(GET_ADMIN, (error, resp)=>{
        if(error) return res.json({error:true,message:"admin not exist"});
        else if (resp=="") return res.json({error:true,message:"admin not exist"});
        else{
            const GET_EXAM = `SELECT * FROM exam`
            pool.query(GET_EXAM, (error, respo)=>{
                if(error) return res.json({error:true})
                else if(respo == "") return res.json({error:true})
                else return res.json({success:true, data:respo})
            })
        }
    })

}

exports.checkAdmin = (req, res) =>{
    const id = req.params.adminKEY

    const GET_ADMIN = `SELECT * FROM adminac WHERE adminId = "${id}"`
    pool.query(GET_ADMIN, (error, resp)=>{
        if(error) return res.json({error:true,message:"admin not exist"});
        else if (resp=="") return res.json({error:true,message:"admin not exist"});
        return res.json({success:true,message:"Woohooo you'r admin"});
    })
}

exports.loginAdmin = (req, res)=>{
    const data={
        userName:req.body.userName,
        password:req.body.password
    }

    if(data.userName == "") return res.json({userName:'must not empty'})
    if(data.password== "") return res.json({password:'must not empty'})

    const GET_ADMIN = `SELECT * FROM adminac WHERE userName = "${data.userName}" AND password = "${data.password}"`
    pool.query(GET_ADMIN, (error, response)=>{
        if(error) return res.json({error:true})
        else if(response == "") return res.json({error:true, message:"Administrator not registered!!"})
        else{
            const admin_id = response[0].adminId
            return res.json({admin_id, success:true})
        }
    })
}

exports.createExam = (req, res) =>{
   

    const data = {
        testName:req.body.testName,
        time:req.body.time,
        
        total_marks:req.body.total_marks,
        class:req.body.class,
        
    }
    
    if(data.testName == "") return res.json({title:'must not empty'})
    if(data.time == "") return res.json({time:'must not empty'})
    if(data.total_marks == "") return res.json({marks:'must not empty'})
    if(data.class=="") return res.json({class:"select any class"})

    

    const exam_id=  randomId(14, 'aA0')
    const d = {
        exam_id:exam_id,
        time:data.time,
        testName:data.testName,
        createdAt:new Date().toISOString(),
        total_marks:data.total_marks,
        class:data.class

    }
    //return res.json(d)
    const ADD_EXAM = `INSERT INTO exam SET ?`
    pool.query(ADD_EXAM, d, (err, resp)=>{
        if(err) return res.json(err);
        return res.json({exam_id, success:true})
    })
}

exports.createUser=(req,res)=>{
    const user = req.body.user
    const time= req.body.time;

    if(user=="" || (time =="") ) return res.json({data:'empty data'}) 
    
    

    const data = {
        
        userName:user
    }
    const ADD_USER = `INSERT INTO userdata SET ?`
    pool.query(ADD_USER, data, (error, resp)=>{
        if(error) return res.json(error)
        else {
            return res.json({success:true,resp})
        }
    })
}

exports.getAllQuestionByExamID = (req, res) =>{ 
    const exam_id = req.params.examID

    const GET_QUEST = `SELECT * FROM questions WHERE exam_id = ?`
    pool.query(GET_QUEST, exam_id, (error, resp)=>{
        if(error) return res.json({error:true})
        else if(resp =="") return res.json({error:true, message:"exam not found"})
        else{
            return res.json({success:true, data:resp})
        }
    })
}
exports.addQuestion=(req,res)=>{

    const exam_id = req.params.examID
    
    const ques = {
        questions:req.body.questions,
        option_1:req.body.option_1,
        option_2:req.body.option_2,
        option_3:req.body.option_3,
        option_4:req.body.option_4,
        ans:req.body.ans,
        marks:req.body.marks,
    }

    if(ques.questions == "") return res.json({questions:'must not be empty'})
    if(ques.option_1 == "") return res.json({option_1:'must not be empty'})
    if(ques.option_2 == "") return res.json({option_2:'must not be empty'})
    if(ques.option_3 == "") return res.json({option_3:'must not be empty'})
    if(ques.option_4 == "") return res.json({option_4:'must not be empty'})
    if(ques.ans == "") return res.json({ans:'select any one'})
    if(ques.marks == "") return res.json({marks:'must not be empty'})

    const data = {
        questions:ques.questions,
        option_1:ques.option_1,
        option_2:ques.option_2,
        option_3:ques.option_3,
        option_4:ques.option_4,
        ans:ques.ans,
        marks:ques.marks,
        exam_id:exam_id

    }
    const ADD_QUES = `INSERT INTO questions SET ?`
    pool.query(ADD_QUES, data, (err,resp)=>{
        if(err){return res.json({error:true});
        }else{return res.json({success:true})}
    } )

   
}

