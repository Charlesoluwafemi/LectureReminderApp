import React, { useState } from "react";
import axios from "axios";

const ImportDataForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Only Excel files (.xls, .xlsx) are allowed.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
      }

      const response = await axios.post(
        "http://localhost:8000/upload-lecture/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        setError(`Error uploading file: ${error.response.data.error || error.response.data.message || error.response.statusText}`);
      } else {
        setError("Error uploading file. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Import Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xls,.xlsx"
          aria-label="File upload"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ImportDataForm;






