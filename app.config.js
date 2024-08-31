// app.config.js
import "dotenv/config"; // Allows use of .env file if needed

export default {
  expo: {
    name: "YourAppName",
    slug: "your-app-name",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || "http://127.0.0.1:8000/api/",
    },
  },
};
