import React from 'react'
import ReactDOM from 'react-dom/client'
// import DirectiveTester from './components/DirectiveTester'; // Comentado
import App from './App' // Descomentado
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <DirectiveTester /> */}
    <App />
  </React.StrictMode>,
) 