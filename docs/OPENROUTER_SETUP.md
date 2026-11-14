# OpenRouter & NVIDIA Model Setup Guide

Atelier Prompt Engine can connect directly to **OpenRouter** to use vision models (like Llama 3.2 Vision, Gemini 2.0 Flash, or Qwen 2 VL) for extracting reference image details automatically. Text-only models (e.g., NVIDIA Nemotron 70B) are also supported for prompt synthesis.

---

## 1. Getting Your Free OpenRouter API Key

1. Go to [https://openrouter.ai/](https://openrouter.ai/) and sign up or log in.
2. Navigate to [https://openrouter.ai/keys](https://openrouter.ai/keys).
3. Click **"Create Key"**.
4. Give your key a name (e.g. `Atelier Prompt Engine`) and set Credit Limit (leave blank or set to your choice).
5. Copy the generated key (starts with `sk-or-v1-...`).

---

## 2. Supported Models

In Atelier Prompt Engine, click **Settings** in the sidebar or click the **model badge** in the top bar to open the Settings modal:

| Model ID | Provider | Cost | Vision Support | Best For |
| :--- | :--- | :--- | :--- | :--- |
| `meta-llama/llama-3.2-11b-vision-instruct:free` | Meta | **Free** | ✅ Full Vision | **Default** — Fast image feature extraction |
| `google/gemini-2.0-flash-exp:free` | Google | **Free** | ✅ Full Vision | High-resolution fashion analysis |
| `qwen/qwen-2-vl-72b-instruct:free` | Qwen | **Free** | ✅ Full Vision | Detailed fabric & jewellery extraction |
| `nvidia/llama-3.1-nemotron-70b-instruct` | NVIDIA | Standard / Credits | ❌ Text-Only | High-reasoning prompt synthesis (auto-used for text generation) |
| *Custom Model* | Any | Varied | Depends on model | Any model slug from OpenRouter's catalog |

> **Auto-switch:** When you upload a Look or Outfit image, the app automatically switches to a vision-capable model if the current one is text-only. You'll see a toast notification.

---

## 3. Privacy & Security Architecture

> [!NOTE]
> **Your API key is 100% private.**
> * Your key is stored solely in your personal browser's `localStorage` (`atelier_openrouter_api_key`).
> * It is **never** sent to any intermediate server, database, or analytics tracker.
> * It communicates directly and securely from your browser to OpenRouter's official API (`https://openrouter.ai/api/v1/...`) via encrypted HTTPS.
> * If you clear your browser cookies/storage or click reset, the key is wiped immediately.

---

## 4. How to Test Your Key

1. Open Atelier Prompt Engine.
2. Click **Settings** in the sidebar (or the model badge in the top bar).
3. Paste your key in the **OpenRouter API Key** field.
4. Click **"Test Connection"**.
5. You should see a green message: `Connected! · <label> · <limit>`.
6. Click **"Save Settings"**.

---

## 5. Server-Side Key (Render Deployment)

If you deploy on Render, you can also set `OPENROUTER_API_KEY` as an **Environment Variable** in the Render dashboard. The server will use it as a fallback when no user key is configured. This is useful for team deployments or if you don't want each user to enter their own key.
