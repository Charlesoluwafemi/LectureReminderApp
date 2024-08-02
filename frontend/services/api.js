// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadCSV = async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axios.post(`${API_URL}/upload/${endpoint}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
