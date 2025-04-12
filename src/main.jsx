import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Provide from './utils/Provide'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provide> <App /></Provide>
  </StrictMode>,
)
