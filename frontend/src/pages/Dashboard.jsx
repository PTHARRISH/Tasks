import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (url = "http://127.0.0.1:8000/dashboard/") => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized. Please login.");

    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { results, next, previous } = res.data;
      setUsers(results || []);
      setNextUrl(next);
      setPrevUrl(previous);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://127.0.0.1:8000/dashboard/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers(); // Refresh after deletion
    } catch {
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Active</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2 border">{u.username}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border">{u.is_active ? "Yes" : "No"}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => fetchUsers(prevUrl)}
              disabled={!prevUrl}
              className={`px-4 py-2 rounded ${
                prevUrl ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => fetchUsers(nextUrl)}
              disabled={!nextUrl}
              className={`px-4 py-2 rounded ${
                nextUrl ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
