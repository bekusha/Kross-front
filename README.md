# AI-Powered E-commerce Mobile Application

This repository contains the frontend of an AI-powered e-commerce application built with React Native and Expo Go. The application connects to a Django backend to provide features like personalized engine oil recommendations, shopping cart functionality, and order management.

---

## **Features**

- **AI Chatbot Integration:** Interacts with the backend to provide personalized product recommendations based on user input.
- **User Authentication:** Login and sign-up functionality using JWT authentication.
- **E-commerce Features:** Includes shopping cart, order management, and product browsing.
- **Dynamic Content:** Fetches product categories and details from the backend.

---

## **Technologies Used**

- **Frontend:** React Native with Expo Go
- **Backend:** Django REST Framework, OpenAI API, Django Channels
- **State Management:** Context API
- **Networking:** Axios for API calls

---

## **Getting Started**

### Prerequisites

Ensure you have the following installed:
- Node.js (version >= 16)
- Expo CLI
- A compatible mobile device or simulator (Android/iOS)

### Installing

Follow these steps to set up the project:

1. **Clone the Repository:**
 

2. **Install Dependencies:**

   npm install


3. **Set Up Environment Variables:**
   Create a `.env` file in the project root and add the following:
   ```env
   API_BASE_URL=http://backend/api
   ```

4. **Start the Development Server:**
   ```bash
   npx expo start
   ```

5. **Run on Mobile Device:**
   - Scan the QR code displayed in the terminal or Metro bundler using Expo Go.

---

## **Backend Configuration**

Ensure the Django backend is running and accessible. The API base URL should match the `API_BASE_URL` in your `.env` file. For example:

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

---

## **Folder Structure**

```
.
├── assets/          # Static assets like images
├── components/      # Reusable UI components
├── contexts/        # Context API for state management
├── screens/         # Application screens (e.g., Home, Product Details)
├── services/        # API service handlers
├── App.ts           # Root application entry point
└── .env             # Environment variables
```

---

## **Features Overview**

1. **Authentication:**
   - Login and sign-up pages connect to the backend API for user authentication.

2. **Product Browsing:**
   - Displays products and categories fetched from the backend.

3. **AI Chatbot:**
   - Sends user input to the backend and displays recommended products.

4. **Shopping Cart:**
   - Allows users to add/remove products and proceed to checkout.

5. **Order Management:**
   - Users can view their past orders and track current ones.

---

## **Running on Android Emulator**

1. Install Android Studio and set up an emulator.
2. Run the following command to open the app on the emulator:
   ```bash
   npx expo run:android
   ```

---

## **Running on iOS Simulator**

1. Install Xcode and set up an iOS simulator.
2. Run the following command to open the app on the simulator:
   ```bash
   npx expo run:ios
   ```

---

## **Testing**

Use the following command to run tests:
```bash
npm test
```

---

## **Deployment**

1. **Build the App:**
   Use Expo’s build service to generate APK or IPA files:
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

2. **Publish the App:**
   Follow the respective app store guidelines to publish the app.

---

## **Contact**

For any questions or issues, please contact:

**Beka Jorjikia**  
**Email:** beka.jorjikia@gmail.com
