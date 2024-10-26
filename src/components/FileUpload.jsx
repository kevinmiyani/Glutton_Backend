import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../api/firebaseconfig'; // Adjust the path as needed


const FileUpload = ({ onFilesUploaded }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            setUploading(true);
          },
          (error) => {
            setError(error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({ name: file.name, url: downloadURL });
            });
          }
        );
      });
    });

    Promise.all(uploadPromises)
      .then((uploadedFiles) => {
        setUploading(false);
        onFilesUploaded(uploadedFiles); // Pass the URLs to the parent component
      })
      .catch((error) => {
        setUploading(false);
        setError(error.message);
      });
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-green-600 file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
        accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
      />
      {uploading && <p>Uploading: {Math.round(progress)}%</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FileUpload;
