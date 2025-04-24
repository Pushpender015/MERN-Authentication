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

---

## 🗂️ Project Folder Structure
bash
Copy
Edit
auth-otp-system/
├── client/                  # React Frontend
│   └── src/
│       ├── components/      # Reusable components (Navbar, OTP Input)
│       ├── pages/           # Pages (Signup, Login, Verify, Home)
│       ├── context/         # Auth Context logic
│       ├── App.js
│       └── index.js
│
└── server/                  # Node.js Backend
    ├── controllers/         # Route handlers (authController.js)
    ├── models/              # Mongoose User Model
    ├── routes/              # Auth Routes (authRoutes.js)
    ├── middlewares/         # verifyToken, sendOTP, etc.
    ├── utils/               # Email sender, token generator
    ├── server.js
    └── .env                 # Environment Variables
🛠️ Installation & Setup
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/auth-otp-system.git
cd auth-otp-system
2. Setup Backend
bash
Copy
Edit
cd server
npm install
Create a .env file in /server:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
CLIENT_URL=http://localhost:3000
Start the backend server:

bash
Copy
Edit
npm run dev
3. Setup Frontend
bash
Copy
Edit
cd ../client
npm install
npm start
🌐 API Endpoints

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

💡 Future Enhancements
🔁 Password reset with email OTP

👑 Admin & Role-based access

🔄 Refresh Token implementation

🌙 Dark Mode toggle

🤝 Contributing
Feel free to fork this project and submit a pull request.
For major changes, please open an issue to discuss your ideas first.

📬 Contact
Built with 💙 by Pushpender Singh
Let’s connect on LinkedIn
