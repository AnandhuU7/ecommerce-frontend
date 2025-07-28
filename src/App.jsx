import React from 'react'
import { Route, Routes } from "react-router";
import HomePage from './pages/HomePage'
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/Dashboard';

const App = () => {
  return (
    <div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element={<AdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App