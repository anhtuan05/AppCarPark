import React, { useState, useEffect, useContext } from 'react';
import cookie from 'react-cookies';
import { LogIn } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { endpoints, authApi } from '../../API';
import CarParkContext from '../../CarParkContext'

import './style.css';

const Booking = () => {
  const [user, dispatch] = useContext(CarParkContext);

  const { spotId } = useParams(); // spotId from the URL

  const [vehicles, setVehicles] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [bookingHistory, setBookingHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchBookingHistory();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = cookie.load('token');
      let res = await authApi(token.access_token).get(endpoints['vehicle_management']);
      setVehicles(res.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const token = cookie.load('token');
      let res = await authApi(token.access_token).get(endpoints['booking']);
      setBookingHistory(res.data);

    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };


  const handleBookingSubmit = async () => {

    if (new Date(startTime) >= new Date(endTime)) {
      alert('Start time must be before end time.');
      return;
    }

    if (!selectedVehicle || !startTime || !endTime) {
      alert("Please fill in all information.");
      return;
    }

    const bookingData = {
      spot: spotId, // spotId from the URL
      vehicle: selectedVehicle,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      setLoading(true);
      const token = cookie.load('token');
      let res = await authApi(token.access_token).post(endpoints['booking'], bookingData);
      alert('Booking successful!');

      await fetchBookingHistory(); // Refresh booking history

      if (res.data.short_link) {
        window.open(res.data.short_link, '_blank'); // Open the short_link URL in a new tab
      }

    } catch (error) {
      alert('Error submitting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  function formatDateTime(isoDateTime) {
    const date = isoDateTime.replace('Z', '');
    return date.replace('T', ' ');
  }
  return (
    <div>
      {user && user.is_staff === false && user.is_superuser === false ? (
        <div className="booking-container">


          <h2>Book Spot {spotId}</h2>
          <div className="booking-form">
            <label>Vehicle:</label>
            <select onChange={(e) => setSelectedVehicle(e.target.value)}>
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.license_plate}
                </option>
              ))}
            </select>

            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label>End Time:</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          {loading ? (
            <ClipLoader color="#36d7b7" loading={loading} size={50} />
          ) : (
            <button onClick={handleBookingSubmit}>Book Now</button>
          )}

          <h2>Booking History</h2>
          <table className="booking-history-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Spot</th>
                <th>Vehicle</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Hours</th>
                <th>Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking) => (
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
        </div>
      ) : (
        <div className='must-be-logged'>You must be logged in to booking. <Link to="/login"> <LogIn /> Login</Link></div>
      )}
    </div>
  );
};

export default Booking;
