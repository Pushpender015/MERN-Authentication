import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";

// create instance of server
const app = express();

// define port
const port = process.env.PORT || 4000

// connected db with app
connectDB();

const allowedOrigins = ['https://mern-authentication-481a.vercel.app']

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// for UI interaction
app.get('/' , (req , res) => {
    res.send(`<h1>Server Working Fine</h1>`)
});

// mounting route ( or you can say initial route )
app.use('/api/auth' , authRouter);
app.use('/api/user' , userRouter);

// server start at port
app.listen(port , () => console.log(`server started on PORT: ${port}`));
