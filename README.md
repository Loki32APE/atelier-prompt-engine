# Atelier Prompt Engine — Visual & Textual Prompt Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
[![Architecture: Static Modular](https://img.shields.io/badge/Architecture-Modular%20HTML%2FCSS%2FJS-orange)](#system-architecture)

> **Atelier Prompt Engine** is an editorial prompt workstation designed for fashion photography, structured aesthetic synthesis, reference-led visual extraction, and **Nano Banana 2.1** raw prompt architecture.

---

## 🌟 Key Features

* **Vision Studio**:
  * Dual dropzones for **Look Reference** (framing, pose, lighting) and **Outfit Reference** (garments, zari weave, drape).
  * Direct extraction via **OpenRouter Vision API** using **NVIDIA NeMo / Nemotron VL**, Llama 3.2 Vision, or Gemini 2.0 Flash.
* **RAW Prompt Architecture (Nano Banana 2.1)**:
  * Reference transfer directive: `OUTFIT: take the outfit from reference image.`
  * **Natural Fabric Physics Engine**: Gravity drape simulations (`Fuller Body Drape`, `Silk Zari Pallu`, `Tailored Crepe`, `Minimal Clean`).
  * **Anti-Shrinkwrap Negative Chips**: Prevents vacuum-suction clinging across midsections and artificial muscle lines.
  * Detail mode budgets: **Fast (~800ch)**, **Balanced (~1.4k)**, and **Detailed (~2k)**.
* **Authentic 8-Module Visual Lab**:
  1. *Camera Settings* (Shot Type, Device, Lens, Lighting)
  2. *Theme / Genre* (16+ Indian couture & editorial aesthetics)
  3. *Art Style* (Photorealistic, Kodak Portra 400, Film Grain)
  4. *Background / Location* (Sandstone palace, lime plaster studio, concrete gallery)
  5. *Attire & Jewellery* (14 granular slots with custom overrides)
  6. *Appearance* (Makeup base, eye kohl, lip finish, hair length, styling & parting)
  7. *Action & Pose* (Stance, hand placement, gaze direction, mood)
  8. *Character Design* (Age, build, cultural styling, distinguishing marks)
* **Smart Features**:
  * Bespoke **Custom Overrides** for every select dropdown.
  * Real-time **Wardrobe Conflict Detection** & One-Click Auto-Repair.
* **Multi-Target Live Compiler**:
  * Real-time non-blocking live output compiler.
  * Compiles across: **NB 2.1 (RAW Mode)**, **NB 2.1 (Master Labeled)**, **Natural Prose**, **Midjourney v6.1**, **Flux.1**, and **JSON Payload**.

---

## 📁 Repository Structure

```text
atelier-prompt-engine/
│
├── index.html                   # Main semantic web application shell
│
├── css/
│   ├── base.css                 # Design tokens, obsidian darkroom theme & shell
│   ├── studio.css               # Vision Studio dropzones & Nano Banana 2.1 Raw Architecture
│   ├── lab.css                  # 8-Module Visual Lab accordions & slot styling
│   └── compiler.css             # Live Compiler drawer, syntax switcher & live counters
│
├── js/
│   ├── schema.js                # Authentic 8-module editorial taxonomy (LAB_SCHEMA)
│   ├── raw_prompts.js           # Nano Banana 2.1 system prompts, fabric physics & constraints
│   ├── openrouter.js            # OpenRouter API client (NVIDIA NeMo / Nemotron VL & free models)
│   ├── compiler.js              # Multi-target prompt compiler & character budget optimizer
│   └── app.js                   # Application controller, state management, dropzones & events
│
├── docs/                        # Complete in-depth guides (.md)
│   ├── ARCHITECTURE.md          # Full system architecture & prompt pipeline design
│   ├── OPENROUTER_SETUP.md      # Free OpenRouter API key & NVIDIA model guide
│   ├── RENDER_DEPLOYMENT.md     # Step-by-step beginner guide to Render deployment
│   └── PROMPT_SYNTAX_GUIDE.md   # Nano Banana 2.1 rules, syntax & fabric physics reference
│
├── README.md                    # Project overview & documentation (this file)
└── .gitignore                   # Git hygiene configuration
```

---

## 🚀 Quick Start (Local Testing)

Run a local server with Python or any static file server:

```bash
# Using Python (built-in):
python -m http.server 8080

# Or using Node:
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🌐 Deploying to Render (100% Free)

Deploying Atelier Prompt Engine takes less than 2 minutes on Render:

1. Push this folder to a new **GitHub repository**.
2. Log into [Render.com](https://render.com) using your GitHub account.
3. Click **New +** -> **Static Site**.
4. Select your `atelier-prompt-engine` repo.
5. Set:
   * **Build Command**: *(leave blank)*
   * **Publish Directory**: `.`
6. Click **Create Static Site**.

Your live URL (e.g. `https://atelier-prompt-engine.onrender.com`) will be online within seconds with free SSL!

For detailed step-by-step instructions, see [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md).

---

## 🔑 OpenRouter Setup

To enable AI reference extraction:
1. Obtain a free API key at [openrouter.ai/keys](https://openrouter.ai/keys).
2. Click **Config** in the sidebar.
3. Paste your key and click **Save Settings**.
4. Read [docs/OPENROUTER_SETUP.md](docs/OPENROUTER_SETUP.md) for supported models and free tier vision options.

---

## 📄 Documentation

* [System Architecture](docs/ARCHITECTURE.md)
* [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md)
* [OpenRouter Setup & Models](docs/OPENROUTER_SETUP.md)
* [Prompt Syntax & Rules Guide](docs/PROMPT_SYNTAX_GUIDE.md)

---

## ⚖️ License
MIT License. Free to use, modify, and distribute.
