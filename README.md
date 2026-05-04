# Vyaparr AI Invoice Generator

Generate smart, professional invoices in seconds using AI.

## Overview

Vyaparr is an intelligent invoice generation platform designed for modern professionals and businesses. It eliminates manual data entry by leveraging AI to seamlessly interpret service descriptions into structured, professional line items with calculated rates, quantities, and taxes. Built with a focus on speed and premium aesthetics, the platform delivers polished, ready-to-export PDF invoices in a fraction of the time.

## Features

* **AI-Powered Invoice Generation**: Simply describe the work you did, and the AI automatically structures professional line items and calculates costs.
* **Real-time Live Preview**: See exactly how your invoice will look as you edit or generate content.
* **Premium Dashboard UI**: A clutter-free, modern interface designed for focus and productivity.
* **Instant PDF Export**: Generate pixel-perfect, exportable PDF documents with one click.
* **Business Type Personalization**: Tailored templates for Freelancers, Agencies, and Fitness professionals.
* **Secure Cloud Storage**: Safely store and manage your past invoices with a persistent MongoDB database.

*Modern, high-performance interface designed for speed and clarity.*

## Tech Stack

* **Frontend**: React, Tailwind CSS, Framer Motion, Vite
* **Backend**: Node.js, Express, MongoDB (Mongoose)
* **Integrations**: OpenAI API for intelligent content framing
* **Utilities**: html2pdf.js for document rendering, bcryptjs & jsonwebtoken for authentication

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/CrypticAarya/vyaparr-invoice-generator.git
   ```

2. Navigate to the project directory
   ```bash
   cd vyaparr-invoice-generator
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Configure environment variables
   Create a `.env` file in the root directory based on `.env.example` and add your database, JWT, and OpenAI credentials.

5. Start the development server
   ```bash
   npm run dev
   ```

## Usage

1. Create an account or log in to access the system.
2. Select your business type to auto-configure tax rates and default notes.
3. Enter client details.
4. Use the "Magic Generation" bar to describe the service provided, or manually add line items in the table.
5. Review the real-time preview on the right side of the screen.
6. Click "Save Draft" to store it or "Export PDF" to download the finalized document.

## Project Structure

```text
vyaparr-invoice-generator/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication & security
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # UI components
│       ├── context/     # State management
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Route pages
│       └── api.js       # Backend integration
├── package.json         # Root scripts
└── README.md            # Documentation
```

## Future Improvements

* AI suggestions for invoices and industry-specific compliance standards
* Multi-language support
* Expanded Cloud Storage backends
* Automated email delivery system directly to clients

## Author

Sarthak
