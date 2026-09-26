 Node.js + Express + MongoDB Starter Kit


A scalable Node.js backend starter kit built with Express.js, MongoDB, and Mongoose.

---

 📋 Prerequisites

Before setting up the project, make sure the following are installed on your system:

- Node.js
- npm
- MongoDB (Local MongoDB or MongoDB Atlas)
- Git

You can verify the installations:

```bash
node -v
npm -v
git --version



🚀 Installation & Setup

Follow the steps below to set up the project after cloning the repository.

1. Clone the Repository
Clone the repository from GitHub:
git clone https://github.com/sanmo-yousof/backend-kit.git
Then navigate to the project directory:
cd backend-kit

2. Install Dependencies
Install all required project dependencies:
npm install

3. Configure Environment Variables
Create a .env file in the root directory.
Then configure the .env file:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/starter_db

4. Start the Development Server
Run the project in development mode:
npm run dev
If everything is configured correctly, you should see:
MongoDB connected successfully
Server running on port 5000

5. Verify the Server
Open the following URL in your browser or test it using Postman:
http://localhost:5000/api/v1/health
Expected response:
{
  "success": true,
  "message": "Server is healthy"
}
