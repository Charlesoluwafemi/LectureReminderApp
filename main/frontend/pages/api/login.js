// pages/api/login.js
import jwt from 'jsonwebtoken';

// Global variable to store failed attempts
let failedAttempts = {};

const maxAttempts = 5; // Maximum number of allowed attempts
const lockoutPeriod = 10 * 60 * 1000; // 10 hours in milliseconds

export default function handler(req, res) {
  const { key } = req.body;

  // Get the current failed attempts for the key
  const currentAttempts = failedAttempts[key] || { count: 0, timestamp: null };

  // Check if the user is already locked out
  if (currentAttempts.count >= maxAttempts && Date.now() - currentAttempts.timestamp < lockoutPeriod) {
    const remainingTime = new Date(lockoutPeriod - (Date.now() - currentAttempts.timestamp));
    res.status(401).json({ success: false, message: `Too many failed attempts. Try again in ${remainingTime.getHours()} hours and ${remainingTime.getMinutes()} minutes.` });
    return;
  }

  // Simulate a valid key (replace with your actual authentication logic)
  const validKey = process.env.NEXT_PUBLIC_SECRET_KEY;

  // Check if the provided key matches the valid key
  if (key === validKey) {
    // Reset failed attempts upon successful login
    failedAttempts[key] = undefined;
    const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } else {
    // Increment failed attempts and lock if max attempts reached
    failedAttempts[key] = {
      count: currentAttempts.count + 1,
      timestamp: currentAttempts.timestamp || Date.now(),
    };

    const remainingAttempts = maxAttempts - failedAttempts[key].count;
    const lockoutMessage = remainingAttempts > 0
      ? `Invalid key. ${remainingAttempts} attempts left.`
      : `Too many failed attempts. Try again in ${new Date(lockoutPeriod).getHours()} hours and ${new Date(lockoutPeriod).getMinutes()} minutes.`;

    res.status(401).json({ success: false, message: lockoutMessage });
  }
}

