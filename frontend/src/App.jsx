import { Link, Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CookieManager from "./pages/CookieManager";
import Dashboard from "./pages/Dashboard";
import FileUploadPage from "./pages/FileUploadPage";
import IfscPage from "./pages/IfscPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoPage from "./pages/TodoPage";

function App() {
  return (
    <Router>
      <div className="p-4 max-w-4xl mx-auto">
        <nav className="mb-6 flex justify-center gap-6 text-blue-600 font-semibold">
          <Link to="/signup" className="hover:underline">SignUp</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/todo" className="hover:underline">Todo List</Link>
          <Link to="/ifsc" className="hover:underline">IFSC Checker</Link>
          <Link to="/file_upload" className="hover:underline">File Upload</Link>
          <Link to="/image_upload" className="hover:underline">Image Upload</Link>
          <Link to="/cookie" className="hover:underline">Cookie</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/todo" />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/ifsc" element={<IfscPage />} />
          <Route path="/ifsc/:code" element={<IfscPage />} />
          <Route path="*" element={<div className="text-center">Page not found</div>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/file_upload" element={<FileUploadPage />} />
          <Route path="/image_upload" element={<ImageUploadPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cookie" element={<CookieManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
