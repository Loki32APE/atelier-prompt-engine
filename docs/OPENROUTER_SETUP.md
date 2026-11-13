# OpenRouter & NVIDIA Model Setup Guide

Atelier Prompt Engine can connect directly to **OpenRouter** to use vision models (like NVIDIA NeMo / Nemotron VL, Llama 3.2 Vision, or Gemini 2.0 Flash) for extracting reference image details automatically.

---

## 1. Getting Your Free OpenRouter API Key

1. Go to [https://openrouter.ai/](https://openrouter.ai/) and sign up or log in.
2. Navigate to [https://openrouter.ai/keys](https://openrouter.ai/keys).
3. Click **"Create Key"**.
4. Give your key a name (e.g. `Atelier Prompt Engine`) and set Credit Limit (leave blank or set to your choice).
5. Copy the generated key (starts with `sk-or-v1-...`).

---

## 2. Supported Models

In Atelier Prompt Engine, click **Config** in the left rail or click the **NVIDIA NeMo VL** badge in the top bar to open the settings modal:

| Model ID | Provider | Cost | Vision Support | Best For |
| :--- | :--- | :--- | :--- | :--- |
| `nvidia/llama-3.1-nemotron-70b-instruct` | NVIDIA | Standard / Credits | Text synthesis | High-reasoning master prompt synthesis |
| `meta-llama/llama-3.2-11b-vision-instruct:free` | Meta | **Free** | ✅ Full Vision | Fast image feature extraction |
| `google/gemini-2.0-flash-exp:free` | Google | **Free** | ✅ Full Vision | High-resolution fashion analysis |
| `qwen/qwen-2-vl-72b-instruct:free` | Qwen | **Free** | ✅ Full Vision | Detailed fabric & jewellery extraction |
| *Custom Model* | Any | Varied | Depending on slug | Any model slug from OpenRouter's catalog |

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
2. Click **Config** in the sidebar.
3. Paste your key in the **OpenRouter API Key** field.
4. Click **"Test Connection"**.
5. You should see a green message: `Connected!`.
6. Click **"Save Settings"**.
