const express = require("express");
const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS middleware (important for WordPress to connect)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log("----- Incoming Request -----");
  console.log("URL:", req.originalUrl);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("----------------------------");
  next();
});

// Google login endpoint
app.post("/api/auth/google-login", (req, res) => {
  const { jwt_token, access_token, email, name } = req.body;

  // Validation
  if (!jwt_token || !email || !name) {
    const errorResponse = {
      result: {
        status: "error",
        message: "Required data is missing (jwt_token, email, or name).",
      },
    };
    console.log("----- Outgoing Response (ERROR) -----");
    console.log(JSON.stringify(errorResponse, null, 2));
    console.log("-------------------------------------");
    return res.status(400).json(errorResponse);
  }

  // Log received data
  console.log("\n✅ Received Google Auth Data:");
  console.log("- JWT Token:", jwt_token.substring(0, 50) + "...");
  console.log("- Access Token:", access_token || "(not provided)");
  console.log("- Email:", email);
  console.log("- Name:", name);

  // Success response
  const successResponse = {
    result: {
      status: "success",
      data: {
        token: "fake_odoo_jwt_token_12345",
        user: {
          id: 101,
          name: name,
          email: email,
        },
      },
      message: "Google login successful (mocked)",
    },
  };

  console.log("----- Outgoing Response (SUCCESS) -----");
  console.log(JSON.stringify(successResponse, null, 2));
  console.log("---------------------------------------");

  return res.status(200).json(successResponse);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Mock Odoo API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n========================================");
  console.log(`✅ Mock Odoo API running at http://localhost:${PORT}`);
  console.log(`📍 Endpoint: POST http://localhost:${PORT}/api/auth/google-login`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
  console.log(`📦 Expected body: { jwt_token, access_token, email, name }`);
  console.log("========================================\n");
});