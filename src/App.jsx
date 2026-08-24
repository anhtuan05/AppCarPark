import React, { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import tokenStorage from './shared/api/tokenStorage';
import CarParkContext from './CarParkContext';
import CarParkUserReducer from './CarParkUserReducer';
import Header from './Component/Header';
import Home from './Component/Home';
import Booking from './Component/Booking';
import VehicleManagement from './Component/VehicleManagement';
import Subscription from './Component/Subscription';
import Feedback from './Component/Feedback';
import Login from './Component/Login';
import Register from './Component/Register';
import Footer from './Component/Footer';
import Parking from './Component/Parking';
import ReNewSub from './Component/ReNewSub';
import Staff from './Component/Staff';
import Report from './Component/Admin/Report';
import Reviews from './Component/Reviews';
import PersonalInfo from './Component/PersonalInfo';
import './App.css';

function App() {
  const [user, dispatch] = useReducer(CarParkUserReducer, tokenStorage.getUser() || null);

  return (
    <CarParkContext.Provider value={[user, dispatch]}>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/booking/:spotId" element={<Booking />} />
            <Route path="/vehicleManagement" element={<VehicleManagement />} />
            <Route path="/subscription/:spotId" element={<Subscription />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/report" element={<Report />} />
            <Route path="/re-new-sub" element={<ReNewSub />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CarParkContext.Provider>
  );
}

export default App;
