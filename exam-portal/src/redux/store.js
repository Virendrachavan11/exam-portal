import { configureStore } from '@reduxjs/toolkit'
import currentIndexReducer from '../features/QueStatusSlice'
import authReducer from "../features/authSlice";
import examMmtReducer  from "../features/ExamMmtSlice"


export const store= configureStore({
  reducer: {
    currentIndex:currentIndexReducer,
    auth: authReducer,
    examMmt:examMmtReducer,
  }
})