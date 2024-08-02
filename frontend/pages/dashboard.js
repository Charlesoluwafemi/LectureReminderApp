// pages/dashboard.js
import React from "react";
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Welcome to the Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/upload-students">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer">
              <h2 className="text-xl font-bold">Upload Students</h2>
              <p>Upload the list of students for notifications.</p>
            </div>
          </Link>
          <Link href="/lecture-schedule">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow hover:bg-green-700 transition cursor-pointer">
              <h2 className="text-xl font-bold">Lecture Schedule</h2>
              <p>View and manage lecture schedules.</p>
            </div>
          </Link>
          <Link href="/add-lecture">
            <div className="bg-yellow-500 text-white p-4 rounded-lg shadow hover:bg-yellow-700 transition cursor-pointer">
              <h2 className="text-xl font-bold">Add Lecture</h2>
              <p>Add new lectures to the schedule.</p>
            </div>
          </Link>
          <Link href="/notification">
            <div className="bg-red-500 text-white p-4 rounded-lg shadow hover:bg-red-700 transition cursor-pointer">
              <h2 className="text-xl font-bold">Notifications</h2>
              <p>Send notifications to students.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;



