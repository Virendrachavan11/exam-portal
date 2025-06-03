import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import App from './App.jsx'
import './index.css'

import toast, { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Toaster />
      <App />
    </Provider>
  </StrictMode>,
)
