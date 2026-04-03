# Souqii - AI-Powered eCommerce Platform

A modern, premium eCommerce application built with React, TypeScript, and Tailwind CSS, featuring AI-powered shopping assistance.

## Features

- 🛒 **Full eCommerce Experience** - Browse, search, filter, cart, checkout
- 🤖 **AI Shopping Assistant** - PC build recommendations, compatibility checks
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 📱 **Mobile-First Design** - Responsive across all devices
- 💾 **Persistent Cart** - Guest cart with localStorage, synced on login
- 🔐 **Authentication** - Sign in/up with guest browsing support

## Tech Stack

- **Frontend:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS with custom design system
- **State:** Zustand with persistence
- **Routing:** React Router v6
- **HTTP:** Axios with interceptors
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base primitives (Button, Input, Card)
│   ├── layout/         # Header, Footer, MobileNav
│   ├── product/        # Product card, grid, filters
│   ├── cart/           # Cart items, summary
│   └── ai/             # AI chat interface
├── pages/              # Route pages
├── stores/             # Zustand stores
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── constants/          # App constants
```

## API Integration

All APIs are connected to: `https://souqii-one.vercel.app`

| Endpoint | Description |
|----------|-------------|
| POST /api/auth/signup | User registration |
| POST /api/auth/signin | User login |
| GET /api/products | Product listing |
| POST /api/ai | AI chat |
| GET/POST /api/orders | Order management |
| POST /api/checkout | Stripe checkout |
| GET/PUT /api/userDetails | User profile |

## Key Features

### Cart Merge Logic
- Guest users can add items to cart (stored in localStorage)
- On login, local cart is merged with server cart
- Combined quantities for matching products
- Synced back to server

### AI Assistant
- PC upgrade recommendations
- Compatible component suggestions  
- Budget-based build recommendations
- Context-aware (knows your cart items)

## Cleanup

After setup, delete these old template files:
- `src/App.jsx`
- `src/main.jsx`
- `src/App.css`

---

Built with ❤️ using React + TypeScript + Tailwind CSS
