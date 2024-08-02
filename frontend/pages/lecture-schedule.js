import React from "react";

const LectureSchedulePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Lecture Schedule</h1>
        <div className="space-y-4">
          {/* Example schedule items */}
          <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Course 101</h2>
            <p>Monday, 10:00 AM - 12:00 PM</p>
            <p>Room: 201</p>
          </div>
          <div className="p-4 bg-green-500 text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Course 202</h2>
            <p>Wednesday, 2:00 PM - 4:00 PM</p>
            <p>Room: 301</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureSchedulePage;
