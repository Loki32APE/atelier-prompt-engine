/**
 * ATELIER PROMPT ENGINE — OPENROUTER API INTEGRATION
 * Supports NVIDIA Vision-Language (NeMo / Nemotron) & Free Multimodal Models
 */

const OpenRouterClient = {
  STORAGE_KEY: 'atelier_openrouter_api_key',
  STORAGE_MODEL: 'atelier_openrouter_model',
  
  DEFAULT_MODELS: [
    { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'NVIDIA Nemotron 70B (Instruct)' },
    { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 11B Vision (Free)' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free Vision)' },
    { id: 'qwen/qwen-2-vl-72b-instruct:free', name: 'Qwen 2 VL 72B (Free Vision)' }
  ],

  getApiKey() {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  },

  setApiKey(key) {
    if (!key) {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, key.trim());
    }
  },

  getModel() {
    return localStorage.getItem(this.STORAGE_MODEL) || 'nvidia/llama-3.1-nemotron-70b-instruct';
  },

  setModel(model) {
    localStorage.setItem(this.STORAGE_MODEL, model.trim());
  },

  hasKey() {
    return !!this.getApiKey();
  },

  /**
   * Test user's OpenRouter API key with a minimal request
   */
  async testConnection() {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('Please enter your OpenRouter API key first.');
    }

    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Authentication failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  /**
   * Analyze image with Vision model (Look or Outfit extraction)
   */
  async analyzeImage(base64DataUrl, type = 'look', onStatusUpdate = null) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('OpenRouter API key is required. Please set it in Settings.');
    }

    const model = this.getModel();
    const systemPrompt = type === 'outfit' ? OUTFIT_PROMPT : LOOK_FAST_PROMPT;

    if (onStatusUpdate) onStatusUpdate(`Connecting to OpenRouter (${model})...`);

    const payload = {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert editorial fashion and photography vision analyst. Follow instructions strictly without preamble or conversational filler.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: systemPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: base64DataUrl
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 1200
    };

    if (onStatusUpdate) onStatusUpdate('Analyzing visual features and garment drape...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'http://localhost:8080',
        'X-Title': 'Atelier Prompt Engine'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData.error?.message || `API error (${response.status})`;
      throw new Error(msg);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || '';
    if (onStatusUpdate) onStatusUpdate('Analysis complete!');
    return resultText;
  },

  /**
   * Generate raw master prompt using NVIDIA NeMo model
   */
  async synthesizePrompt(inputs, onStatusUpdate = null) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('OpenRouter API key is required. Please set it in Settings.');
    }

    const model = this.getModel();
    if (onStatusUpdate) onStatusUpdate(`Synthesizing prompt with ${model}...`);

    const userPromptContent = `
INPUTS:
- SUBJECT TEXT: ${inputs.subjectText || 'Not provided'}
- HAIRSTYLE TEXT: ${inputs.hairstyleText || 'Not provided'}
- POSE TEXT: ${inputs.poseText || 'Not provided'}
- LOOK DESCRIPTION: ${inputs.lookDescription || 'Not provided'}
- TARGET LENGTH: ${inputs.targetLength || 1400} characters
- DETAIL LEVEL: ${inputs.detailLevel || 'balanced'}
`;

    const payload = {
      model: model,
      messages: [
        {
          role: 'system',
          content: RAW_SYNTHESIZER_PROMPT
        },
        {
          role: 'user',
          content: userPromptContent
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'http://localhost:8080',
        'X-Title': 'Atelier Prompt Engine'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};
