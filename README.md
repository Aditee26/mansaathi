# Mansaathi 🌿

### A calm, private space for checking in with yourself.

Mansaathi — meaning **"mind companion"** — is a full-stack MERN mental wellness platform designed around one simple idea: wellness tools should feel calm, personal, and easy to use.

Mansaathi lets users check in with their mood, write private journal entries, track everyday wellness activities, and understand their patterns over time through simple insights.

The product intentionally avoids the feel of a traditional dashboard. Instead, it uses a warm, low-stimulation interface focused on **trust, simplicity, accessibility, and privacy**.

> **Portfolio project:** Mansaathi is designed as a personal wellness and self-reflection application. It is not a clinical or medical tool and does not provide diagnosis, treatment, or professional mental-health guidance.

---

## ✨ Features

### 🔐 Authentication & Privacy

* Email/password authentication
* JWT-based authentication
* Passwords securely hashed with bcrypt
* Protected API and frontend routes
* Secure account and session handling
* Account deletion with associated user data

### 🌱 Daily Mood Check-ins

* Record one mood check-in per day
* Five-point mood scale
* Optional notes
* Edit today's mood entry
* View mood history and trends

### 📓 Private Journaling

* Create journal entries
* View previous entries
* Edit entries
* Delete entries
* Journal data is associated with the authenticated user

### 🧘 Wellness Activity Tracking

Track everyday activities across eight categories:

* Meditation
* Exercise
* Sleep
* Hydration
* Gratitude
* Social connection
* Outdoors
* Reading

### 📊 Personalized Dashboard

The dashboard brings everything together:

* Personalized greeting
* Today's mood
* Weekly mood summary
* Recent mood trend
* Recent journal entries
* Wellness activity overview

All dashboard information is generated from real MongoDB data rather than static mock data.

### 📈 Insights

* 30-day mood trend
* 7-day activity breakdown
* Visualized using Recharts
* Simple trends designed for reflection rather than clinical analysis

### ⚙️ Profile & Settings

* Update profile information
* Manage preferences
* Change password
* Delete account
* Remove associated personal data

### ♿ Accessible & Responsive

* Responsive design for desktop and mobile
* Semantic HTML
* Visible keyboard focus states
* Reduced-motion support
* Low-stimulation visual design
* Clear and consistent UI patterns

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **Vite**
* **React Router**
* **Axios**
* **Recharts**
* **Plain CSS**

### Backend

* **Node.js**
* **Express**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **express-validator**

### Architecture

Mansaathi deliberately avoids unnecessary complexity:

* No TypeScript
* No CSS frameworks
* No UI component kits
* No AI APIs
* No unnecessary abstractions

The goal is to keep the application understandable, maintainable, and easy to extend.

---

## 📁 Project Structure

```text
mansaathi/
├── backend/
│   ├── config/              # Database configuration
│   ├── models/              # Mongoose schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # Express API routes
│   ├── middleware/          # Authentication, validation & errors
│   ├── utils/               # Shared backend utilities
│   ├── app.js               # Express application setup
│   └── server.js            # Server entry point
│
├── frontend/
│   └── src/
│       ├── pages/           # Application pages
│       ├── components/      # Reusable UI components
│       ├── context/         # Global application state
│       ├── services/        # API/Axios configuration
│       ├── styles/          # Design system & shared styles
│       └── utils/           # Shared frontend utilities
│
├── .gitignore
└── README.md
```

The backend follows a conventional:

```text
Routes → Controllers → Middleware → Models
```

architecture.

The frontend follows:

```text
Pages → Components → Context / Services
```

This keeps responsibilities separated while making the codebase straightforward to navigate.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* **Node.js 18+**
* **npm**
* **MongoDB**

You can use either:

* A local MongoDB instance
* A MongoDB Atlas cluster

### 1. Clone the repository

```bash
git clone https://github.com/Aditee26/mansaathi.git
cd mansaathi
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, you can also use:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your configuration.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mansaathi
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

You can verify the server with:

```text
http://localhost:5000/api/health
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application should be available at:

```text
http://localhost:5173
```

Register an account and start using Mansaathi.

---

## 🔑 Environment Variables

### Backend — `backend/.env`

| Variable         | Description                | Example                               |
| ---------------- | -------------------------- | ------------------------------------- |
| `PORT`           | Port used by the API       | `5000`                                |
| `MONGO_URI`      | MongoDB connection string  | `mongodb://127.0.0.1:27017/mansaathi` |
| `JWT_SECRET`     | Secret used to sign JWTs   | Long random string                    |
| `JWT_EXPIRES_IN` | JWT token lifetime         | `7d`                                  |
| `CLIENT_URL`     | Frontend URL used for CORS | `http://localhost:5173`               |

### Frontend — `frontend/.env`

| Variable       | Description          | Example                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### 🔒 Security

Never commit real `.env` files, passwords, JWT secrets, or database credentials.

The repository includes `.env.example` files containing the required variable names without exposing sensitive values.

---

## 🏗️ Production Build

Build the frontend with:

```bash
cd frontend
npm run build
```

This generates a production-ready `dist/` directory.

The frontend can then be deployed to a static hosting platform, while the Express API can be deployed separately to a backend hosting service.

For production, use:

* A managed MongoDB deployment such as MongoDB Atlas
* Strong randomly generated JWT secrets
* HTTPS
* Production environment variables
* A production frontend URL in `CLIENT_URL`
* A production API URL in `VITE_API_URL`

---

## 🎨 Design Philosophy

Mansaathi is intentionally designed to feel different from a typical productivity or analytics dashboard.

### Warm, low-stimulation visual language

The interface uses:

* Warm off-white backgrounds
* Soft sage tones
* Muted teal accents
* Gentle contrast
* Minimal visual noise

### Typography

The visual system combines:

* **Fraunces** for expressive display typography
* **Inter** for readable interface text

### Intentional motion

Motion is deliberately limited.

A subtle **breathing dot** is used as a recurring visual element in the logo and selected empty states rather than adding animations throughout the interface.

### Mood without judgment

Mood states use a muted five-point scale instead of aggressive red/green semantic colors.

A difficult day is not treated as an error state.

The interface is designed to encourage reflection rather than evaluation.

---

## 🧠 Product & Technical Decisions

A few principles guided the development of Mansaathi:

**Keep the architecture conventional.**
The application uses familiar React and Express patterns instead of unnecessary abstractions.

**Keep the interface calm.**
Mental wellness data shouldn't feel like a performance dashboard.

**Keep personal data private.**
Authentication and user ownership are enforced throughout the API.

**Keep the product understandable.**
Every major feature has a clear relationship between the frontend, API, database model, and user experience.

**Build from real data.**
Dashboard and insight views are driven by persisted MongoDB data rather than hardcoded examples.

---

## 📌 Project Scope

Mansaathi is a **portfolio and learning project** demonstrating:

* Full-stack MERN development
* REST API design
* Authentication and authorization
* MongoDB data modeling
* CRUD operations
* React state management
* Protected routes
* Data visualization
* Responsive UI development
* Accessibility considerations
* Environment-based configuration

It is **not a clinical or medical application**.

Mansaathi does not provide:

* Medical diagnosis
* Mental-health treatment
* Clinical assessment
* Crisis intervention
* Professional medical advice

It is intended as a personal space for **mood check-ins, journaling, wellness habits, and self-reflection**.

---

## 🔮 Future Improvements

Potential future additions include:

* [ ] Dark mode
* [ ] More detailed mood analytics
* [ ] Custom wellness goals
* [ ] Data export
* [ ] Reminder notifications
* [ ] Improved mobile experience
* [ ] Automated testing
* [ ] Production deployment
* [ ] More granular privacy controls

---

## 👩‍💻 Author

**Aditee Singh**

GitHub: [Aditee26](https://github.com/Aditee26?utm_source=chatgpt.com)

---

## 📄 License

This project is currently intended as a portfolio project.

If you plan to make the repository open-source for others to reuse, consider adding an appropriate open-source license.

---

<p align="center">
  Built with care for calmer digital experiences 🌿
</p>
