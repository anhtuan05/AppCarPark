import React, { useState, useEffect, useContext } from 'react';
import CarParkContext from '../../CarParkContext';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { endpoints, authApi } from '../../API';
import './style.css'



const VehicleManagement = () => {
  const [user, dispatch] = useContext(CarParkContext);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    license_plate: '',
    color: '',
    brand: '',
    car_model: ''
  });

  // Lấy danh sách xe từ API
  useEffect(() => {
    getVehicle()
  }, [vehicles]);

  const getVehicle = async () => {
    try {
      const token = cookie.load('token');
      let res = await authApi(token.access_token).get(endpoints['vehicle_management']);

      if (Array.isArray(res.data)) {
        setVehicles(res.data);
      } else {
        setVehicles([]);
        console.error("API response is not an array:", res.data);
      }
    } catch (error) {
      console.error("Error fetching vehicle data: " + error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = cookie.load('token');

    try {
      if (formData.id) {
        let res = await authApi(token.access_token).put(`${endpoints['vehicle_management']}${formData.id}/`, formData);
        setVehicles(vehicles.map(v => v.id === formData.id ? res.data : v));
      } else {
        let res = await authApi(token.access_token).post(endpoints['vehicle_management'], formData);
        setVehicles([...vehicles, res.data]);
      }
      setFormData({
        id: null,
        license_plate: '',
        color: '',
        brand: '',
        car_model: ''
      });
    } catch (error) {
      alert("Error submitting vehicle data: " + error);
    }
  };

  // Xử lý sửa xe (chọn xe để sửa)
  const handleEdit = (vehicle) => {
    setFormData(vehicle);
  };

  // Xử lý xóa xe
  const handleDelete = async (id) => {
    const token = cookie.load('token');
    try {
      await authApi(token.access_token).delete(`${endpoints['vehicle_management']}${id}/`);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      alert("Error deleting vehicle: " + error);
    }
  };

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {user && user.is_staff === false && user.is_superuser === false ? (
        <div className="vehicle-management">

          <h1 className="vehicle-title ">Vehicle Management</h1>

          <form onSubmit={handleSubmit} className="vehicle-form">
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              placeholder="License Plate"
              required
              className="form-input"
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Color"
              required
              className="form-input"
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              required
              className="form-input"
            />
            <input
              type="text"
              name="car_model"
              value={formData.car_model}
              onChange={handleChange}
              placeholder="Car Model"
              required
              className="form-input"
            />
            <button type="submit" className="form-button">
              {formData.id ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </form>

          {Array.isArray(vehicles) && vehicles.length > 0 ? (
            <div className="vehicle-list">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-item">
                  <div className="vehicle-details">
                    <strong>{vehicle.license_plate}</strong> - <span> {vehicle.brand} </span> -
                      <span> ({vehicle.car_model}) </span>  - <span> ({vehicle.color}) </span>
                  </div>
                  <div className="vehicle-actions">
                    <button onClick={() => handleEdit(vehicle)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(vehicle.id)} className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No vehicles found</p>
          )}
        </div>
      ) : (
        <div className='must-be-logged'>You must be logged in to manage vehicles.<Link to="/login"> <LogIn /> Login</Link></div>
      )}
    </div>
  );
};

export default VehicleManagement;
