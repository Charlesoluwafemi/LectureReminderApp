import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(5); // Maximum allowed attempts
  const [lockedUntil, setLockedUntil] = useState(null); // Timestamp for unlocking
  const router = useRouter();

  useEffect(() => {
    // Retrieve login attempts and lockout status from localStorage
    const currentAttempts = localStorage.getItem('loginAttempts');
    if (currentAttempts) {
      const { remaining, timestamp } = JSON.parse(currentAttempts);
      setRemainingAttempts(remaining);
      setLockedUntil(timestamp);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Key:', key); // Log the submitted key

    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / (60 * 1000));
      setMessage(`Too many failed attempts. Try again in ${minutesLeft} minutes.`);
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    console.log('Login Response:', data); // Log the login response

    if (data.success) {
      Cookies.set('token', data.token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to dashboard page after successful login
      }, 1000); // Redirect after 1 second
    } else {
      const newRemainingAttempts = remainingAttempts - 1;
      setRemainingAttempts(newRemainingAttempts);

      if (newRemainingAttempts === 0) {
        const lockTime = Date.now() + 10 * 60 * 60 * 1000; // 10 hours in milliseconds
        setLockedUntil(lockTime);
        localStorage.setItem('loginAttempts', JSON.stringify({ remaining: newRemainingAttempts, timestamp: lockTime }));
        setMessage(`Too many failed attempts. Try again in 10 hours.`);
      } else {
        localStorage.setItem('loginAttempts', JSON.stringify({ remaining: newRemainingAttempts, timestamp: lockedUntil }));
        setMessage(data.message || `Invalid key. ${newRemainingAttempts} attempt(s) left.`);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="block text-gray-800">Secret Key:</label>
            <input
              id="secretKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter secret key"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        {message && (
          <p className={`text-center mt-4 text-lg ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}



