import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';

const QueSchema = new mongoose.Schema({
    Question: {type: String, required: true},
    QueTrans:{type: String, required: true},
    option1: {type: String, required: true},
    option2: {type: String, required: true},
    option3: {type: String, required: true},
    option4: {type: String, required: true},
    option1t: {type: String, required: true},
    option2t: {type: String, required: true},
    option3t: {type: String, required: true},
    option4t: {type: String, required: true},
    ans: {type: String, required: true},
    photo: {
        type: String,
      },
});

const ExamSchema = new mongoose.Schema({
    examTitle: { 
        type: String, 
        required: true,
        default: 'Untitled Exam' 
    },
    examType: { 
        type: String, 
        default: 'Practice Test' 
    },
    examDesc: { 
        type: String, 
        required: true,
        default: 'No Description Provided' 
    },
    examlang: { 
        type: String, 
        required: true,
        default: 'Not Provided' 
    },
    examDuration: {
        type: Number,
        required: true,
        default: 60
    },
    MarkPerQue: { 
        type: Number, 
        default: 1 
    },
    createdby: { type: String, required: true },
    questions: [QueSchema],
});


const UserSchema = new mongoose.Schema({
    EmailId: { 
        type: String, 
        required: true,
    },
    Password: { 
        type: String, 
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ["Admin", "Supervisor", "Candidate"], // Allowed user types
        default: "Candidate", 
     },

     resetOtp: { type: String, default: null }, // Stores OTP
     otpExpiry: { type: Date, default: null }, // Stores OTP expiry time
});

        
        UserSchema.statics.signup = async function (EmailId, Password, userType)
        {
            const exists = await this.findOne({EmailId})
            if(exists){
                throw Error("This Email Is Already Used")
            }

            if (!validator.isEmail(EmailId)) {
                throw Error("Invalid email address");
            }  
            
            if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(Password) || Password.length < 6) {
                throw Error("Password must be at least 6 characters, include a letter, a number, and a symbol.");
            }
            
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(Password,salt)

            const user=await this.create({EmailId,Password: hash,userType})
            return user 


        }


        UserSchema.statics.login = async function (EmailId, Password)
        {
            if(!EmailId || !Password){
                throw Error("All fields must be filled")
            }

            const user = await this.findOne({EmailId})

            if(!user)
            {
                throw Error('Incorrect Email')
            }

            const match = await bcrypt.compare(Password, user.Password)

            if(!match)
            {
                throw Error('Incorrect Password')
            }


            return user 
        }


const candidateDataSchema = new mongoose.Schema({
    emailID: { type: String, required: true, unique: true },
    nameofCand: { type: String, required: true },
    rollNo: { type: Number, required: true },
    createdby: { type: String, required: true },
    photo: {
        type: String,
        default: 'assets/default.png', 
      },
    addedStudentGroups:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentGroupdata' 
    },],
    examlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam' 
    },]
    
}, { versionKey: false });


const examscheduleSchema = new mongoose.Schema({
    scheduleName: { type: String, required: true},
    scheduledTime: { type: Date, required: true },
    Exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam' 
    },
});

const studentGroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true,},

    selectedCandidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'candidatedata' 
        }
    ],
    examschedules:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'examscheduledata' 
        }
    ]
});

const supervisorDataSchema = new mongoose.Schema({
    emailID: { type: String, required: true, unique: true },
    nameofsv: { type: String, required: true },
    orgName: { type: String, required: true },
    createdby: { type: String, required: true },
    ContactNumber: { type: String, required: true },
    photo: {
        type: String,
        default: 'uploads/default.png', 
      },
    exmSchedules:[examscheduleSchema],
    studentGroups:[studentGroupSchema]
});

const resultDataSchema = new mongoose.Schema({

    scheduleID: { type: String, required: true, unique: true },
    scheduleName: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    examTitle: { type: String, required: true },
    totalMarks: { type: Number, required: true},
    svEmailID:{ type: String, required: true },
    CandData:[{

        emailID: { type: String, required: true},
        nameofCand: { type: String, required: true},
        rollNo: { type: Number, required: true },
        marks:{ type: Number, required: true},
        submittedQuestions: [{
            questionID: String,
            question: String,
            options: {
              option1: String,
              option2: String,
              option3: String,
              option4: String,
            },
            correctAns: String,
            givenAns: String,
          }]


    }],

});








export const Que = mongoose.model('Que', QueSchema);
export const Exam = mongoose.model('Exam', ExamSchema);
export const User = mongoose.model('User', UserSchema);
export const candidatedata = mongoose.model('candidatedata', candidateDataSchema);
export const supervisordata = mongoose.model('supervisordata', supervisorDataSchema);
export const examscheduledata= mongoose.model('examscheduledata', examscheduleSchema);
export const studentGroupdata = mongoose.model('studentGroupdata', studentGroupSchema);
export const resultData= mongoose.model('resultDataSchema', resultDataSchema);