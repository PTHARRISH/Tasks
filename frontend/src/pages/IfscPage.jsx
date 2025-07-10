import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/ifsc/";

export default function IfscPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [ifsc, setIfsc] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState("");

  const validateIFSC = (value) => {
    const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!value.trim()) return "IFSC code is required.";
    if (value.length !== 11) return "IFSC code must be 11 characters.";
    if (!pattern.test(value)) return "Invalid IFSC format.";
    return "";
  };

  const fetchIFSCInfo = async (codeToFetch) => {
    try {
      const res = await fetch(`${API_URL}${codeToFetch}/`);

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to fetch IFSC details.");
        setInfo(null);
        return;
      }

      const data = await res.json();
      setInfo(data);
      setError("");
      setMessage("IFSC details fetched successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Fetch error:", err);
      setInfo(null);
      setError("Network error or invalid JSON.");
    }
  };

  useEffect(() => {
    if (code) {
      setIfsc(code);
      const err = validateIFSC(code);
      if (!err) {
        fetchIFSCInfo(code);
      }
    }
  }, [code]);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setIfsc(value);
    setInfo(null);
    setMessage("");

    // Reset error live while typing valid input
    if (value.length === 11 && !validateIFSC(value)) {
      setError("");
    }
  };

  const handleSubmit = () => {
    const err = validateIFSC(ifsc);
    if (err) {
      setError(err);
      setInfo(null);
      return;
    }

    // Always fetch fresh data, even if route is same
    fetchIFSCInfo(ifsc);
    navigate(`/ifsc/${ifsc}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">IFSC Code Checker</h1>

      <input
        type="text"
        maxLength={11}
        placeholder="Enter IFSC Code"
        className={`w-full p-2 border rounded mb-2 uppercase outline-none transition ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={ifsc}
        onChange={handleChange}
      />
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Check IFSC
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}

      {info && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Bank Details:</h2>
          <ul className="text-sm space-y-1">
            {Object.entries(info).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value ? value.toString() : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
