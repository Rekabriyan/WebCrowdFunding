import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.js'; 
import env from '../env.js';

const Login = () => {
    const navigate = useNavigate();
    const {setAuthData} = useContext(AuthContext);

    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(env.apiUrl+"/admin/Login", formData);
            const { token, refresh_token } = response.data;

            //Simpan token ke dalam Context
            setAuthData({ token, refresh_token });

            // Navigate ke halaman setelah login berhasil 
            navigate('/project');
        } catch (error) {
            console.error('Error during login:', error);
            setMessage(error.response.data);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h3>Login</h3>

                    {message && (
                        <div className="alert alert-danger" role="alert">{message}</div>
                    )}
                    <div className="mb-3">
                        <label>Username</label>
                        <input 
                        name="username" value={formData.username} 
                        onChange={handleChange} required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input 
                        name="password" value={formData.password} 
                        onChange={handleChange} required 
                        />
                    </div>
                    
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    </div>
    )
};

export default Login;