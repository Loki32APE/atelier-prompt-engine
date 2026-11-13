# Atelier Prompt Engine — System Architecture

**Atelier Prompt Engine** is a high-precision prompt engineering workstation designed for fashion editorial photography, structured aesthetic synthesis, and reference-led image generation using **Nano Banana 2.1**, **Midjourney v6**, **Flux.1**, and traditional multimodal vision models.

---

## 1. Directory & Module Structure

The project follows a clean, decoupled modular frontend architecture with zero build steps or heavyweight dependencies:

```text
atelier-prompt-engine/
├── index.html                   # Semantic markup, SVG sprite definitions & app shell
│
├── css/
│   ├── base.css                 # Obsidian darkroom theme, tokens, responsive layout & rail
│   ├── studio.css               # Vision Studio dropzones & Nano Banana 2.1 Raw Architecture
│   ├── lab.css                  # 8-Module Visual Lab accordions, slot grids & override styles
│   └── compiler.css             # Live Prompt Compiler drawer, syntax switcher & live counters
│
├── js/
│   ├── schema.js                # Authentic 8-module editorial taxonomy (LAB_SCHEMA)
│   ├── raw_prompts.js           # Nano Banana 2.1 system prompts, fabric physics & constraints
│   ├── openrouter.js            # OpenRouter API client (NVIDIA NeMo / Nemotron VL & free models)
│   ├── compiler.js              # Multi-target prompt compiler & character budget optimizer
│   └── app.js                   # Application controller, state management, dropzones & events
│
├── docs/
│   ├── ARCHITECTURE.md          # System architecture & prompt pipeline design (this file)
│   ├── OPENROUTER_SETUP.md      # OpenRouter API key & free NVIDIA model guide
│   ├── RENDER_DEPLOYMENT.md     # Step-by-step beginner guide to Render deployment
│   └── PROMPT_SYNTAX_GUIDE.md   # Nano Banana 2.1 & Visual Lab prompting reference
│
├── README.md                    # Repository introduction & quick start guide
└── .gitignore                   # Git hygiene configuration
```

---

## 2. The Prompt Pipeline

```
[Look Reference Image]   ──> [OpenRouter Vision Model (NVIDIA/Llama/Gemini)]
                                        │
                                        ▼ (Extracted Framing, Lighting, Pose, Gaze)
[Outfit Reference Image] ──> [OpenRouter Vision Model]
                                        │
                                        ▼ (Extracted Weave, Silhouette, Jewellery)
                                        │
[8-Module Visual Lab]    ───────────────┼──> [PromptCompiler (compiler.js)]
(Camera, Theme, Style,                  │           │
 Location, Attire, Appearance,           │           ▼
 Action, Character)                      │    Target Syntaxes:
                                        │    • NB 2.1 (RAW Mode)
[Raw Architecture Blocks] ──────────────┘    • NB 2.1 (Master Labeled)
(Outfit Line, Fabric Physics,                • Natural Prose
 Anti-Shrinkwrap Negatives)                  • Midjourney v6.1
                                             • Flux.1 Contextual
                                             • Structured JSON Payload
```

---

## 3. Core Subsystems

### A. Vision Studio
- **Dropzones**: Supports drag-and-drop or file upload for Look Reference (camera/pose) and Outfit Reference (garments/drape).
- **Client-Side Processing**: Images are converted to base64 Data URLs locally without hitting any third-party storage.
- **AI Extraction**: If an OpenRouter key is configured, vision models (such as NVIDIA NeMo VL or Llama 3.2 Vision) automatically extract visual features matching the prompt schema.

### B. Nano Banana 2.1 Raw Architecture
- **Reference Transfer Directive**: `OUTFIT: take the outfit from reference image.`
- **Natural Fabric Physics**: Enforces realistic gravity drapery, preventing vacuum suction, synthetic stretch, or shrink-wrapping over curves.
- **Anti-Shrinkwrap Negative Chips**: Granular negative tokens countering AI artifacts (e.g., `tight fabric clinging to midsection`, `visible abs`, `shrink-wrapped look`).

### C. 8-Module Visual Lab
- Modular taxonomy with custom overrides on every dropdown.
- Automated conflict detection between full-body attire (e.g. Sarees/Anarkalis) and separate pieces (tops/bottoms).
- Expand/Collapse All and Instant Filter Resets.

### D. Live Prompt Compiler
- Instant, non-blocking real-time compilation as parameters change.
- Live character counter, token estimator, and character budget optimizer.
