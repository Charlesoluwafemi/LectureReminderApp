// pages/index.js
import React from "react";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to LectureNotify</h1>
        <p className="text-lg mb-8">Your platform for managing student notifications and lecture schedules.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Streamline Communication</h2>
            <p className="text-lg text-gray-700">Effortlessly communicate with students and staff through centralized notifications.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Schedules</h2>
            <p className="text-lg text-gray-700">Organize and update lecture schedules to keep everyone informed and on track.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Enhance Collaboration</h2>
            <p className="text-lg text-gray-700">Facilitate collaboration between educators and students with seamless tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Easy Access</h2>
            <p className="text-lg text-gray-700">Access LectureNotify anytime, anywhere, with our intuitive web-based platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



