import React, { useEffect, useState, useContext } from 'react';
import { authApi, endpoints } from '../../API';
import cookie from 'react-cookies';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import CarParkContext from '../../CarParkContext'
import './style.css';

const PersonalInfo = () => {
    const [user, dispatch] = useContext(CarParkContext);
    const [userInfo, setUserInfo] = useState({});
    const [bookings, setBookings] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [parkingHistory, setParkingHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchUserInfo = async () => {
        try {
            const token = cookie.load('token');
            const res = await authApi(token.access_token).get(endpoints['current_user']);
            setUserInfo(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const token = cookie.load('token');
            const res = await authApi(token.access_token).get(endpoints['booking']);
            setBookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const token = cookie.load('token');
            const res = await authApi(token.access_token).get(endpoints['subscription']);
            setSubscriptions(res.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    const fetchPayments = async () => {
        try {
            const token = cookie.load('token');
            const res = await authApi(token.access_token).get(endpoints['payment']);
            setPayments(res.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchParkingHistory = async () => {
        const token = cookie.load('token');
        try {
            const res = await authApi(token.access_token).get(endpoints['entry_exit']);
            setParkingHistory(res.data);
        } catch (error) {
            console.error('Error fetching parking history:', error);
        }
    };


    useEffect(() => {
        fetchUserInfo();
        fetchBookings();
        fetchSubscriptions();
        fetchPayments();
        fetchParkingHistory();
    }, []);


    const handleSave = async () => {
        try {
            setLoading(true);
            const token = cookie.load('token');
            await authApi(token.access_token).put(endpoints['put_user'], formData);
            setEditMode(false);
            fetchUserInfo();
        } catch (error) {
            console.error('Error updating user info:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    function formatDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <div>
            {user && user.is_staff === false && user.is_superuser === false ? (
                <div className="personal-info-container">
                    <h2>Personal Information</h2>
                    {editMode ? (
                        <div>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                placeholder="Last Name"
                            />
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Username"
                            />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email"
                            />
                            <input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            />
                            <input
                                type="text"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                placeholder="Phone Number"
                            />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Password"
                            />

                            {loading ? (
                                <ClipLoader color="#36d7b7" loading={loading} size={50} />
                            ) : (
                                <button onClick={handleSave}>Save</button>
                            )}
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>First Name: {userInfo.first_name}</p>
                            <p>Last Name: {userInfo.last_name}</p>
                            <p>Username: {userInfo.username}</p>
                            <p>Email: {userInfo.email}</p>
                            <p>Date of Birth: {userInfo.date_of_birth}</p>
                            <p>Phone Number: {userInfo.phone_number}</p>
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        </div>
                    )}

                    <h2>Parking History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Spot</th>
                                <th>Vehicle</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Entry Image</th>
                                <th>Exit Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parkingHistory.map(parking => (
                                <tr key={parking.id}>
                                    <td>{parking.id}</td>
                                    <td>{parking.spot}</td>
                                    <td>{parking.vehicle_license_plate}</td>
                                    <td>{formatDateTime(parking.entry_time)}</td>
                                    <td>{parking.exit_time ? formatDateTime(parking.exit_time) : 'N/A'}</td>
                                    <td><img src={parking.entry_image_url} alt="Entry" style={{ width: '100px' }} /></td>
                                    <td>
                                        {parking.exit_image_url ? (
                                            <img
                                                src={parking.exit_image_url}
                                                alt="Exit"
                                                style={{ width: '100px' }}
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Booking History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Spot</th>
                                <th>Vehicle</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Total Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.spot}</td>
                                    <td>{booking.vehicle_license_plate}</td>
                                    <td>{formatDateTime(booking.start_time)}</td>
                                    <td>{formatDateTime(booking.end_time)}</td>
                                    <td>{booking.total_hours}</td>
                                    <td>{booking.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Subscription History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Subscription Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td>{sub.id}</td>
                                    <td>{sub.subscription_type_name}</td>
                                    <td>{sub.start_date}</td>
                                    <td>{sub.end_date}</td>
                                    <td>{sub.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Payment History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{formatPrice(payment.amount)}</td>
                                    <td>{payment.payment_method}</td>
                                    <td>{payment.payment_note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='must-be-logged'>You must be logged. <Link to="/login"> <LogIn /> Login</Link></div>
            )}
        </div>
    );
};

export default PersonalInfo;
