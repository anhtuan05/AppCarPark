import './style.css';
import { Link } from 'react-router-dom';
import { LogOut, MapPinned } from 'lucide-react';
import logo from '../../Img/img2.webp';
import { useContext, useEffect, useState } from 'react';
import CarParkContext from '../../CarParkContext';

function Header() {
    const [user, dispatch] = useContext(CarParkContext);
    const [isUser, setIsUser] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch({ type: 'logout' });
    };

    useEffect(() => {
        if (user) {
            if (user.is_staff === false && user.is_superuser === false) {
                setIsUser(true);
                setIsAdmin(false);
                setIsStaff(false);
            } else if (user.is_staff === true && user.is_superuser === false) {
                setIsUser(false);
                setIsAdmin(false);
                setIsStaff(true);
            } else if (user.is_staff === true && user.is_superuser === true) {
                setIsAdmin(true)
                setIsStaff(false)
                setIsUser(false)
            }
        } else {
            setIsUser(false);
            setIsAdmin(false);
            setIsStaff(false);
        }
    }, [user]); // Mỗi khi user thay đổi, cập nhật lại isUser và isAdmin

    return (
        <div>
            <nav className="navmenu">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Green Car Park Logo" width="90px" height="90px" title="Home" />
                    </Link>
                    <span>Green Car Parking Service</span>
                </div>
                <ul>
                    <li>
                        <Link to="/parking">Parking</Link>
                    </li>
                    {isUser && (
                        <>
                            <li><Link to="/re-new-sub">Registration renewal</Link></li>
                            <li><Link to="/vehicleManagement">Vehicle Management</Link></li>
                            <li className="dropdown">
                                <Link to="/feedback" className="dropbtn">Feedback</Link>
                                <div className="dropdown-content">
                                    <Link to="/reviews">Reviews</Link>
                                    <Link to="/complaints">Complaints</Link>
                                    <Link to="/contactUs">Contact Us</Link>
                                </div>
                            </li>
                            <li>{user && user.username ? (<Link to="/personal-info">{user.username}</Link>) : null}</li>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <li><Link to="/report">Report</Link></li>
                            <li><a href="https://anhtuan05.pythonanywhere.com/admin/" target="blank" rel="noopener noreferrer">AdminSite</a></li>
                        </>
                    )}

                    {isStaff && (
                        <>
                            <li><Link to="/staff">Entry and Exit</Link></li>
                        </>
                    )}

                    {!user && (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}

                    {user && (
                        <li><a href="/logout" onClick={handleLogout} title="Logout"><LogOut /></a></li>
                    )}

                    <li>
                        <a href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6" target="blank" rel="noopener noreferrer"><MapPinned /></a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;
