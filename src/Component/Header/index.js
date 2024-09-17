import './style.css'
import { Link } from 'react-router-dom';
import { MapPinned  } from 'lucide-react';
import logo from '../../Img/img2.webp'


function Header() {
    return (
        <div>
            <nav class="navmenu">
                <div class="logo">
                    <Link to="/"><img src={logo} alt="Green Car Park Logo" width="90px" height="90px" title="Home" /></Link>
                    <span>Green Car Parking Service</span>
                </div>
                <ul>
                    <li><Link to="/Booking">Booking</Link></li>
                    <li><Link to="/Subscription">Subscription</Link></li>
                    <li><Link to="/VehicleManagement">VehicleManagement</Link></li>
                    <li class="dropdown">
                        <Link to="/Feedback" class="dropbtn">Feedback</Link>
                        <div class="dropdown-content">
                            <Link to="/Reviews">Reviews</Link>
                            <Link to="/Complaints">Complaints</Link>
                            <Link to="/ContactUs">Contact Us</Link>
                        </div>
                    </li>
                    <li><Link to="/Register">Register</Link></li>
                    <li><Link to="/Login">Login</Link></li>
                    <li><a href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6" target='blank'><MapPinned  /></a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header