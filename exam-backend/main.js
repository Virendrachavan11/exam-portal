import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { Que } from "./models/examdb.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GridFSBucket } from 'mongodb';



import Exam from './routers/Exam_router.js'
import ManageExam from "./routers/ManageExam_Router.js";
import UserRouter from "./routers/user-router.js";
import ManageCand from "./routers/ManageCand_Router.js"
import ProfileSv from "./routers/SVProfile_mmt_route.js";
import ManageExamLaunchpad from "./routers/ManageExamLaunchpad_router.js"
import ManageResult from "./routers/ManageResult_Router.js"

import CandExamRouter from "./routers/candidateRouters/CandExamRouter.js"

import ManageSv from "./routers/superAdminRoutes/ManageSv_Routers.js"

import convertDatesMiddleware from "./middleware/convertDatesToIST.js";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// app.use(convertDatesMiddleware);

app.use(express.static('public'));  
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

const allowedOrigins = [
  'https://exam-portal-eyn2.onrender.com',
  // 'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors()); 

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));




app.use('/exam', Exam)
app.use('/Manage-exam', ManageExam)
app.use('/user', UserRouter)
app.use('/Candidates', ManageCand)
app.use('/ProfileSv', ProfileSv)
app.use('/ExamLaunchpad', ManageExamLaunchpad)
app.use('/ManageResult', ManageResult)


app.use('/Candidate-exam', CandExamRouter)
app.use('/ManageSV', ManageSv)

app.get('/', async (req, res) => {

    
  res.send("Connected")
});

app.get('/queList', async (req, res) => {

  try {
    const ques = await Que.find();
    res.status(200).json(ques);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

app.post('/addQue', async (req, res) => {

  console.log(req.body.Question);

    const que = new Que({
      Question: req.body.Question,
      QueTrans: req.body.QueTrans,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3,
      option4: req.body.option4,
      ans: req.body.ans 

    });
    await que.save();

});




mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');

  // GridFS route should be inside this block
  app.get('/uploads/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await db.collection('uploads.files').findOne({ _id: fileId });

    if (!files) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set({
      'Content-Type': files.contentType,
      'Content-Disposition': `inline; filename="${files.filename}"`,
    });

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });

  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


  // ✅ Now safe to start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

app.get('/list-uploaded-files', async (req, res) => {
  const files = await mongoose.connection.db.collection('uploads.files').find({}).toArray();
  res.json(files.map(f => f.filename));
});
