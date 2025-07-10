import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiDownload, FiEdit, FiTrash2 } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/file-upload/";

export default function FileUploadPage() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
      const files = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
        ? res.data.results
        : [];
      setFileList(files);
    } catch {
      toast.error("Failed to fetch uploaded files.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadOrUpdate = async () => {
    if (!file) return toast.error("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      if (editId) {
        await axios.patch(`${API_URL}${editId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("File updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("File uploaded successfully!");
      }
      setFile(null);
      setEditId(null);
      fileInputRef.current.value = "";
      fetchFiles();
    } catch (err) {
      toast.error(editId ? "Update failed." : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([res.data]));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Download failed.");
    }
  };

  const handleEdit = (file) => {
    setEditId(file.id);
    setFile(null);
    fileInputRef.current.value = "";
    toast("Now editing the file. Select a new file to replace it.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("File deleted.");
      fetchFiles();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-4">File Upload</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUploadOrUpdate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading
            ? editId
              ? "Updating..."
              : "Uploading..."
            : editId
            ? "Update"
            : "Upload"}
        </button>
      </div>

      <table className="w-full border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">File Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Download</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileList.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No files uploaded yet.
              </td>
            </tr>
          ) : (
            fileList.map((file) => (
              <tr key={file.id} className="border-t">
                <td className="p-2 border">{file.file?.split("/").pop()}</td>
                <td className="p-2 border">
                  {file.file?.split(".").pop().toUpperCase()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() =>
                      handleDownload(file.file, file.file?.split("/").pop())
                    }
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <FiDownload size={16} /> Download
                  </button>
                </td>
                <td className="p-2 border">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(file)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FiEdit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
