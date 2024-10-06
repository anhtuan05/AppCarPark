import React, { useState } from 'react';
import './style.css';
import WebcamCapture from '../WebcamCapture';
import FormData from 'form-data';
import API, { endpoints } from '../../API';

function Register() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    date_of_birth: "",
    phone_number: "",
    face_description: "",
  });

  const [agree, setAgree] = useState(false);
  const [skipFaceDescription, setSkipFaceDescription] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (user.face_description === null && !skipFaceDescription) {
      setErrorMessage('You must agree to skip the face description.');
      return;
    }

    setErrorMessage(''); // Reset error message

    let form = new FormData();
    for (let key in user) {
      form.append(key, user[key]);
    }

    try {

      let res = await API.post(endpoints['register'], form, {
        headers: {
          "Content-Type": 'application/json'
        }
      });
      alert('Success: User registered successfully with face');
    } catch (error) {
      alert('Error_catch', `Failed to register user: ${error.message}`);
    } finally {

    }


  };

  const handleFaceDescriptionAlert = (description) => {
    if (description) {
      alert("The face has been described");
    } else {
      alert("No facial description yet");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <form className="form-register" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={user.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="terms-box">
          <input
            id="yes"
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <label htmlFor="yes">
            I agree to <a href="/terms" target='blank'>the terms</a> of use
          </label>
        </div>
        <div className="terms-box">
          <input
            id="skip-face-description"
            type="checkbox"
            checked={skipFaceDescription}
            onChange={() => setSkipFaceDescription(!skipFaceDescription)}
          />
          <label htmlFor="skip-face-description">
            I agree to skip the face description if not available
          </label>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button className="btn-login" type="submit" disabled={!agree}>
          Register
        </button>
      </form>
      <div className="img-right-register">
        <WebcamCapture
          setFaceDescription={(description) => {
            setUser((prev) => ({ ...prev, face_description: description }));
            handleFaceDescriptionAlert(description);
          }}
        />

      </div>
    </div>
  );
}

export default Register;
