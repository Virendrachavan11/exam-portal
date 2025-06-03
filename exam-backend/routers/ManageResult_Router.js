import express from 'express';
import { resultData } from "../models/examdb.js";

const router = express.Router()


router.get('/:emailID', async(req, res) => {

  try {
    const rst= await resultData.find({ svEmailID: req.params.emailID })

    if (!rst) {
      return res.status(404).json({ message: 'result list not found' });
    }

    res.status(200).json(rst);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


router.delete('/DeleteResult/:resultID', async (req, res) => {
  try {
    const { resultID } = req.params;

    const deletedResult = await resultData.findByIdAndDelete(resultID);

    if (!deletedResult) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json({ message: 'Result deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
export default router;