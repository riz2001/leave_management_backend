const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { absentModel } = require("./models/Absent")
const { hodModel } = require("./models/Hod")
const { facultyLoginModel } = require("./models/Faculty")
const { StudLeavesModel } = require("./models/StudLeave")
const { FacultyLeavesModel } = require("./models/FacultyLeave")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const app = express()
app.use(cors())
app.use(express.json())

const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}


mongoose.connect("mongodb+srv://edisongeorge:edisonmg@cluster0.7y1x5l7.mongodb.net/studentdb?retryWrites=true&w=majority&appName=Cluster0")


app.post("/studsignup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashPassword(input.student_password)
    console.log(hashedPassword)
    input.student_password = hashedPassword
    let absent = new absentModel(input)
    absent.save()
    res.json({ "status": "success" })
})



app.post("/Hodsignup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashPassword(input.HOD_Password)
    console.log(hashedPassword)
    input.HOD_Password = hashedPassword
    let Hod = new hodModel(input)
    Hod.save()
    res.json({ "status": "success" })
})


app.post("/facultySignup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashPassword(input.faculty_password)
    console.log(hashedPassword)
    input.faculty_password = hashedPassword
    let faculty = new facultyLoginModel(input)
    faculty.save()
    res.json({ "status": "success" })
})




app.post("/HodSignIn", (req, res) => {
    let input = req.body
    hodModel.find({ "HOD_username": req.body.HOD_username }).then(
        (response) => {
            if (response.length > 0) {
                let dbHodPassword = response[0].HOD_Password
                console.log(dbHodPassword)
                bcrypt.compare(input.HOD_Password, dbHodPassword, (error, isMatch) => {

                    if (isMatch) {
                        jwt.sign({ HOD_username: input.HOD_username }, "leave_app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ "status": "unable to create token" })
                            }
                            else {
                                res.json({ "status": "success", "userid": response[0]._id, "token": token })
                            }
                        })
                    }
                    else {
                        res.json({ "status": "incorrect" })
                    }
                })

            }
            else {
                res.json({ "status": "User Not Found" })
            }
        }
    )

})



app.post("/studlogin", (req, res) => {
    let input = req.body
    absentModel.find({ "student_username": req.body.student_username }).then(
        (response) => {
            if (response.length > 0) {
                let dbStudPassword = response[0].student_password
                console.log(dbStudPassword)
                bcrypt.compare(input.student_password, dbStudPassword, (error, isMatch) => {

                    if (isMatch) {
                        jwt.sign({ student_username: input.student_username }, "leave_app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ "status": "unable to create token" })
                            }
                            else {
                                res.json({ "status": "success", "userid": response[0]._id, "token": token })
                            }
                        })
                    }
                    else {
                        res.json({ "status": "incorrect" })
                    }
                })

            }
            else {
                res.json({ "status": "User Not Found" })
            }
        }
    )

})



app.post("/facultylogin", (req, res) => {
    let input = req.body
    facultyLoginModel.find({ "faculty_username": req.body.faculty_username }).then(
        (response) => {
            if (response.length > 0) {
                let dbFacultyPassword = response[0].faculty_password
                console.log(dbFacultyPassword)
                bcrypt.compare(input.faculty_password, dbFacultyPassword, (error, isMatch) => {

                    if (isMatch) {
                        jwt.sign({ faculty_username: input.faculty_username }, "leave_app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ "status": "unable to create token" })
                            }
                            else {
                                res.json({ "status": "success", "userid": response[0]._id, "token": token })
                            }
                        })
                    }
                    else {
                        res.json({ "status": "incorrect" })
                    }
                })

            }
            else {
                res.json({ "status": "User Not Found" })
            }
        }
    )

})





app.post("/studaddleave", (req, res) => {
    let input = req.body
    let Stud = new StudLeavesModel(input)
    Stud.save()
    res.json({ "status": "success" })
})




app.post("/facultyaddleave", (req, res) => {
    let input = req.body
    let faculty = new FacultyLeavesModel(input)
    faculty.save()
    res.json({ "status": "success" })
})



app.get("/viewStud", (req, res) => {
    StudLeavesModel.find().then(
        (data => {
            res.json(data)
        })
    )
})



app.get("/viewFaculty", (req, res) => {
    FacultyLeavesModel.find().then(
        (data => {
            res.json(data)
        })
    )
})


app.post("/deletestudent",(req,res)=>{
    let input=req.body
    StudLeavesModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
            }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
    })

    
app.post("/deletefaculty",(req,res)=>{
    let input=req.body
    FacultyLeavesModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
            }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
    })


app.post("/searchleavestud", (req, res) => {
    let input = req.body
    StudLeavesModel.find(input)
        .then(
            (data) => {
                res.json(data)
            }).catch((error) => {
                res.json(error.message)
            })
})

app.post("/searchleavefaculty",(req,res)=> {
    let input = req.body
    FacultyLeavesModel.find(input)
    .then(
        (data) => {
            res.json(data)
            }).catch((error) => {
                res.json(error.message)
                })
})

app.listen(8080, () => {
    console.log("started")
})