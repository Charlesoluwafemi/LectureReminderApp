// frontend/components/RegisterForm.js

import React, { useState } from 'react';
import { registerUser } from '../services/userService';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(username, password);
            console.log('User registered successfully:', response);
            // Handle success, e.g., redirect or show a success message
        } catch (error) {
            console.error('Failed to register user:', error);
            setError(error.message);  // Update state to display error message
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default RegisterForm;
