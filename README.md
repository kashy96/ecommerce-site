🛒 E-commerce Platform
Welcome to my full-stack E-commerce Platform, a modern web application designed to deliver a seamless shopping experience with secure authentication, efficient state management, and robust payment processing. Built with a focus on performance and scalability, this project showcases my skills as a Full-Stack Developer using cutting-edge technologies.

✨ Features

Secure Authentication: Implements cookie-based token storage for safe and reliable user authentication and authorization.
Dynamic Frontend: Built with Next.js 15 (TypeScript) for a fast, SEO-friendly, and responsive user interface.
State Management: Powered by Redux Toolkit for efficient and scalable client-side data handling.
Robust Backend: Node.js and Express-based API for handling business logic and seamless communication with the frontend.
Transactional Emails: Integrated NodeMailer for sending order confirmations and user notifications.
Flexible Database: MongoDB for efficient storage of user profiles, product catalogs, and order histories.
Secure Payments: Stripe integration for smooth and secure payment processing.


🖥 Tech Stack

Frontend: Next.js 15, TypeScript, Redux Toolkit
Backend: Node.js, Express, NodeMailer
Database: MongoDB
Payment Gateway: Stripe


📁 Project Structure
ecommerce-site/
├── frontend/                # Next.js 15 (TypeScript) frontend application
├── backend/                 # Node.js + Express backend API
├── README.md                # Project documentation
└── ...


🚀 Getting Started
Follow these steps to set up and run the project locally.
Prerequisites

Node.js: v16 or higher
MongoDB: A running MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
Stripe Account: API keys for payment integration
SMTP Service: Credentials for NodeMailer (e.g., Gmail, SendGrid)

1. Clone the Repository
git clone https://github.com/kashy96/ecommerce-site.git
cd ecommerce-site

2. Install Dependencies
Install dependencies for both the frontend and backend.
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

3. Configure Environment Variables
Copy the example environment files and update them with your credentials.
# Backend
cp backend/.env.example backend/.env

Edit backend/.env with your MongoDB URI, NodeMailer SMTP credentials, and other required settings.
# Frontend
cp frontend/.env.local.example frontend/.env.local

Edit frontend/.env.local with your Stripe API keys and backend API URL.
4. Run the Development Servers
Start the backend and frontend servers in separate terminal sessions.
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev

The backend typically runs on http://localhost:8000 (or your configured port).
The frontend runs on http://localhost:3000.

5. Access the Application
Open http://localhost:3000 in your browser to explore the e-commerce platform.

📬 Contact
Have questions or feedback? Reach out to me on LinkedIn https://www.linkedin.com/in/muhammad-kashif-928655142/ or open an issue on the GitHub repository.

🌟 Acknowledgments

Built with ❤️ by [Your Name]
Inspired by modern e-commerce platforms and full-stack development best practices