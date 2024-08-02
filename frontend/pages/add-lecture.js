import React from "react";
import ImportDataForm from "../components/ImportDataForm";

const AddLecturePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Add Lecture Data</h1>
        <ImportDataForm />
      </div>
    </div>
  );
};

export default AddLecturePage;
