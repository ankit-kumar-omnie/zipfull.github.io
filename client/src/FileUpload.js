import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; 

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('pdfFiles', file);
      });
      const response = await axios.post('http://localhost:3000/convert', formData, {
        responseType: 'blob' 
      });
  
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
  
      const blob = new Blob([response.data]);
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'converted.zip';

      link.click();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className="file-upload-label">Select PDF Files</label>
      <input id="file-upload" type="file" multiple className="file-upload-input" onChange={handleFileChange} />
      <div className="selected-files">
        {selectedFiles.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </div>
      <button className="file-upload-button" onClick={handleUpload}>Convert PDF to ZIP</button>
    </div>
  );
};

export default FileUpload;
