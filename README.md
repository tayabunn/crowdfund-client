# 🚀 CrowdFund — Modern Crowdfunding & Backer Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  A full-stack, enterprise-grade crowdfunding platform empowering creators to launch campaigns and supporters to back innovative ideas through a secure virtual credit economy.
</p>

[🌐 Live Client Demo](https://crowdfund-client-xi.vercel.app/) • [⚡ Backend API](https://crowdfund-server.vercel.app/) • [📖 Features](#-key-features) • [🛠️ Getting Started](#-getting-started)

</div>

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
- [👥 Role-Based Portals](#-role-based-portals)
- [💳 Virtual Credit Economy](#-virtual-credit-economy)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📁 Project Structure](#-project-structure)
- [🛡️ Security & Quality Standards](#-security--quality-standards)
- [👤 Demo Credentials](#-demo-credentials)
- [📄 License](#-license)

---

## ✨ Key Features

- **🎨 Modern, Fluid UI/UX**: Built with Next.js 16 App Router, React 19, Tailwind CSS v4, Lucide Icons, and Framer Motion micro-animations.
- **🛡️ Multi-Role Access Control (RBAC)**: Distinct dashboards and workflows tailored for **Supporters**, **Creators**, and **Administrators**.
- **💳 Integrated Stripe Credit Purchasing**: Purchase virtual platform credits securely with real-time checkout sessions.
- **📈 Interactive Analytics & Dashboards**: Visual performance charts powered by Recharts for fundraising stats, velocity, and backer metrics.
- **🔍 Advanced Search & Filter**: Real-time filtering by categories (Technology, Health, Art, Community, Education, Disaster Relief), funding status, and search keywords.
- **⚡ In-App Notification System**: Real-time alert feed tracking campaign reviews, new contributions, and payout approvals.
- **🚩 Content Moderation & Reporting**: Community reporting workflow with automated admin review tools to keep the ecosystem safe.

---

## 👥 Role-Based Portals

| Role | Capabilities |
| :--- | :--- |
| **Supporter** | Browse approved campaigns, purchase platform credits via Stripe, contribute to projects, track contribution history, and view receipts. |
| **Creator** | Create and publish fundraising campaigns with media, manage milestones, monitor real-time campaign earnings, and request payouts. |
| **Admin** | Review & approve/reject campaigns, manage user permissions, oversee dispute reports, and process creator withdrawal requests. |

---

## 💳 Virtual Credit Economy

CrowdFund implements a transparent, streamlined credit model:
1. **Purchase**: Supporters purchase platform credits via secure Stripe payments (`10 Credits = $1 USD`).
2. **Fund**: Supporters allocate credits to approved campaigns of their choice.
3. **Withdraw**: Creators convert accumulated campaign credits into payouts upon admin verification and processing.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Routing**: React Context API, Next.js App Router
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Stripe Elements (`@stripe/react-stripe-js`)
- **Visuals & Charts**: Recharts & Swiper

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt hashing
- **Payments**: Stripe API SDK

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+`
- npm, yarn, or pnpm
- A running MongoDB instance (or MongoDB Atlas URI)
- Stripe developer test keys

### 1. Clone the Repository
```bash
git clone https://github.com/tayabunn/crowdfund-client.git
cd crowdfund-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of `crowdfund-client`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API | `http://127.0.0.1:5000/api` |
| `NEXT_PUBLIC_BASE_URL` | Base server host URL | `http://127.0.0.1:5000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public Stripe key for credit checkout | `pk_test_...` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for campaign image hosting | `5fbc4597...` |

---

## 📁 Project Structure

```text
crowdfund-client/
├── public/                # Static assets & icons
├── src/
│   ├── app/               # Next.js App Router routes & pages
│   │   ├── (auth)/        # Login & Registration pages
│   │   ├── (dashboard)/   # Supporter, Creator & Admin Dashboards
│   │   ├── (main)/        # Landing page, explore & details
│   │   ├── globals.css    # Design tokens & Tailwind v4 styling
│   │   └── layout.tsx     # Root application layout
│   ├── components/        # Reusable UI components & modals
│   │   ├── dashboard/     # Role-specific dashboard views
│   │   └── base-ui/       # Base atomic components
│   ├── context/           # AuthContext & global state providers
│   └── lib/               # Utility functions & API helpers
├── package.json
└── tsconfig.json
```

---

## 👤 Demo Credentials

Test the platform with the following pre-configured credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@crowdfund.com` | `Password123` |
| **Creator** | `creator@crowdfund.com` | `Password123` |
| **Supporter** | `supporter@crowdfund.com` | `Password123` |

---

## 🛡️ Security & Quality Standards
- **Token Authorization**: Secure Bearer tokens attached on all protected API mutations.
- **Form Validation**: Strict client-side and server-side validation.
- **Hydration Safe**: Optimized SSR-compatible hydration wrappers.
- **Responsive Layouts**: 100% mobile, tablet, and widescreen tested.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/tayabunn">Tayabunnesa</a></sub>
</div>
