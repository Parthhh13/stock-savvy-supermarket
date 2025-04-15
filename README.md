
# 🛒 Supermarket Inventory Management System (AI-Powered)

An AI-integrated inventory and billing web app for supermarkets. Built with the MERN stack and enhanced by demand forecasting ML models.

## ⚙️ Features
- Role-based authentication (Admin, Cashier, Staff)
- Product management (CRUD + Search)
- Real-time billing and stock deduction
- AI demand forecasting (Prophet / LSTM)
- Automated restocking recommendations
- Sales reports and best-selling items dashboard

## 🧠 AI Model
- Python-based microservice using Prophet or LSTM
- Accepts sales data → returns future stock demand
- Frontend displays predictions with charts

## 🧱 Tech Stack
- **Frontend:** React.js, Axios, Chart.js/Recharts, Tailwind
- **Backend:** Node.js, Express.js, MongoDB, JWT, Bcrypt
- **AI Model:** Python, Flask/FastAPI, Prophet/LSTM

## 📦 MongoDB Collections
- `users`, `products`, `sales`, `forecasts`

## 🛠️ Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### ML Model (Optional)
```bash
cd ml_model
python demand_forecasting.py
```

## 🧪 Roles
- Admin → Full access
- Cashier → Billing only
- Staff → View-only or limited access

## 📊 To Do
- [ ] Build REST APIs for all features
- [ ] Implement protected routes
- [ ] Integrate AI microservice
- [ ] Test entire flow from login → inventory → billing → insights
- [ ] Deploy all services
