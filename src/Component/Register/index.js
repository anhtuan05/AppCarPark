import React, { useState } from 'react';
import img4 from '../../Img/img4.jpg'
import './style.css'
import WebcamCapture from '../WebcamCapture';

function Register() {
  const [agree, setAgree] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <form class="form-register">
        <h2>Register</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
          />
        </div>
        <div class="terms-box">
          <input
            id="yes"
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <label for="yes" >I agree to <a href="/terms">the terms </a>of use</label>
        </div>
        <button class="btn-login" type="submit" disabled={!agree}>Register</button>
      </form>
      <div class="img-right-register">
        <img src={img4} alt="img4" />
      </div>
      <div>
        <WebcamCapture/>
      </div>
    </div>
  );
}

export default Register;