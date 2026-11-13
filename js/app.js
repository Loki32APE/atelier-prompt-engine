/**
 * ATELIER PROMPT ENGINE — APPLICATION CONTROLLER
 * Coordinates UI Events, Visual Lab Accordions, Vision Dropzones, and OpenRouter Calls
 */

const appState = {
  activeWorkspace: 'studio',
  theme: localStorage.getItem('atelier_theme') || 'dark',
  targetSyntax: 'nb_raw',
  rawMode: 'BOTH',
  detailLevel: 'balanced',
  rawOutfitActive: true,
  rawOutfitLine: RAW_OUTFIT_LINE,
  rawFabricActive: true,
  rawFabricText: RAW_FABRIC_BLOCK,
  activeFabricPreset: 'Fuller Body Drape',
  activeNegativeAdditions: [...RAW_NEGATIVE_ADDITIONS],
  rawDirectText: '',
  subjectText: '',
  hairstyleText: '',
  poseText: '',
  lookDescription: '',
  outfitDescription: '',
  labSelections: {},
  customOverrides: {},
  lookImageBase64: null,
  outfitImageBase64: null
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLab();
  initRawControls();
  initDropzones();
  initOpenRouterUI();
  updateOpenRouterStatusBadge();
  compileAndRender();
});

/* ==========================================================================
   THEME & WORKSPACE SWITCHING
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
}

function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', appState.theme);
  localStorage.setItem('atelier_theme', appState.theme);
  showToast(`Switched to ${appState.theme} mode`);
}

function switchWorkspace(panelId, btnElement) {
  appState.activeWorkspace = panelId;

  // Update Rail
  document.querySelectorAll('.rail-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  // Update Panels
  document.querySelectorAll('.workspace-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`panel-${panelId}`);
  if (target) target.classList.add('active');

  // Update Breadcrumb
  const crumbTitle = document.getElementById('wsCrumbTitle');
  const crumbSub = document.getElementById('wsCrumbSub');
  if (panelId === 'studio') {
    if (crumbTitle) crumbTitle.textContent = 'VISION STUDIO';
    if (crumbSub) crumbSub.textContent = 'Reference-led extraction, saved directive profiles & raw prompt architecture';
  } else if (panelId === 'lab') {
    if (crumbTitle) crumbTitle.textContent = 'VISUAL LAB';
    if (crumbSub) crumbSub.textContent = 'Eight-module structured prompt architecture';
  } else if (panelId === 'library') {
    if (crumbTitle) crumbTitle.textContent = 'PROMPT LIBRARY';
    if (crumbSub) crumbSub.textContent = 'Curated editorial presets and archived prompt outputs';
  }
}

/* ==========================================================================
   VISUAL LAB INITIALIZATION & INTERACTION
   ========================================================================== */
function initLab() {
  const container = document.getElementById('labAccordionContainer');
  if (!container) return;

  container.innerHTML = LAB_SCHEMA.map((mod, idx) => {
    return `
      <div class="lab-module-card ${mod.open ? 'expanded' : ''}" id="${mod.id}">
        <div class="lab-module-header" onclick="toggleLabModule('${mod.id}')">
          <div class="lab-module-title-area">
            <div class="module-icon-box">
              <svg><use href="#${mod.icon}" /></svg>
            </div>
            <div class="module-headings">
              <h3>${mod.title}</h3>
              <p>${getModuleSub(mod.id)}</p>
            </div>
          </div>
          <div class="lab-module-meta">
            <span class="module-count-badge" id="badge-${mod.id}">0 selected</span>
            <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        <div class="lab-module-body">
          ${renderModuleFields(mod)}
        </div>
      </div>
    `;
  }).join('');
}

function getModuleSub(id) {
  const map = {
    mod_camera: 'Shot Type, Device, Lens, Lighting',
    mod_theme: 'Aesthetic mood & editorial theme',
    mod_artstyle: 'Realism, analog film & render aesthetics',
    mod_location: 'Set design, architecture & backdrop',
    mod_attire: '14 Granular garment & jewellery slots',
    mod_appearance: 'Hair styling & makeup breakdown',
    mod_action: 'Stance, hands, gaze direction & mood',
    mod_character: 'Age, build, ethnicity & distinguishing marks'
  };
  return map[id] || 'Editorial parameter module';
}

function renderModuleFields(mod) {
  if (mod.subGroups) {
    return mod.subGroups.map(sub => `
      <div style="margin-bottom:16px;">
        <h4 style="font-size:0.8rem; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px;">${sub.title}</h4>
        <div class="slot-grid">
          ${sub.fields.map(f => renderSlotField(f)).join('')}
        </div>
      </div>
    `).join('');
  }

  return `
    <div class="slot-grid">
      ${mod.fields.map(f => renderSlotField(f)).join('')}
    </div>
  `;
}

function renderSlotField(field) {
  const optionsHtml = ['<option value="">— Select —</option>']
    .concat(field.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`))
    .concat(['<option value="__custom__">Custom Override...</option>'])
    .join('');

  return `
    <div class="slot-item">
      <label class="slot-label" for="slot_${field.key}">
        <span>${field.label}</span>
      </label>
      <select class="slot-select" id="slot_${field.key}" onchange="handleSlotChange('${field.key}', this)">
        ${optionsHtml}
      </select>
      <div class="override-wrap" id="wrap_override_${field.key}">
        <input type="text" class="override-input" id="override_${field.key}" placeholder="Enter bespoke specification..." oninput="handleOverrideInput('${field.key}', this.value)" />
      </div>
    </div>
  `;
}

function toggleLabModule(modId) {
  const card = document.getElementById(modId);
  if (card) {
    card.classList.toggle('expanded');
  }
}

function expandAllLab() {
  document.querySelectorAll('.lab-module-card').forEach(c => c.classList.add('expanded'));
}

function collapseAllLab() {
  document.querySelectorAll('.lab-module-card').forEach(c => c.classList.remove('expanded'));
}

function resetAllLab() {
  appState.labSelections = {};
  appState.customOverrides = {};
  document.querySelectorAll('.slot-select').forEach(s => {
    s.value = '';
    s.classList.remove('has-value');
  });
  document.querySelectorAll('.override-wrap').forEach(w => w.classList.remove('active'));
  document.querySelectorAll('.override-input').forEach(i => i.value = '');
  updateLabBadges();
  compileAndRender();
  showToast('Visual Lab reset to default.');
}

function handleSlotChange(key, selectElem) {
  const val = selectElem.value;
  const wrap = document.getElementById(`wrap_override_${key}`);

  if (val === '__custom__') {
    if (wrap) wrap.classList.add('active');
    appState.labSelections[key] = '';
    selectElem.classList.add('has-value');
  } else if (val) {
    if (wrap) wrap.classList.remove('active');
    delete appState.customOverrides[key];
    appState.labSelections[key] = val;
    selectElem.classList.add('has-value');
  } else {
    if (wrap) wrap.classList.remove('active');
    delete appState.labSelections[key];
    delete appState.customOverrides[key];
    selectElem.classList.remove('has-value');
  }

  updateLabBadges();
  checkWardrobeConflicts();
  compileAndRender();
}

function handleOverrideInput(key, text) {
  if (text.trim()) {
    appState.customOverrides[key] = text.trim();
  } else {
    delete appState.customOverrides[key];
  }
  updateLabBadges();
  compileAndRender();
}

function updateLabBadges() {
  LAB_SCHEMA.forEach(mod => {
    let count = 0;
    const keys = [];
    if (mod.subGroups) {
      mod.subGroups.forEach(sg => sg.fields.forEach(f => keys.push(f.key)));
    } else {
      mod.fields.forEach(f => keys.push(f.key));
    }

    keys.forEach(k => {
      if (appState.customOverrides[k] || appState.labSelections[k]) {
        count++;
      }
    });

    const badge = document.getElementById(`badge-${mod.id}`);
    if (badge) {
      badge.textContent = `${count} selected`;
      if (count > 0) {
        badge.classList.add('has-selections');
      } else {
        badge.classList.remove('has-selections');
      }
    }
  });

  const total = Object.keys(appState.labSelections).length + Object.keys(appState.customOverrides).length;
  const totalElem = document.getElementById('labTotalSelectedCount');
  if (totalElem) totalElem.textContent = total;
}

function checkWardrobeConflicts() {
  const fullDress = appState.labSelections['fullDress'] || appState.customOverrides['fullDress'];
  const top = appState.labSelections['top'] || appState.customOverrides['top'];
  const bottom = appState.labSelections['bottom'] || appState.customOverrides['bottom'];

  const banner = document.getElementById('wardrobeConflictBanner');
  if (!banner) return;

  if (fullDress && (top || bottom)) {
    banner.classList.add('visible');
    const desc = document.getElementById('conflictDesc');
    if (desc) desc.textContent = `Full Dress (${fullDress}) conflicts with separate pieces (${[top, bottom].filter(Boolean).join(', ')}).`;
  } else {
    banner.classList.remove('visible');
  }
}

function autoResolveConflict() {
  const topSelect = document.getElementById('slot_top');
  const bottomSelect = document.getElementById('slot_bottom');
  if (topSelect) {
    topSelect.value = '';
    topSelect.classList.remove('has-value');
  }
  if (bottomSelect) {
    bottomSelect.value = '';
    bottomSelect.classList.remove('has-value');
  }
  delete appState.labSelections['top'];
  delete appState.labSelections['bottom'];
  delete appState.customOverrides['top'];
  delete appState.customOverrides['bottom'];

  checkWardrobeConflicts();
  updateLabBadges();
  compileAndRender();
  showToast('Conflict resolved: Separate pieces cleared in favor of Full Dress.');
}

/* ==========================================================================
   RAW ARCHITECTURE & DIRECTIVES (NANO BANANA 2.1)
   ========================================================================== */
function initRawControls() {
  // Render Negative Additions Chips
  const chipsContainer = document.getElementById('negativeChipsContainer');
  if (chipsContainer) {
    chipsContainer.innerHTML = RAW_NEGATIVE_ADDITIONS.map(item => `
      <div class="chip ${appState.activeNegativeAdditions.includes(item) ? 'active' : ''}" onclick="toggleNegativeChip('${escapeHtml(item)}', this)">
        ${escapeHtml(item)}
      </div>
    `).join('');
  }

  // Render Fabric Physics Presets
  const presetsContainer = document.getElementById('fabricPresetPills');
  if (presetsContainer) {
    presetsContainer.innerHTML = Object.keys(FABRIC_PRESETS).map(name => `
      <button type="button" class="pill-btn ${appState.activeFabricPreset === name ? 'active' : ''}" onclick="selectFabricPreset('${name}', this)">
        ${name}
      </button>
    `).join('');
  }
}

function setRawMode(mode, btn) {
  appState.rawMode = mode;
  document.querySelectorAll('#rawModeControls .seg-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  compileAndRender();
}

function setDetailLevel(level, btn) {
  appState.detailLevel = level;
  document.querySelectorAll('#detailLevelControls .seg-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  compileAndRender();
}

function toggleRawOutfitLine(checkbox) {
  appState.rawOutfitActive = checkbox.checked;
  const badge = document.getElementById('badgeOutfitActive');
  if (badge) badge.style.display = checkbox.checked ? 'inline-block' : 'none';
  compileAndRender();
}

function toggleRawFabricBlock(checkbox) {
  appState.rawFabricActive = checkbox.checked;
  const wrap = document.getElementById('fabricControlsWrap');
  if (wrap) wrap.style.opacity = checkbox.checked ? '1' : '0.4';
  compileAndRender();
}

function selectFabricPreset(presetName, btn) {
  appState.activeFabricPreset = presetName;
  appState.rawFabricText = FABRIC_PRESETS[presetName] || '';
  const textarea = document.getElementById('rawFabricTextarea');
  if (textarea) textarea.value = appState.rawFabricText;

  document.querySelectorAll('#fabricPresetPills .pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  compileAndRender();
}

function handleFabricTextChange(text) {
  appState.rawFabricText = text;
  compileAndRender();
}

function toggleNegativeChip(item, chipElem) {
  const idx = appState.activeNegativeAdditions.indexOf(item);
  if (idx > -1) {
    appState.activeNegativeAdditions.splice(idx, 1);
    chipElem.classList.remove('active');
  } else {
    appState.activeNegativeAdditions.push(item);
    chipElem.classList.add('active');
  }
  compileAndRender();
}

function toggleAllNegativeChips() {
  if (appState.activeNegativeAdditions.length === RAW_NEGATIVE_ADDITIONS.length) {
    appState.activeNegativeAdditions = [];
    document.querySelectorAll('#negativeChipsContainer .chip').forEach(c => c.classList.remove('active'));
  } else {
    appState.activeNegativeAdditions = [...RAW_NEGATIVE_ADDITIONS];
    document.querySelectorAll('#negativeChipsContainer .chip').forEach(c => c.classList.add('active'));
  }
  compileAndRender();
}

function handleDirectRawInput(text) {
  appState.rawDirectText = text;
  compileAndRender();
}

/* ==========================================================================
   DROPZONES & IMAGE EXTRACTION
   ========================================================================== */
function initDropzones() {
  setupDropzone('dropzoneLook', 'fileInputLook', 'imgPreviewLook', 'look');
  setupDropzone('dropzoneOutfit', 'fileInputOutfit', 'imgPreviewOutfit', 'outfit');
}

function setupDropzone(dropId, fileId, previewId, type) {
  const dropzone = document.getElementById(dropId);
  const fileInput = document.getElementById(fileId);
  const imgPreview = document.getElementById(previewId);

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('.dropzone-overlay-clear')) return;
    fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], dropzone, imgPreview, type);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleImageFile(fileInput.files[0], dropzone, imgPreview, type);
    }
  });
}

function handleImageFile(file, dropzone, imgPreview, type) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file (PNG, JPG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    if (type === 'look') {
      appState.lookImageBase64 = base64;
    } else {
      appState.outfitImageBase64 = base64;
    }

    if (imgPreview) imgPreview.src = base64;
    dropzone.classList.add('has-image');
    showToast(`${type.toUpperCase()} image loaded.`);

    // If OpenRouter key is configured, prompt quick extraction
    if (OpenRouterClient.hasKey()) {
      showToast(`Click "Analyze with ${OpenRouterClient.getModel()}" to auto-extract.`);
    }
  };
  reader.readAsDataURL(file);
}

function clearDropzone(type, event) {
  if (event) event.stopPropagation();

  if (type === 'look') {
    appState.lookImageBase64 = null;
    const dropzone = document.getElementById('dropzoneLook');
    const preview = document.getElementById('imgPreviewLook');
    if (dropzone) dropzone.classList.remove('has-image');
    if (preview) preview.src = '';
  } else {
    appState.outfitImageBase64 = null;
    const dropzone = document.getElementById('dropzoneOutfit');
    const preview = document.getElementById('imgPreviewOutfit');
    if (dropzone) dropzone.classList.remove('has-image');
    if (preview) preview.src = '';
  }
  showToast(`${type.toUpperCase()} image cleared.`);
}

/* ==========================================================================
   OPENROUTER MODAL & API WORKFLOW
   ========================================================================== */
function initOpenRouterUI() {
  const keyInput = document.getElementById('openrouterApiKeyInput');
  const modelSelect = document.getElementById('openrouterModelSelect');

  if (keyInput) keyInput.value = OpenRouterClient.getApiKey();
  if (modelSelect) modelSelect.value = OpenRouterClient.getModel();
}

function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.add('open');
    initOpenRouterUI();
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('open');
}

function saveOpenRouterSettings() {
  const keyInput = document.getElementById('openrouterApiKeyInput');
  const modelSelect = document.getElementById('openrouterModelSelect');
  const customModel = document.getElementById('openrouterCustomModelInput');

  if (keyInput) {
    OpenRouterClient.setApiKey(keyInput.value);
  }

  let chosenModel = modelSelect ? modelSelect.value : '';
  if (customModel && customModel.value.trim()) {
    chosenModel = customModel.value.trim();
  }
  OpenRouterClient.setModel(chosenModel);

  updateOpenRouterStatusBadge();
  closeSettingsModal();
  showToast('OpenRouter settings saved successfully.');
}

async function testOpenRouterKey() {
  const keyInput = document.getElementById('openrouterApiKeyInput');
  if (keyInput && keyInput.value.trim()) {
    OpenRouterClient.setApiKey(keyInput.value.trim());
  }

  const statusElem = document.getElementById('openrouterKeyTestStatus');
  if (statusElem) statusElem.textContent = 'Testing connection...';

  try {
    const res = await OpenRouterClient.testConnection();
    if (statusElem) {
      statusElem.style.color = 'var(--status-valid)';
      statusElem.textContent = `Connected! (Limit: $${res.data?.limit || 'Free tier'})`;
    }
    showToast('OpenRouter API connected successfully!');
    updateOpenRouterStatusBadge();
  } catch (err) {
    if (statusElem) {
      statusElem.style.color = 'var(--status-error)';
      statusElem.textContent = err.message;
    }
    showToast(`Error: ${err.message}`);
  }
}

function updateOpenRouterStatusBadge() {
  const badge = document.getElementById('openrouterStatusBadge');
  const modelName = document.getElementById('activeModelName');
  if (!badge) return;

  if (OpenRouterClient.hasKey()) {
    badge.innerHTML = `<span class="dot" style="background-color:var(--status-valid)"></span> ${OpenRouterClient.getModel().split('/').pop()}`;
    if (modelName) modelName.textContent = OpenRouterClient.getModel();
  } else {
    badge.innerHTML = `<span class="dot" style="background-color:var(--status-warn)"></span> Key Required`;
    if (modelName) modelName.textContent = 'NVIDIA NeMo / Nemotron VL';
  }
}

async function runVisionExtraction(type) {
  const imageBase64 = type === 'look' ? appState.lookImageBase64 : appState.outfitImageBase64;
  if (!imageBase64) {
    showToast(`Please upload a ${type.toUpperCase()} image first.`);
    return;
  }

  if (!OpenRouterClient.hasKey()) {
    openSettingsModal();
    showToast('Please enter your OpenRouter API key to run vision analysis.');
    return;
  }

  const btn = document.getElementById(`btnExtract_${type}`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
  }

  try {
    showToast(`Calling OpenRouter with ${OpenRouterClient.getModel()}...`);
    const analysis = await OpenRouterClient.analyzeImage(imageBase64, type, (status) => {
      showToast(status);
    });

    if (type === 'look') {
      appState.lookDescription = analysis;
      const descElem = document.getElementById('lookAnalysisOutput');
      if (descElem) descElem.value = analysis;
    } else {
      appState.outfitDescription = analysis;
      const descElem = document.getElementById('outfitAnalysisOutput');
      if (descElem) descElem.value = analysis;
    }

    showToast(`${type.toUpperCase()} extracted successfully!`);
    compileAndRender();
  } catch (err) {
    showToast(`Analysis failed: ${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = `Extract with Vision`;
    }
  }
}

/* ==========================================================================
   COMPILATION & LIVE OUTPUT CONTROLLER
   ========================================================================== */
function setTargetSyntax(syntax, chipElem) {
  appState.targetSyntax = syntax;
  document.querySelectorAll('.syntax-chip').forEach(c => c.classList.remove('active'));
  if (chipElem) chipElem.classList.add('active');
  compileAndRender();
}

function compileAndRender() {
  const prompt = PromptCompiler.compile(appState);
  const outputElem = document.getElementById('masterPromptOutput');
  if (outputElem) {
    outputElem.value = prompt;
  }

  // Update Metrics
  const charCount = prompt.length;
  const tokenCount = PromptCompiler.estimateTokens(prompt);

  const charElem = document.getElementById('metricCharCount');
  const tokenElem = document.getElementById('metricTokenCount');
  if (charElem) charElem.textContent = charCount;
  if (tokenElem) tokenElem.textContent = tokenCount;
}

function copyMasterPrompt() {
  const outputElem = document.getElementById('masterPromptOutput');
  if (!outputElem || !outputElem.value) return;

  navigator.clipboard.writeText(outputElem.value).then(() => {
    showToast('Prompt copied to clipboard!');
  }).catch(() => {
    outputElem.select();
    document.execCommand('copy');
    showToast('Prompt copied!');
  });
}

function downloadPromptTxt() {
  const outputElem = document.getElementById('masterPromptOutput');
  if (!outputElem || !outputElem.value) return;

  const blob = new Blob([outputElem.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atelier_prompt_${appState.targetSyntax}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Prompt file downloaded.');
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function loadLibraryPreset(presetKey) {
  const presets = {
    rajputana: {
      shotType: 'Full body',
      device: 'Medium Format Digital Camera',
      lens: '85mm f/1.4 Prime',
      lighting: 'High-contrast editorial chiaroscuro',
      theme: 'Royal Heritage Bridal Couture',
      artStyle: 'Photorealistic high-end editorial',
      background: 'Sandstone heritage palace courtyard',
      fullDress: 'Handloom emerald Banarasi silk saree',
      jewelNeck: 'Heritage temple gold choker',
      jewelEar: 'Sculpted gold chandbali earrings',
      jewelForehead: 'Antique polki maang tikka',
      makeupBase: 'Luminous satin skin finish',
      makeupEyes: 'Soft smoked kohl kajal liner',
      hairStyle: 'Low sculptural chignon bun'
    },
    kanjeevaram: {
      shotType: 'Medium three-quarter shot',
      device: 'Full-Frame Mirrorless',
      lens: '50mm f/1.8 Standard',
      lighting: 'Warm golden hour sunset glow',
      theme: 'Vibrant Wedding Mehendi',
      artStyle: 'Crisp commercial studio photography',
      background: 'Boho-chic garden setup with cushions and marigolds',
      fullDress: 'Handloom emerald Banarasi silk saree',
      jewelNeck: 'Heritage temple gold choker',
      jewelHair: 'Fresh white jasmine gajra',
      jewelHand: 'Stacked matte gold bangles and hathphool',
      makeupLips: 'Deep crimson velvet stain',
      hairStyle: 'Long braided plait with parandi'
    },
    milanese: {
      shotType: 'Close-up editorial portrait',
      device: '35mm Analog Film Camera',
      lens: '85mm f/1.4 Prime',
      lighting: 'Soft directional north-window daylight',
      theme: 'Minimalist Editorial Lookbook',
      artStyle: 'Analog Kodak Portra 400 film aesthetic',
      background: 'Minimalist raw concrete gallery',
      top: 'Double-breasted wool blazer',
      bottom: 'Wide-leg tailored wool trousers',
      jewelEar: 'Minimalist brushed gold hoops',
      makeupBase: 'Natural matte velvet complexion',
      hairStyle: 'Sleek wet-look editorial sweep'
    }
  };

  const p = presets[presetKey];
  if (!p) return;

  appState.labSelections = { ...p };
  appState.customOverrides = {};

  // Update UI dropdowns
  Object.keys(p).forEach(key => {
    const sel = document.getElementById(`slot_${key}`);
    if (sel) {
      sel.value = p[key];
      sel.classList.add('has-value');
    }
  });

  updateLabBadges();
  checkWardrobeConflicts();
  compileAndRender();
  switchWorkspace('lab', document.querySelector('.rail-btn[onclick*="lab"]'));
  showToast(`Loaded preset into Visual Lab.`);
}

function showToast(msg) {
  let shelf = document.getElementById('toastShelf');
  if (!shelf) {
    shelf = document.createElement('div');
    shelf.id = 'toastShelf';
    shelf.className = 'toast-shelf';
    document.body.appendChild(shelf);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="15" height="15" style="color:var(--accent); flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>${escapeHtml(msg)}</span>
  `;

  shelf.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
