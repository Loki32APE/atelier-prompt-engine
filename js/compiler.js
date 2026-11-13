/**
 * ATELIER PROMPT ENGINE — PROMPT COMPILER & OPTIMIZER
 * Compiles across Target Syntaxes: NB 2.1 RAW, Master Labeled, Prose, Midjourney v6, Flux.1, JSON
 */

const PromptCompiler = {
  /**
   * Main compilation dispatcher
   */
  compile(state) {
    const syntax = state.targetSyntax || 'nb_raw';

    switch (syntax) {
      case 'nb_raw':
        return this.compileNBRaw(state);
      case 'nb_master':
        return this.compileNBMaster(state);
      case 'prose':
        return this.compileProse(state);
      case 'midjourney':
        return this.compileMidjourney(state);
      case 'flux':
        return this.compileFlux(state);
      case 'json':
        return this.compileJSON(state);
      default:
        return this.compileNBRaw(state);
    }
  },

  /**
   * 1. NANO BANANA 2.1 (RAW MODE)
   * Designed for Reference Transfer + Natural Fabric Physics
   */
  compileNBRaw(state) {
    const lines = [];
    const mode = state.rawMode || 'BOTH';
    const sel = state.labSelections || {};
    const over = state.customOverrides || {};

    const getVal = (key) => over[key] || sel[key] || '';

    // If direct raw injection text exists, prioritize it
    if (state.rawDirectText && state.rawDirectText.trim()) {
      return state.rawDirectText.trim();
    }

    // 1. SUBJECT PHYSIQUE (If BOTH or LOOK_ONLY)
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const subjectDesc = state.subjectText || getVal('distinguishing') || getVal('buildPhysique') || 'natural posture, authentic skin pores';
      lines.push(`SUBJECT PHYSIQUE: Use the person from the reference photo. Keep her facial bone structure, symmetry and facial features exactly as in the reference. ${subjectDesc}.`);
    }

    // 2. HAIRSTYLE
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const hairDesc = state.hairstyleText || [getVal('hairStyle'), getVal('hairLength'), getVal('hairPartition'), getVal('hairColour')].filter(Boolean).join(', ');
      if (hairDesc) {
        lines.push(`HAIRSTYLE: ${hairDesc}. Natural strand contact at the collarbone and shoulders.`);
      }
    }

    // 3. MAKEUP
    const makeupDesc = [getVal('makeupBase'), getVal('makeupEyes'), getVal('makeupLips'), getVal('skinTexture')].filter(Boolean).join(', ');
    if (makeupDesc) {
      lines.push(`MAKEUP: ${makeupDesc}.`);
    }

    // 4. OUTFIT (Reference Transfer Directive + Fabric Physics)
    if (mode === 'BOTH' || mode === 'OUTFIT_ONLY') {
      const outfitParts = [];
      if (state.rawOutfitActive !== false) {
        outfitParts.push(state.rawOutfitLine || RAW_OUTFIT_LINE);
      }
      
      const specificGarments = [getVal('fullDress'), getVal('top'), getVal('bottom')].filter(Boolean).join(' with ');
      if (specificGarments) {
        outfitParts.push(`Key elements: ${specificGarments}.`);
      }

      if (state.rawFabricActive !== false) {
        const fabricText = state.rawFabricText || RAW_FABRIC_BLOCK;
        outfitParts.push(fabricText);
      }

      if (outfitParts.length > 0) {
        lines.push(outfitParts.join(' '));
      }
    }

    // 5. JEWELLERY & ACCESSORIES
    const jewels = [
      getVal('jewelNeck'),
      getVal('jewelEar'),
      getVal('jewelForehead'),
      getVal('jewelHair'),
      getVal('jewelHand'),
      getVal('jewelWaist'),
      getVal('jewelFoot'),
      getVal('accessory1')
    ].filter(Boolean).join(', ');

    if (jewels) {
      lines.push(`JEWELLERY AND ACCESSORIES: ${jewels}.`);
    }

    // 6. POSE AND ACTION
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const poseDesc = state.poseText || [getVal('stance'), getVal('hands')].filter(Boolean).join(', ');
      if (poseDesc) {
        lines.push(`POSE AND ACTION: ${poseDesc}.`);
      }
    }

    // 7. AND GAZE
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const gazeDesc = [getVal('gaze'), getVal('expression')].filter(Boolean).join(', ') || 'Direct calm gaze into lens, poised neutral editorial expression';
      lines.push(`AND GAZE: ${gazeDesc}. Authentic micro-expression, moisture on the lower lid, realistic sclera, and crisp catchlights matching the key light.`);
    }

    // 8. BACKGROUND AND ENVIRONMENT
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const bg = getVal('background') || 'Textured lime-plaster studio wall';
      lines.push(`BACKGROUND AND ENVIRONMENT: ${bg}, with realistic grounded contact shadows.`);
    }

    // 9. LIGHTING AND CAMERA
    if (mode === 'BOTH' || mode === 'LOOK_ONLY') {
      const lighting = getVal('lighting') || 'Soft directional north-window daylight';
      const lens = getVal('lens') || '85mm f/1.4 Prime';
      const device = getVal('device') || 'Medium Format Digital Camera';
      lines.push(`LIGHTING AND CAMERA: ${lighting}. Captured on ${device} with ${lens}, shallow depth of field.`);
    }

    // 10. COMPOSITION
    const shot = getVal('shotType') || 'Medium three-quarter shot';
    lines.push(`COMPOSITION: ${shot}, vertical 9:16 portrait composition.`);

    // 11. QUALITY
    lines.push(`QUALITY: photorealistic editorial photography, visible natural skin pores and fine peach fuzz, authentic subsurface scattering, tactile fabric weave and embroidery relief, natural optical depth, zero plastic smoothing.`);

    // 12. NEGATIVE PROMPT
    const coreNegatives = [...NEGATIVE_PRESETS];
    if (state.activeNegativeAdditions && state.activeNegativeAdditions.length > 0) {
      coreNegatives.push(...state.activeNegativeAdditions);
    }
    lines.push(`NEGATIVE PROMPT: ${coreNegatives.join(', ')}.`);

    let prompt = lines.join('\n\n');

    // Apply Detail Level Budget
    if (state.detailLevel === 'fast') {
      prompt = this.compactWithBudget(prompt, 950);
    } else if (state.detailLevel === 'balanced') {
      prompt = this.compactWithBudget(prompt, 1550);
    }

    return prompt;
  },

  /**
   * 2. NANO BANANA 2.1 (MASTER LABELED)
   */
  compileNBMaster(state) {
    const baseRaw = this.compileNBRaw(state);
    return `// MODEL TARGET: Nano Banana 2.1 (Master Labeled)\n// FORMAT: Vertical 9:16 Editorial Portrait\n\n` + baseRaw;
  },

  /**
   * 3. NATURAL PROSE
   */
  compileProse(state) {
    const sel = state.labSelections || {};
    const over = state.customOverrides || {};
    const getVal = (key) => over[key] || sel[key] || '';

    const shot = getVal('shotType') || 'A medium three-quarter editorial portrait';
    const attire = getVal('fullDress') || getVal('top') || 'an elegant ensemble';
    const bg = getVal('background') || 'a minimalist studio setting';
    const lighting = getVal('lighting') || 'natural soft daylight';
    const expression = getVal('expression') || 'poised and calm expression';

    return `${shot} of an individual wearing ${attire}, set against ${bg}. ${state.rawFabricText || RAW_FABRIC_BLOCK} Illuminated by ${lighting}, capturing a ${expression}. Natural skin pores, authentic textiles, and organic depth of field. Vertical 9:16 framing.`;
  },

  /**
   * 4. MIDJOURNEY v6
   */
  compileMidjourney(state) {
    const sel = state.labSelections || {};
    const over = state.customOverrides || {};
    const getVal = (key) => over[key] || sel[key] || '';

    const tokens = [
      getVal('shotType'),
      getVal('theme'),
      getVal('fullDress') || getVal('top'),
      getVal('fabricMaterial'),
      getVal('lighting'),
      getVal('device'),
      getVal('lens'),
      'hyperrealistic editorial fashion photography',
      'authentic textile drape',
      'uncompressed RAW'
    ].filter(Boolean);

    const neg = (state.activeNegativeAdditions || []).concat(['deformed', 'clinging fabric', 'plastic skin']).join(', ');

    return `${tokens.join(', ')} --ar 9:16 --style raw --v 6.1 --no ${neg}`;
  },

  /**
   * 5. FLUX.1
   */
  compileFlux(state) {
    const sel = state.labSelections || {};
    const over = state.customOverrides || {};
    const getVal = (key) => over[key] || sel[key] || '';

    return `Editorial fashion photography, ${getVal('shotType') || 'medium portrait'}. A poised subject wearing ${getVal('fullDress') || 'tailored garments'} with natural drapery and gravity folds. Setting is ${getVal('background') || 'architectural space'}. Lighting is ${getVal('lighting') || 'diffused daylight'}. High optical clarity, fine skin texture, sharp fabric weave, 35mm lens character.`;
  },

  /**
   * 6. JSON STRUCTURED PAYLOAD
   */
  compileJSON(state) {
    return JSON.stringify({
      target_architecture: 'Nano Banana 2.1',
      mode: state.rawMode || 'BOTH',
      detail_level: state.detailLevel || 'balanced',
      aspect_ratio: '9:16',
      selections: state.labSelections || {},
      overrides: state.customOverrides || {},
      raw_directives: {
        outfit_line: state.rawOutfitActive ? state.rawOutfitLine : null,
        fabric_simulation: state.rawFabricActive ? state.rawFabricText : null,
        anti_shrinkwrap_negatives: state.activeNegativeAdditions || []
      }
    }, null, 2);
  },

  /**
   * Character budget optimizer
   */
  compactWithBudget(text, limit) {
    if (text.length <= limit) return text;
    // Compress multiple spaces and repeated whitespaces
    let cleaned = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
    if (cleaned.length <= limit) return cleaned;
    return cleaned.slice(0, limit - 3) + '...';
  },

  estimateTokens(text) {
    if (!text) return 0;
    return Math.round(text.trim().split(/\s+/).length * 1.33);
  }
};
