import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'
import CpuProcess from './pages/cpu-process'
import './styles.css'
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path="/cpu-process" element={<CpuProcess />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
