import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinHouse } from 'lucide-react';
import bgImg from '../../Img/bgImg.webp'
import './style.css'

function Home() {
  return (
    <div className="home-content" style={{ backgroundImage: `url(${bgImg})` }}>
      <h1 className="home-title">Welcome!!!</h1>
      <Link class="booking-button" to="/Parking"><span>Booking Now</span><MapPinHouse /></Link>
    </div>
  );
}

export default Home;