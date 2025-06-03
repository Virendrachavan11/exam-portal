import { createSlice } from "@reduxjs/toolkit";

const ExamMmtSlice = createSlice({
  name: "ExamMmt",
  initialState: {
    examinfos: JSON.parse(localStorage.getItem("examinfo")) || null,
    isRunningTime: false,
  },
  reducers: {

    setNewExam(state, action) {
      state.examinfos = action.payload;
      localStorage.setItem("examinfo", JSON.stringify(action.payload));
    },
    updateQuestionInfo(state, action) {
      const { QueIndex, value } = action.payload; 
      
      if (state.examinfos && state.examinfos.questions && state.examinfos.questions[QueIndex]) {
        state.examinfos.questions[QueIndex].givenAns = value; 

        localStorage.setItem("examinfo", JSON.stringify(state.examinfos));
      }
    },

    resetExamInfo(state) {

      if (state.examinfos) {
        state.examinfos = null; 
        localStorage.setItem("examinfo", JSON.stringify(state.examinfos));
      }
    },


    startTimer: (state) => {
      state.isRunningTime = true;
    },
    stopTimer: (state) => {
      state.isRunningTime = false;
    },
    // resetTimer: (state, action) => {
    //   state.timeLeft = action.payload || 60; // Reset to default or given time
    //   state.isRunningTime = false;
    // },
    tick: (state) => {
      if (state.isRunningTime && state.examinfos && state.examinfos.TimeLeft && state.examinfos.TimeLeft > 0 ) {
        state.examinfos.TimeLeft -= 1;

        localStorage.setItem("examinfo", JSON.stringify(state.examinfos));
      } else {
        state.isRunningTime = false; // Stop when it reaches 0
      }
    },
    
  },
});

export const { setNewExam, updateQuestionInfo,startTimer,stopTimer,tick,resetExamInfo } = ExamMmtSlice.actions;
export default ExamMmtSlice.reducer;
