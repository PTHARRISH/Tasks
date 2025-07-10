# 🛠️ Full-Stack Django & React Application

This is a full-featured full-stack web application built using **Django (Python 3.12.3)** and **React (Vite + Tailwind CSS)**. The system provides robust functionality for task management (To-Do list), authentication, file/image uploads, third-party API integration, and cookie-based session handling.

---

## 📌 Features

### ✅ 1. To-Do List (CRUD)
- Add, update, and delete tasks with `name` and `description`.
- Server-side pagination with Next/Previous buttons.
- Form validation with character length limits.
- Responsive table with inline editing.

### ✅ 2. Razorpay IFSC Code Lookup
- Integrates with Razorpay IFSC public API.
- Validates IFSC format (must be 11 alphanumeric characters).
- Retrieves bank details based on valid IFSC.

### ✅ 3. User Authentication
#### Signup
- Fields: `username`, `email`, `password`, `confirm password`.
- Validations: password confirmation, required fields.

#### Login
- Fields: `email`, `password`.
- JWT/session-based setup.

### ✅ 4. File Upload
- Upload `.txt`, `.csv`, and time log files.
- Stores files locally in a secure media folder.
- Shows uploaded file metadata.

### ✅ 5. Image Upload
- Accepts `.jpg`, `.jpeg`, and `.png` files.
- Stores user profile or image uploads locally.
- Displays thumbnails or previews post-upload.

### ✅ 6. Cookie Management
- Set, view, and delete cookies using React and Django.
- Demonstrates `SameSite`, `secure`, and expiration control.
- Cookies handled both via API and directly from client.

### ✅ 7. User Table Display
- Dynamic rendering of user data:
  - `Name`
  - `Email`
  - `Status (Active/Inactive)`
- Styled table with clean layout using Tailwind CSS.

---

## 🧰 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Backend      | Python 3.12.3, Django, DRF     |
| Frontend     | React (Vite), Tailwind CSS     |
| Auth & API   | Django Rest Framework, JWT     |
| UI Components| React Icons, Toast Notifications |
| Storage      | Local Media (Django File/Image) |
| 3rd Party API| Razorpay IFSC Lookup           |

---

## ⚙️ Backend Setup (Django)

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 2. Install Requirements
```bash
pip install -r requirements.txt
```