import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Helper to parse document.cookie into an object
const parseCookies = () => {
  const cookieObj = {};
  document.cookie.split(";").forEach(cookie => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) cookieObj[key] = decodeURIComponent(value);
  });
  return cookieObj;
};

// Helper to set a cookie
const setCookie = (key, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// Helper to delete a cookie
const deleteCookie = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export default function CookieManager() {
  const [cookies, setCookies] = useState({});
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const refreshCookies = () => {
    const parsed = parseCookies();
    setCookies(parsed);
  };

  const createCookie = () => {
    if (!key || !value || key.length > 200 || value.length > 200) {
      return toast.error("Key and value are required (max 200 chars)");
    }
    setCookie(key, value);
    toast.success("Cookie set");
    setKey("");
    setValue("");
    refreshCookies();
  };

  const handleDelete = (key) => {
    deleteCookie(key);
    toast.success("Cookie deleted");
    refreshCookies();
  };

  useEffect(() => {
    refreshCookies();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Cookie Manager</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          maxLength={200}
          placeholder="Key"
          className="border p-2 rounded"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          placeholder="Value"
          className="border p-2 rounded"
        />
        <button
          onClick={createCookie}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Set
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Key</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(cookies).map(([k, v]) => (
            <tr key={k}>
              <td className="border p-2 font-mono">{k}</td>
              <td className="border p-2 font-mono">{v}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(k)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {Object.keys(cookies).length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No cookies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
