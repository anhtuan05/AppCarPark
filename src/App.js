import './App.css';
import { Routes, Route } from 'react-router-dom'
import Header from './Component/Header';
import Home from './Component/Home'
import Booking from './Component/Booking'
import VehicleManagement from './Component/VehicleManagement'
import Subscription from './Component/Subscription'
import Feedback from './Component/Feedback'
import Login from './Component/Login'
import Register from './Component/Register';
import Footer from './Component/Footer';
import WebcamCapture from './Component/WebcamCapture';


function App() {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: "40px", margin: "0 auto", width: "90%" }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Booking' element={<Booking />} />
          <Route path='/VehicleManagement' element={<VehicleManagement />} />
          <Route path='/Subscription' element={<Subscription />} />
          <Route path='/Feedback' element={<Feedback />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
