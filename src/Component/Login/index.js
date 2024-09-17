import React, { useState } from 'react';
import img3 from '../../Img/img3.jpg'
import './style.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (true) {
      // Xử lý đăng nhập
      console.log('Username:', username);
      console.log('Password:', password);
    } 
  };

  return (
    <div style={{ display: "flex"}}>
      <form class="form-login" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button class="btn-login" type="submit">Login</button>
      </form>
      <div class="img-right-login">
        <img src={img3} alt="img3" />
      </div>
    </div>
  );
};

export default Login;
