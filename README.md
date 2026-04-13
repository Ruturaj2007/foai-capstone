# Scaler Support AI - Capstone Project

This repository contains the full frontend architecture for the **Scaler School of Technology** custom AI support platform and its companion administrative analytics dashboard. Originally prototyped as "SupportAI," the application has been entirely rebranded and restructured into a production-ready, highly-polished academic portal.

## 🚀 Key Features

### 1. Main Academic Portal
- **Premium UI/UX**: Built using React, Vite, and Tailwind CSS. The interface adopts a professional, dark aesthetic utilizing the Scaler color palette (`#E74C3C` accents), glassmorphic elements, and smooth intersection animations.
- **Micro-Animations**: Features dynamic number counters, smooth hover states, and fully responsive grid layouts optimized across all viewport sizes.
- **Embedded AI Support**: A custom, low-profile Support Chat widget natively attached to the site's footer. Includes Web Speech API integration for dynamic voice-to-text dictation.
- **Intelligent Routing**: Connects to a bespoke **n8n + Groq backend pipeline** via asynchronous webhooks, parsing complex diagnostic responses to provide real-time human-like support, ticket ID generation, and automatic escalation tagging.

### 2. Admin Analytics Engine (`/admin`)
- **Secure Architecture**: A fully isolated administrative portal nested securely behind client-side authentication layers. (Demo Credentials: `admin@scaler.com` / `scaler@admin123`).
- **Live Google Sheets Integration**: Replaces standard backend database polling with a custom utility that scrapes and parses live JSON payload dumps directly from a public Google Sheet (`Ticket Log`) every 30 seconds.
- **Chart.js Visualization Core**: Processes raw array streams into 12 bespoke visual metrics across 4 sub-dashboards:
  - **Overview**: 8-chart command center managing Resolution pie charts, Volume trend lines, Sentiment donuts, and Urgency arrays.
  - **All Tickets**: Granular, searchable data tables where every row infinitely expands to reveal total AI analytical breakdowns and internal payload matching logic.
  - **Escalations**: A pre-filtered critical triage platform pushing human-flagged tickets directly to relevant departments.
  - **FAQ Performance**: Directly monitors AI deflection capabilities by graphing explicit automated-resolution rates over time.

## 🛠️ Technology Stack

- **Core**: React 19, Vite 8
- **Styling**: Tailwind CSS v3, Plus Jakarta Sans & Inter typography
- **Routing**: React Router DOM (v6)
- **Data Visualization**: Chart.js, react-chartjs-2
- **Icons**: Lucide React
- **Backend Infrastructure**: n8n Webhook Workflow (JSON provided in repo), Groq LLM API, Google Sheets (NoSQL logging)

## 📦 Local Installation

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ruturaj2007/foai-capstone.git
   cd foai-capstone
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the Vite development server:**
   ```bash
   npm run dev
   ```
   *The application will boot up at `http://localhost:5173`. Navigate to the bottom right footer to find the Admin Access gateway.*

## ⚙️ Configuration Notes
- The AI pipeline is triggered via standard `POST` HTTP requests natively hitting the n8n webhook URL. Note that if deploying the n8n payload to an Ngrok tunnel, ensure exactly matching Headers (`ngrok-skip-browser-warning`) to explicitly circumvent browser warning intercepts.
- The workflow mapping JSON (`foai-capstone-fixed-webhook_scaler.json`) is explicitly provided in the root to be seamlessly deployed into independent n8n ecosystems.

---
*Built incrementally as a culminating AI architecture and React engineering capstone project.*
