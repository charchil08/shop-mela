import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import Header from './components/layout/Header/Header'
import WebFont from "webfontloader"
import Footer from './components/layout/Footer/Footer'

function App() {
  return (
    <Router>
      <Header />
      <Footer />
    </Router>
  )
}

export default App
