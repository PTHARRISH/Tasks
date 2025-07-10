import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/image-upload/";

export default function ImageUploadPage() {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const inputRef = useRef(null);

  const fetchImages = async (page = 1) => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}`);
      setImages(res.data.results || []);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch {
      toast.error("Failed to fetch images.");
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const validateImage = (file) => {
    if (!file?.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Image must be under 25MB.");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Please select an image.");
    if (!validateImage(image)) return;

    const formData = new FormData();
    formData.append("image", image);

    setIsLoading(true);
    try {
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image uploaded successfully!");
      setImage(null);
      inputRef.current.value = ""; // ✅ clear input
      fetchImages(1); // reset to first page
    } catch {
      toast.error("Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("Image deleted.");
      fetchImages(page);
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Download failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Image Upload</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <table className="w-full border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">File Name</th>
            <th className="p-2 border">Uploaded At</th>
            <th className="p-2 border">Download</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {images.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No images uploaded yet.
              </td>
            </tr>
          ) : (
            images.map((img) => (
              <tr key={img.id} className="border-t">
                <td className="p-2 border">{img.image?.split("/").pop()}</td>
                <td className="p-2 border">
                  {moment(img.uploaded_at).format("DD MMM YYYY, hh:mm A")}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() =>
                      handleDownload(img.image, img.image?.split("/").pop())
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Download
                  </button>
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-4">
                    <button
                      className="flex items-center text-blue-500 hover:text-blue-600"
                      title="Edit"
                      onClick={() => alert("Edit functionality not implemented")}
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="flex items-center text-red-600 hover:text-red-700"
                      title="Delete"
                      onClick={() => handleDelete(img.id)}
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          disabled={!previous}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded ${
            previous ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          Previous
        </button>
        <button
          disabled={!next}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${
            next ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
