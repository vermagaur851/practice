import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setSelectedImage(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      // Assuming the backend returns { urls: [url1, url2, ...] }
      setImageUrls(res.data.urls);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
      <div {...getRootProps()} className="border-dashed border-2 p-10 cursor-pointer">
        <input {...getInputProps()} />
        {selectedImage ? (
          <p>{selectedImage.name}</p>
        ) : (
          <p>Drop an image or click to upload</p>
        )}
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload & Post"}
      </button>
      {imageUrls.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Resized Images:</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Resized version ${index + 1}`}
                className="border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
