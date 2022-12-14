import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Home from './components/layout/Home/Home'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
