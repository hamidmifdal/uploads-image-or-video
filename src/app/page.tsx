"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };

  const isImage = (file: File) => file.type.startsWith('image');
  const isVideo = (file: File) => file.type.startsWith('video');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('file', file); // Append each file to form data
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      setAlert({ message: 'File uploaded successfully!', type: 'success' });
    } else {
      setAlert({ message: 'Error uploading the file.', type: 'error' });
    }
    setTimeout(() => {
      setAlert(null);
      setFiles(null);
    }, 2000)
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Uploading and Displaying Media Files</h1>
      {alert && (
        <div className={`mt-4 p-4 rounded ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {alert.message}
        </div>
      )}
      {files &&
        Array.from(files).map((file, index) => {
          if (isImage(file)) {
            return (
              <div key={index} className="m-4">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`image-preview-${index}`}
                  width={300}
                  height={300}
                  className="rounded"
                />
              </div>
            );
          } else if (isVideo(file)) {
            return (
              <div key={index} className="m-4">
                <video
                  controls
                  width="500"
                  src={URL.createObjectURL(file)}
                  className="rounded"
                />
              </div>
            );
          }
          return null;
        })}
      
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
        />
        <button type="submit" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
          </svg>
          <span>Upload</span>
        </button>
      </form>
    </div>
  );
}
