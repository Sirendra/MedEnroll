import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import customerRoutes from "./routes/customer.route";
import connectDB from "./config/db";
import authRoute from "./routes/auth.route";
import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/customers", authMiddleware, customerRoutes);

app.get("/", (req, res) => {
  res.send(`<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to MedEnroll</title>
        <style>
          body {
            background: linear-gradient(135deg, #667eea, #764ba2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #fff;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-shadow: 1px 1px 5px rgba(0,0,0,0.3);
          }
          p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #e0e0ff;
          }
          a.button {
            display: inline-block;
            padding: 12px 30px;
            font-weight: bold;
            font-size: 1rem;
            color: #fff;
            background-color: #5a67d8;
            border-radius: 50px;
            text-decoration: none;
            box-shadow: 0 4px 14px rgba(90, 103, 216, 0.5);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          a.button:hover {
            background-color: #434190;
            box-shadow: 0 6px 20px rgba(67, 65, 144, 0.7);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to MedEnroll!</h1>
          <p>
            This project is a web-based customer registration system designed to reduce manual entry errors and eliminate duplicate records when onboarding new customers (e.g., surgeons) into the internal system.
          </p>
        </div>
      </body>
    </html>`);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
