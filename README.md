# Civitas — Smart City CMS (Frontend)

Civitas is a modern, responsive, and feature-rich **Smart City Complaint Management & Analytics System (CMS)** frontend built with React, Vite, and Tailwind CSS. It is designed to empower citizens to report municipal issues, interact with an AI assistant, and track complaints, while providing city administrators and staff with streamlined tools to review, assign, track, resolve, and analyze municipal issues.

> [!IMPORTANT]  
> This repository contains **only the frontend application**. The backend codebase (API server, database models, database connections, and services) is located in the **[civitas-backend](https://github.com/Mani2815/civitas-backend)** repository.

---

## 🚀 Key Features

*   **Landing Page**: A visually engaging presentation of the Civitas platform with a clean aesthetic and clear call-to-actions.
*   **Role-Based Portals**:
    *   **Citizen Dashboard**: File geolocated complaints, choose categories, upload photos, view status logs, interact with a virtual civic assistant, and manage profiles.
    *   **Staff Dashboard**: View assigned complaints, update status (Pending $\rightarrow$ Assigned $\rightarrow$ In Progress $\rightarrow$ Resolved/Rejected), and submit progress updates.
    *   **Admin Dashboard**: Manage staff accounts, assign complaints to specific staff members, override statuses, and access system-wide statistics.
*   **Interactive Mapping**: Integrated OpenStreetMap/Leaflet maps to visually pinpoint complaint locations, allowing for geographical mapping of issues.
*   **Advanced Analytics & Reporting**: Interactive data visualizations (powered by Recharts) in the Admin Portal showcasing complaint distribution, categories, and resolution trends.
*   **Theme Customization**: Light and dark mode support with an easy toggle.
*   **Virtual Assistant**: An integrated chatbot widget for answering citizen questions and guiding them through filing complaints.
*   **Modern UX/UI Design**: Powered by Tailwind CSS and Framer Motion for premium, smooth micro-interactions, spotlight/neon buttons, and glassmorphic card layouts.

---

## 🛠️ Technology Stack

*   **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (for fast development builds)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
*   **Routing**: [React Router DOM v6](https://reactrouter.com/)
*   **State Management & Caching**: [TanStack React Query v5](https://tanstack.com/query)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Interactive Maps**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

---

## 📂 Directory Structure

Here is a breakdown of the `src` folder structure:

```text
src/
├── components/   # Reusable UI components (Buttons, Cards, Chatbot, Leaflet Map embeds, Recharts panels)
├── context/      # Global state providers (Authentication state, Theme customization)
├── layouts/      # Layout containers (AuthLayout, Sidebar-based DashboardLayout)
├── pages/        # Route page views (Landing, Login, Register, Dashboards, Complaint detail views)
├── routes/       # Protected/unprotected routing rules and role permissions
├── services/     # Axios API integrations (auth, complaints, analytics, chatbot endpoints)
├── utils/        # Utility helpers (formatting dates, statuses, system constants)
├── App.jsx       # Main application routing wrapper
└── main.jsx      # App mount entry point
```

---

## ⚙️ Getting Started & Installation

To run this application locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) along with `npm` (Node Package Manager).

### 1. Clone the repository and navigate to the directory
```bash
git clone https://github.com/Mani2815/civitas-frontend.git
cd civitas-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project to configure the backend API location:

```env
# URL where your civitas-backend API is running
VITE_API_URL=http://localhost:5001/api
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will start, and the address is usually accessible at `http://localhost:5173`.

### 5. Build for Production
To bundle the frontend assets for a production deployment:
```bash
npm run build
```
You can preview the built bundle locally using:
```bash
npm run preview
```

---

## 🌐 Deployment

This project includes a `vercel.json` file to support single-page application (SPA) routing redirection on [Vercel](https://vercel.com/). If you deploy this project, all client-side paths will correctly resolve back to `index.html`.
