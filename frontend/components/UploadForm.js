import { useState } from "react";
import Cookies from "js-cookie";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const csrfToken = Cookies.get("csrftoken");

    try {
      const response = await fetch("http://localhost:8000/upload-students/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage("Failed to upload file");
      }
    } catch (error) {
      setMessage("Error uploading file");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload CSV File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {message && <p className="mt-4">{message}</p>}
    </form>
  );
}
