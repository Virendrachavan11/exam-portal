import { createSlice } from '@reduxjs/toolkit'

export const currentIndexSlice = createSlice({
  name: 'currentIndex',
  initialState: {
    value: 0
  },
  reducers: {
    nextQue: state => {
      state.value += 1
    },
    preQue: state => {
      state.value -= 1
    },
    QuickJump: (state, action) => {
      state.value = Number(action.payload)
    },
    ResetQueCount: (state) => {
      state.value = 0
    },
  }
})

// Action creators are generated for each case reducer function
export const { nextQue,preQue,QuickJump,ResetQueCount } = currentIndexSlice.actions

export default currentIndexSlice.reducer