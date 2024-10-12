import './App.css';
import React, { useReducer } from 'react';
import cookie from 'react-cookies'
import CarParkContext from './CarParkContext'
import CarParkUserReducer from './CarParkUserReducer'
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
import Parking from './Component/Parking';
import ReNewSub from './Component/ReNewSub';
import Staff from './Component/Staff';
import Report from './Component/Admin/Report';
import Reviews from './Component/Reviews';
import PersonalInfo from './Component/PersonalInfo';



function App() {
  const [user, dispatch] = useReducer(CarParkUserReducer, cookie.load("user") || null);
  return (
    <CarParkContext.Provider value={[user, dispatch]}>
      <div>
        <Header />
        <div style={{ paddingTop: "40px", margin: "0 auto", width: "90%", minHeight: "360px" }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/parking' element={<Parking />} />
            <Route path="/booking/:spotId" element={<Booking />} />
            <Route path='/vehicleManagement' element={<VehicleManagement />} />
            <Route path='/subscription/:spotId' element={<Subscription />} />
            <Route path='/feedback' element={<Feedback />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/staff' element={<Staff />} />
            <Route path='/report' element={<Report />} />
            <Route path='/re-new-sub' element={<ReNewSub />} />
            <Route path='/reviews' element={<Reviews />} />PersonalInfo
            <Route path='/personal-info' element={<PersonalInfo />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </CarParkContext.Provider>
  );
}

export default App;
