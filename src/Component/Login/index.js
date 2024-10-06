import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import cookie from 'react-cookies';
import img3 from '../../Img/img3.jpg'
import './style.css'
import CarParkContext from '../../CarParkContext';
import API, { endpoints, authApi, } from '../../API';
import FormData from 'form-data';

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [user, dispatch] = useContext(CarParkContext)
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const clickLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const formData = new FormData();
      formData.append('client_id', 'PgaDmKIxd4QitVu6uHji0B7UQ4LQVIcOTpahc4Vp');
      formData.append('client_secret', 'Kol1igvmGhxYPLjdafUJG923Bo9zNgBremaIvTlIwoPRpGSoA6LHNvphph62ggUfEyLjUyg68N2DfZxbERdd5TexbN5Ef4ClRFVpDtdfa5ExsR8DBNRDH6LD0TIWDqJR');
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      let res = await API.post(endpoints['login'], formData, config);

      cookie.save("token", res.data);

      let user = await authApi(res.data.access_token).get(endpoints['current_user']);

      cookie.save("user", user.data);

      dispatch({
        type: 'login',
        payload:user.data,
      })

      navigate('/');

    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <form className="form-login" onSubmit={clickLogin}>
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
        {loading ? (
          <ClipLoader color={"#09f"} loading={loading} size={50} />
        ) : (
          <button class="btn-login" type="submit">Login</button>
        )}
      </form>
      <div class="img-right-login">
        <img src={img3} alt="img3" />
      </div>
    </div>
  );
};

export default Login;
