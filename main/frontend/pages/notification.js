import React from "react";

const NotificationsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Notifications</h1>
        <div className="space-y-4">
          {/* Example notifications */}
          <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">New Lecture Added</h2>
            <p>Course 303 has been added to your schedule.</p>
          </div>
          <div className="p-4 bg-red-500 text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Lecture Canceled</h2>
            <p>Course 101 has been canceled for this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
