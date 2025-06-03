import express from 'express';
import { Exam } from "../models/examdb.js";

const router = express.Router()


router.get('/', async(req, res) => {

  try {
    const exm = await Exam.find()
    if (!exm) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json(exm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


router.get('/:id', async (req, res) => {
  try {
    const exm = await Exam.findById(req.params.id);
   
    if (!exm) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
 
export default router;