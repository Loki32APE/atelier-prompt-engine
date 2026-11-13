# Prompt Syntax & Architectural Guide

This guide details the prompt formats, reference extraction rules, and fabric physics principles implemented in **Atelier Prompt Engine**.

---

## 1. Nano Banana 2.1 Architecture

Nano Banana 2.1 expects vertical `9:16` editorial fashion compositions structured around uppercase labelled blocks.

### The 3 Golden Rules
* **Rule 1 — Framing & Visible Range**:
  Framing (e.g. `closeup`, `bust-up`, `medium (waist-up)`, `medium-full`, `full length`) determines which zones of the subject are described. Out-of-frame body parts, garments, or footwear are strictly removed. Feet and footwear are mentioned **only** if both feet are fully within frame.
* **Rule 2 — Hairstyle Exception**:
  Hairstyle description is **exempt** from Rule 1. It is never cropped or truncated, preserving parting, length, volume, and natural strand contact along collarbones and shoulders.
* **Rule 3 — One Version of Each Thing**:
  Facts are stated once and never duplicated across sections. Pose, lighting, background, and jewellery each appear strictly in their dedicated block.

---

## 2. RAW Mode vs. Master Labeled Mode

### A. Nano Banana 2.1 (RAW Mode)
Engineered for reference image transfer where direct garment description is replaced by:
```text
OUTFIT: take the outfit from reference image.
```
Followed immediately by natural fabric physics simulation:
```text
Fabric follows a soft, fuller body with natural weight. The cloth rests over the bust and falls down with gentle gravity, skimming the waist without pulling tight across the midsection. Over the wide hips and thick thighs the fabric flows with heavy, rounded folds, never stretched or clinging...
```

### B. Master Labeled Mode (12 Sections)
1. `SUBJECT PHYSIQUE:` Face retention directive + anatomical details.
2. `HAIRSTYLE:` Texture, partition, styling, and strand contact.
3. `MAKEUP:` Base finish, eyes, lip shade, and skin texture.
4. `OUTFIT:` Garment breakdown, cut, weave, zari, and drape.
5. `JEWELLERY AND ACCESSORIES:` Ear, neck, forehead, hands, waist.
6. `POSE AND ACTION:` Direction in screen-left and screen-right.
7. `AND GAZE:` Micro-expression, moisture, catchlights.
8. `BACKGROUND AND ENVIRONMENT:` Architectural set and contact points.
9. `LIGHTING AND CAMERA:` Light sources, Kelvin values, camera & lens.
10. `COMPOSITION:` Visible range + vertical 9:16 portrait framing.
11. `QUALITY:` Tactile relief, subsurface scattering, zero plastic smoothing.
12. `NEGATIVE PROMPT:` Core negative tokens + anti-shrinkwrap constraints.

---

## 3. Natural Fabric Physics & Anti-Shrinkwrap Engine

Modern generative AI often suffers from **synthetic suction / vacuum cling**, making loose fabrics like sarees or kurtas appear unnaturally glued to the midsection. Atelier solves this using:

### Presets
* **Fuller Body Drape**: Soft gravity drop, loose skimming across the waist, rounded folds over hips.
* **Silk Zari Pallu**: Handloom metallic thread weight, crisp cascading shoulder pleats, structured fall.
* **Tailored Crepe**: Bias-cut fluid movement, clean contouring, zero synthetic tension.
* **Minimal Clean**: Lightweight unconstrained organic hang.

### Anti-Shrinkwrap Negative Chips
* `tight fabric clinging to the midsection`
* `visible abs`
* `muscle definition`
* `toned athletic body`
* `sharp muscle lines`
* `gym physique`
* `shrink-wrapped look`
* `stretched or pulled fabric`

---

## 4. Multi-Target Compiler Output Comparison

| Target Model | Output Character | Use Case |
| :--- | :--- | :--- |
| **NB 2.1 (RAW Mode)** | Uppercase labeled blocks + Reference transfer | Direct execution in Nano Banana 2.1 |
| **NB 2.1 (Master Labeled)** | Complete 12-section editorial specification | Archival master prompt |
| **Natural Prose** | Fluent, atmospheric high-fashion sentences | Models without section-parsing |
| **Midjourney v6.1** | Comma-delimited style tokens + `--ar 9:16 --v 6.1` | Midjourney Discord / Web Alpha |
| **Flux.1** | Contextual photorealism tags + lens character | Flux Dev / Schnell |
| **JSON Payload** | Key-value mapping of all slots and overrides | API and batch processing pipelines |
