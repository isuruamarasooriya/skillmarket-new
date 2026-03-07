import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import CreateService from './pages/CreateService'
import MyServices from './pages/MyServices'
import EditService from './pages/EditService'
import ServiceDetails from './pages/ServiceDetails'
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ContactSeller from './pages/ContactSeller'

function App() {
  return (
    <BrowserRouter>

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/create-service" element={<ProtectedRoute><CreateService/></ProtectedRoute>}/>
        <Route path="/my-services" element={<ProtectedRoute><MyServices/></ProtectedRoute>}/>
        <Route path="/edit-service/:id" element={<ProtectedRoute><EditService/></ProtectedRoute>}/>
        <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails/></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/contact-seller/:id' element={<ProtectedRoute><ContactSeller/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App