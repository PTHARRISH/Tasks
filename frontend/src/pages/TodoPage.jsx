import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/todo/";

export default function TodoPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const newErrors = {};

    if (!trimmedName) newErrors.name = "Name is required.";
    else if (trimmedName.length > 50) newErrors.name = "Name cannot exceed 50 characters.";

    if (!trimmedDesc) newErrors.description = "Description is required.";
    else if (trimmedDesc.length > 250) newErrors.description = "Description cannot exceed 250 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateInputs()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}${editId}/` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setName("");
    setDescription("");
    setEditId(null);
    setErrors({});
    fetchTodos();
    showMessage(editId ? "Updated successfully!" : "Created successfully!");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    await fetch(`${API_URL}${id}/`, { method: "DELETE" });
    fetchTodos();
    showMessage("Deleted successfully!");
  };

  const handleEdit = (todo) => {
    setName(todo.name);
    setDescription(todo.description);
    setEditId(todo.id);
    setErrors({});
  };

  const handleInputChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);

    setErrors((prev) => {
      const updated = { ...prev };
      if (field === "name") {
        if (!value.trim()) updated.name = "Name is required.";
        else if (value.trim().length > 50) updated.name = "Name cannot exceed 50 characters.";
        else delete updated.name;
      }
      if (field === "description") {
        if (!value.trim()) updated.description = "Description is required.";
        else if (value.trim().length > 250) updated.description = "Description cannot exceed 250 characters.";
        else delete updated.description;
      }
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>

      {message && (
        <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      <div className="bg-white p-4 shadow rounded mb-6 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              className={`border p-2 w-full rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Name"
              value={name}
              onChange={handleInputChange(setName, "name")}
              maxLength={60} // extra buffer to allow typing + show error
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <input
              type="text"
              className={`border p-2 w-full rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Description"
              value={description}
              onChange={handleInputChange(setDescription, "description")}
              maxLength={260}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCreateOrUpdate}
            >
              {editId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr>
              <td className="border p-2 text-center" colSpan="4">
                No todos found.
              </td>
            </tr>
          ) : (
            todos.map((todo, idx) => (
              <tr key={todo.id}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{todo.name}</td>
                <td className="border p-2">{todo.description}</td>
                <td className="border p-2">
                  <div className="flex gap-4">
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(todo)}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <FaTrash />
                      Delete
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
