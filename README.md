# Intern Dashboard Backend

This is the Node.js Express backend for the Intern Dashboard application, using MongoDB for data storage.

## Prerequisites

* **Node.js:** Make sure you have Node.js installed (LTS version recommended).
* **MongoDB:** You need a running MongoDB instance. You can install it locally or use a cloud service like MongoDB Atlas.

## Setup

1.  **Navigate to the `backend` directory:**
    ```bash
    cd intern-dashboard/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure MongoDB:**
    * Open `server.js`.
    * Update the `MONGODB_URI` constant if your MongoDB instance is not running on the default `mongodb://localhost:27017/intern_dashboard`.

4.  **Seed Dummy Data (Important!):**
    * In `server.js`, locate the `seedData()` function call.
    * **Uncomment** `seedData();`
    * Run the server once: `node server.js`
    * After you see "Dummy data seeded successfully!", **comment out** `seedData();` again to prevent re-seeding on every server start.

5.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server will start on port `5000` (or your specified `PORT`). You should see "MongoDB connected successfully" and "Server running on port 5000" in your terminal.

## API Endpoints

* `POST /api/login`: Dummy login. Expects `username` (email) and `password` in the request body.
* `GET /api/intern-data/:email`: Fetches data for a specific intern by email.
* `GET /api/leaderboard`: Fetches the top interns for the leaderboard.