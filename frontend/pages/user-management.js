import React from "react";

const UserManagementPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">User Management</h1>
        <div className="space-y-4">
          {/* Example user management content */}
          <div className="p-4 bg-purple-500 text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Manage Users</h2>
            <p>Add, edit, or remove users from the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
