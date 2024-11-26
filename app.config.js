// app.config.js
import "dotenv/config"; // Allows use of .env file if needed

export default {
  expo: {
    name: "KROSSGEORGIA",
    slug: "your-app-name",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    android: {
      package: "com.bekajorjikia.krossgeorgia",
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain", 
      backgroundColor: "#FFFFFF", 
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || "http://127.0.0.1:8000/api/",
      eas: {
        projectId: "cc7f1485-cd00-4ca3-b678-f10b1d281fe0",
      }
    },
  },
};
