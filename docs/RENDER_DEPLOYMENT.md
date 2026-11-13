# Step-by-Step Render Deployment Guide (For Beginners)

This guide walks you through deploying **Atelier Prompt Engine** on **Render** as a 100% free **Static Site**.

---

## Why Render Static Site?
* **100% Free Forever**: No hidden costs.
* **Instant Loading**: Unlike free backends, Static Sites **never go to sleep**.
* **Automatic HTTPS**: Secure SSL certificate included out of the box.
* **Continuous Deployment**: Whenever you push code to GitHub, Render updates your site automatically.

---

## Step 1: Push Your Code to GitHub

If you haven't uploaded your project to GitHub yet, follow these simple steps:

### A. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `atelier-prompt-engine`.
3. Set visibility to **Public** or **Private** (both work on Render for free).
4. Do **not** initialize with README or .gitignore (we already have them).
5. Click **"Create repository"**.

### B. Push From Your Computer
Open **PowerShell** or **Git Bash** in your project folder (`atelier-prompt-engine`) and run:

```bash
# 1. Initialize git
git init

# 2. Add all modular files
git add .

# 3. Commit the changes
git commit -m "Initial commit: Modular Atelier Prompt Engine with OpenRouter VL"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/atelier-prompt-engine.git

# 6. Push to GitHub
git push -u origin main
```

---

## Step 2: Connect GitHub to Render

1. Go to [https://render.com/](https://render.com/).
2. Click **"Get Started for Free"** or **"Sign In"**.
3. Choose **"Continue with GitHub"** (this links your accounts automatically).
4. Once logged in, click the blue **"New +"** button in the top right.
5. Select **"Static Site"**.

---

## Step 3: Configure Your Static Site

1. In the **"Connect a repository"** list, find your `atelier-prompt-engine` repo and click **"Connect"**.
   *(If you don't see it, click "Configure access" to grant Render permission to your repo).*
2. Fill in the settings:
   * **Name**: `atelier-prompt-engine` (or any custom name you prefer).
   * **Branch**: `main`
   * **Build Command**: *Leave blank* (No build step needed!).
   * **Publish Directory**: `.` (A single dot, or `./`, meaning the root folder where `index.html` lives).
3. Scroll down and click **"Create Static Site"**.

---

## Step 4: Access Your Live App

1. Render will deploy your site in about 15–30 seconds.
2. At the top of the Render dashboard, you will see your live public URL:
   `https://atelier-prompt-engine.onrender.com`
3. Click the link to open your live application!

---

## Step 5: How to Test

1. Open your live Render URL on your desktop or mobile phone.
2. Click the **NVIDIA NeMo VL** badge in the top right (or **Config** in the left rail).
3. Paste your free OpenRouter API key and click **"Test Connection"**.
4. Once verified, click **"Save Settings"**.
5. Go to **Vision Studio**, drop an outfit reference photo, and click **"Extract with Vision"**.
6. Switch to **Visual Lab** to customize options, or switch target syntaxes (`NB 2.1 RAW`, `Prose`, `Midjourney`) in the right-hand compiler drawer!

---

## Updating Your Site in the Future
Whenever you make changes to files locally:
```bash
git add .
git commit -m "Update prompt presets"
git push
```
Render will automatically detect the new commit and update your live site within seconds!
