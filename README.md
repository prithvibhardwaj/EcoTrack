# EcoTrack

> A grocery carbon footprint calculator that turns your shopping bill into actionable environmental insights.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Eco Rating System](#eco-rating-system)
- [Carbon Offset Plans](#carbon-offset-plans)
- [Connecting a Backend](#connecting-a-backend)
- [Contributing](#contributing)

---

## Overview

EcoTrack lets users photograph or upload a grocery receipt and instantly see the CO2 equivalent emissions associated with each item. Results are broken down per product with confidence scores, tracked over time, and paired with personalised recommendations to help reduce environmental impact.

The current release ships with a mock data layer so the full UI can be explored without a backend. Swap in a real OCR + emissions API to go production-ready.

---

## Features

| Tab | Description |
|---|---|
| **Analysis** | Upload a grocery bill image and get a per-item CO2 breakdown with match confidence |
| **Monthly Tracking** | Visualise emissions trends month-over-month and compare against other users |
| **Carbon Offset** | Subscribe to verified offset programmes (Basic, Eco Plus, Climate Hero) |
| **Insights** | Personalised tips — reduce meat, buy local, switch to dairy alternatives, and more |

**Additional highlights:**

- Drag-and-drop or click-to-upload image input
- Eco rating (A+ → D) calculated from average emissions per item
- Confidence scoring (High / Medium / Low) per matched product
- Responsive layout — works on mobile, tablet, and desktop
- Trend indicators showing month-on-month emission changes

---

## Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.0.0 |
| npm | 8.0.0 |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/eco-track-co2-calculator.git
cd eco-track-co2-calculator
```

**2. Install dependencies**

```bash
npm install
```

### Running the App

```bash
# Development server with hot reload
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build

# Run tests
npm test
```

---

## Project Structure

```
eco-track-co2-calculator/
├── public/
│   ├── index.html              # HTML entry point
│   └── manifest.json           # PWA manifest
├── src/
│   ├── App.js                  # Root component — all tabs and state
│   ├── App.jsx                 # JSX variant (mirrors App.js)
│   ├── index.js                # React DOM entry point
│   ├── index.css               # Tailwind base styles
│   └── App.css                 # Legacy CRA styles
├── tailwind.config.js          # Tailwind content paths
├── postcss.config.js           # PostCSS plugins
└── package.json                # Dependencies and scripts
```

---

## Usage Guide

### Analysing a grocery bill

1. Navigate to the **Analysis** tab.
2. Drag and drop your receipt image onto the upload zone, or click **Choose File**.
3. Wait for the analysis to complete (replace the mock timeout with your API call — see [Connecting a Backend](#connecting-a-backend)).
4. Review the four summary cards and the detailed item breakdown table.

### Understanding the item breakdown table

| Column | Description |
|---|---|
| Original Item | Product name as read from the receipt |
| Matched Product | Closest entry found in the emissions database |
| Quantity | Weight in kg used for the calculation |
| CO2/kg | Emissions factor (kg CO2eq per kg of product) |
| Total CO2 | `Quantity × CO2/kg` |
| Confidence | Match quality — High (≥ 0.8), Medium (≥ 0.5), Low (< 0.5) |

### Monthly tracking

The **Monthly Tracking** tab displays placeholder aggregate stats. Connect a data persistence layer to populate the trend chart with real historical uploads.

### Insights

The **Insights** tab surfaces pre-written recommendations. Wire these to your backend to make them dynamic based on the user's actual purchase history.

---

## Eco Rating System

Average emissions per item (total CO2 ÷ number of items) map to a letter grade:

| Grade | Threshold | Colour |
|---|---|---|
| A+ | < 2 kg CO2eq/item | Green |
| A | < 4 kg CO2eq/item | Green |
| B | < 6 kg CO2eq/item | Yellow |
| C | < 8 kg CO2eq/item | Orange |
| D | ≥ 8 kg CO2eq/item | Red |

---

## Carbon Offset Plans

Three subscription tiers are displayed in the **Carbon Offset** tab:

| Plan | Price | Monthly Offset Capacity |
|---|---|---|
| Basic | $5/month | Up to 15 kg CO2eq |
| Eco Plus _(recommended)_ | $12/month | Up to 35 kg CO2eq |
| Climate Hero | $25/month | Unlimited |

> These are UI placeholders. Integrate a payment provider (e.g. Stripe) and a verified offset registry to make subscriptions functional.

---

## Connecting a Backend

The analysis logic currently uses a `setTimeout` mock in `handleFileUpload` inside `src/App.js`. Replace it with a real API call:

```js
// src/App.js — inside handleFileUpload(), replace the mock setTimeout block

try {
  const formData = new FormData();
  formData.append('bill', file);

  const response = await fetch('/api/analyse', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Analysis failed');

  const data = await response.json();
  setAnalysisResults(data);
} catch (err) {
  setError(err.message);
} finally {
  setIsLoading(false);
}
```

**Expected API response shape:**

```json
{
  "total_emissions": 8.245,
  "total_items": 12,
  "matched_items": 10,
  "unmatched_items": 2,
  "confidence_stats": { "high": 6, "medium": 3, "low": 1 },
  "item_breakdown": [
    {
      "original_name": "Bananas",
      "matched_product": "bananas",
      "quantity": 2.0,
      "co2_per_kg": 0.7,
      "total_co2": 1.4,
      "similarity_score": 0.95
    }
  ]
}
```

---

## Contributing

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes.
3. Ensure the test suite passes:
   ```bash
   npm test
   ```
4. Open a pull request with a clear description of your changes.

**Ideas for contributions:**

- Real OCR integration (Google Vision API, Tesseract.js)
- Persistent monthly tracking with a database backend
- Shareable emissions report export (PDF / image)
- Dark mode support
- Localisation and multi-currency offset pricing
- Unit and integration test coverage

---

## Acknowledgements

- [Lucide React](https://lucide.dev) — icon library
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [Create React App](https://create-react-app.dev) — project scaffold
- CO2 emissions factors based on publicly available lifecycle assessment data
