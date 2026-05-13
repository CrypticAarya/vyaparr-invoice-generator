# Vyapaar Flow

**A Production-Ready Invoicing SaaS for Indian SMEs**

Vyapaar Flow is a specialized invoicing platform designed to solve the complexities of Indian GST billing. Built with a focus on stability, data integrity, and high-density user experience, it transforms the billing workflow for small-to-medium enterprises.

## 🛠 Project Overview

Unlike generic invoicing tools, Vyapaar Flow is engineered specifically for the Indian regulatory environment. It automates tax splitting (CGST/SGST vs IGST), handles HSN/SAC code management, and provides a real-time receivables tracking system.

### Key Engineering Pillars

*   **Financial Accuracy**: Real-time tax calculation engine with support for inter-state (IGST) and intra-state (CGST/SGST) transactions.
*   **Performance & Density**: High-density workspace layouts designed for professional users who prioritize speed and data visibility over flashy aesthetics.
*   **Data Integrity**: Atomic synchronization between invoices and inventory levels, ensuring stock levels are always accurate.
*   **Security**: Dual-token authentication (JWT) with secure session management and role-based access controls.

## 🏗 Technical Architecture

### Frontend
- **React 19 / Vite**: Modern SPA architecture with fast HMR.
- **Tailwind CSS**: Custom professional design system focused on high-density UI.
- **TanStack Query**: Robust server state management with optimistic updates.
- **Framer Motion**: Subtle micro-interactions that enhance UX without distracting.

### Backend
- **Node.js / Express**: Modular service-oriented architecture.
- **MongoDB / Mongoose**: Structured document schema with strictly validated business logic.
- **JWT**: Secure authentication with Access and Refresh tokens.

## 📂 System Design

```text
vyaparflow/
├── backend/
│   ├── services/        # Domain logic: Invoicing, Inventory, Analytics
│   ├── middleware/      # Auth, Error handling, Validation
│   └── models/          # Strict schema definitions (Mongoose)
├── frontend/
│   ├── src/
│   │   ├── hooks/       # Reusable business logic (Invoice state, Analytics)
│   │   ├── ui/          # High-density design system components
│   │   └── api.js       # Standardized API client with interceptors
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local instance
- OpenAI API Key (Optional for Smart Assistant features)

### Installation
```bash
# Clone the repository
git clone https://github.com/CrypticAarya/vyaparr-invoice-generator.git

# Install all dependencies (Root, Backend, and Frontend)
npm run install:all

# Setup Environment
cp backend/.env.example backend/.env
# Update .env with your credentials

# Run development servers
npm run dev
```

## 📄 License & Author

Distributed under the **MIT License**. Created by **Sarthak**.

---
*This project was refactored to demonstrate a product-minded engineering approach, prioritizing utility and stability for professional SaaS applications.*
