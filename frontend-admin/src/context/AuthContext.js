// src/context/AuthContext.js

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        token: localStorage.getItem('token'),
        refresh_token: localStorage.getItem('refresh') || null, });

    if(authData.token){
        authData.token = null;
        authData.refresh_token = null;
    }

    useEffect(() => {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('refresh', authData.refresh_token);
    }, [authData.token, authData.refresh_token]);
    
    return (
        <AuthContext.Provider value={{ authData, setAuthData}}> 
            {children}  
        </AuthContext.Provider>
    );
};