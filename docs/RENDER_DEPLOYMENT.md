# Render Deployment Guide (Secure Environment Variable Setup)

This guide walks you through deploying **Atelier Prompt Engine** on **Render** as a Web Service where your **OpenRouter API Key** is stored securely in Render Environment Variables, with **zero key exposure in the frontend**.

> **Note:** The app runs on the Flask backend (`app.py`). The Node `server.js` is kept for reference but is not the canonical server.

---

## Step 1: Push Updated Files to GitHub

Make sure the following files are committed to your GitHub repo (`Loki32APE/atelier-prompt-engine`):
1. `index.html` (Frontend with Model picker, Custom model slug, API key input)
2. `app.py` (Flask Backend — AI routes: /generate, /vision-lab/generate, /status, /api/vision, /validate, /repair)
3. `requirements.txt` (Python dependencies: flask, gunicorn)

---

## Step 2: Create a Web Service on Render

1. Go to [https://render.com/](https://render.com/) and log in.
2. Click the blue **"New +"** button in the top right.
3. Select **"Web Service"** (Free tier available).
4. Connect your GitHub repository: `Loki32APE/atelier-prompt-engine`.
5. Configure the service:
   * **Name**: `atelier-prompt-engine`
   * **Region**: Oregon (US West) or any closest to you
   * **Branch**: `main`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn app:app`
   * **Instance Type**: **Free** ($0/month)

---

## Step 3: Add Your OpenRouter API Key (Environment Variables)

1. On the same creation page (or in your service settings under **"Environment"** tab):
2. Click **"Add Environment Variable"**.
3. Set:
   * **Key**: `OPENROUTER_API_KEY`
   * **Value**: Your OpenRouter API key (e.g. `sk-or-v1-...`)
4. Click **"Create Web Service"** (or **"Save Changes"**).

> **Optional:** The app also supports per-user keys entered directly in the browser (Settings → OpenRouter). The server-side key is used as a fallback when no user key is set.

---

## Step 4: Done!

* Render will start your server securely.
* When you open your live URL (e.g., `https://atelier-prompt-engine.onrender.com`), you only need to select which model you want from the dropdown or type a custom model slug.
* When you click **"Extract with Vision"**, your server forwards the request to OpenRouter using your hidden `OPENROUTER_API_KEY` (server-side fallback) or your per-user key (if set in Settings).
* **Your API key is never visible to visitors or anywhere in the browser!**
