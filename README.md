# 🔐 MERN Authentication System with Email Verification via OTP

A complete **MERN-stack Authentication System** that offers secure login, registration with email OTP verification, session persistence, and protected routes — all wrapped in a responsive UI.

---

## 🚀 Tech Stack

### 🧠 Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** (Access Tokens)
- **Bcrypt.js** (Password Hashing)
- **Nodemailer** (Email OTP)
- **Cookie-parser**
- **CORS**
- **Dotenv**

### 🌐 Frontend
- **React.js**
- **React Router DOM**
- **Axios** with `withCredentials`
- **React Context API**
- **Tailwind CSS**
- **React Toastify** (Notifications)

---

## 📦 Features

### 📝 User Registration
- Collects name, email, and password.
- Sends OTP to user's email using **Nodemailer**.
- Redirects to OTP verification page after registration.

### ✉️ Email Verification via OTP
- 6-digit OTP input field.
- Smart handling: auto-focus, backspace navigation, and paste support.
- Verifies OTP on the server to activate the account.

### 🔐 Login
- Secure login with JWT access token stored in **HTTP-only cookies**.
- On success, user is redirected to a **protected homepage**.

### 🚪 Logout
- Clears authentication cookies and resets auth state.

### 🔄 Session Persistence
- On app load, backend checks cookie token to restore session.
- Global auth state is maintained via **React Context API**.

### 🔒 Protected Routes
- Routes like **Home** are only accessible if the user is authenticated.
- Optional `PrivateRoute` logic can be used to restrict access.

### 🔁 Password Reset (Coming Soon)
- Users can reset password via email OTP (in progress).

###🌐 API Endpoints

Method	Endpoint	Description
POST	/api/auth/signup	Register a new user
POST	/api/auth/verify-email	Verify OTP for email
POST	/api/auth/login	Login with credentials
GET	/api/auth/logout	Logout the user
GET	/api/auth/getuser	Get user session info
📸 Screenshots
Signup Page ✅

OTP Verification 📩

Login Page 🔐

Protected Home Page 🏡

###💡 Future Enhancements
🔁 Password reset with email OTP

👑 Admin & Role-based access

🔄 Refresh Token implementation


###🤝 Contributing
Feel free to fork this project and submit a pull request.
For major changes, please open an issue to discuss your ideas first.

###📬 Contact
Built with 💙 by Pushpender Singh
Let’s connect on LinkedIn
