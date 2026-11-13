/**
 * ATELIER PROMPT ENGINE — NANO BANANA 2.1 RAW PROMPT ARCHITECTURE
 * System Prompts, Fabric Physics Models & Anti-Shrinkwrap Constraints
 */

const RAW_OUTFIT_LINE = "OUTFIT: take the outfit from reference image.";

const RAW_FABRIC_BLOCK = (
  "Fabric follows a soft, fuller body with natural weight. The cloth rests over the bust and falls down " +
  "with gentle gravity, skimming the waist without pulling tight across the midsection. Over the wide hips " +
  "and thick thighs the fabric flows with heavy, rounded folds, never stretched or clinging. Tension appears " +
  "only where the body curves outward at the bust and hips, where the cloth lightly stretches, and it falls " +
  "loose and soft at the waist and lower body. Shadows sit softly in the undercurves of the bust, along the " +
  "side of the waist, and in the creases beneath the hips. Hems hang heavy with natural gravity, and fabric " +
  "touching the floor or furniture compresses slightly with a soft contact shadow."
);

const FABRIC_PRESETS = {
  'Fuller Body Drape': RAW_FABRIC_BLOCK,
  'Silk Zari Pallu': (
    "Fabric follows realistic handloom silk physics with heavy metallic zari density. The structured pallu falls over the shoulder " +
    "in crisp, cascading pleats, weighted down by pure gold border threads. It skims the torso naturally without suction clinging. " +
    "Deep sculptural shadow valleys form beneath the pleat folds, and the hem settles on the surface with realistic grounded weight."
  ),
  'Tailored Crepe': (
    "Fabric exhibits tailored matte crepe drapery with fluid bias-cut movement. The garment contours cleanly around the shoulders and " +
    "chest, breaking into soft vertical drop lines toward the hem. Zero synthetic tension or artificial shrink-wrap pull across the torso. " +
    "Subtle contact compression at seated resting points."
  ),
  'Minimal Clean': (
    "Fabric hangs naturally under gravity with authentic textile density. Clean unconstrained drape skimming the waist and hips. " +
    "Zero unnatural suction clinging, zero vacuum-molded midsection effect, natural organic drop folds."
  )
};

const RAW_NEGATIVE_ADDITIONS = [
  "tight fabric clinging to the midsection",
  "visible abs",
  "muscle definition",
  "toned athletic body",
  "sharp muscle lines",
  "gym physique",
  "shrink-wrapped look",
  "stretched or pulled fabric"
];

const RAW_SYNTHESIZER_PROMPT = `You are the master prompt writer for Nano Banana 2.1, vertical 9:16 portrait.
Write the RAW master prompt sections from the inputs.
The OUTFIT section and the JEWELLERY AND ACCESSORIES section are added by the system. Do NOT write them.

INPUTS:
- SUBJECT TEXT: user-written body description. May say "Not provided".
- HAIRSTYLE TEXT: user-written hairstyle. May say "Not provided".
- POSE TEXT: user-written pose in screen-left and screen-right terms. May say "Not provided".
- LOOK DESCRIPTION: vision analysis of the look photo, with FRAMING, VISIBLE RANGE, POSE AND ACTION, AND GAZE, LIGHTING AND CAMERA, BACKGROUND AND ENVIRONMENT, MAKEUP.
- TARGET LENGTH and DETAIL LEVEL.

WRITE THESE SECTIONS, IN THIS ORDER, each as LABEL: content:
SUBJECT PHYSIQUE: start with "Use the person from the reference photo. Keep her facial bone structure, symmetry and facial features exactly as in the reference." Then add the body details from SUBJECT TEXT only, in natural wording. Never add facial features. Do not use the word "no".
HAIRSTYLE: use HAIRSTYLE TEXT, and keep its parting, length, volume, ends and placement as written. Add natural strand contact at the shoulders, collarbone or neckline. If HAIRSTYLE TEXT is "Not provided", leave the content empty.
MAKEUP: from LOOK DESCRIPTION only. Never write "none", "no" or "not visible".
POSE AND ACTION: from POSE TEXT if provided, otherwise from LOOK DESCRIPTION. Use screen-left and screen-right. No degrees. Describe only parts inside the visible range.
AND GAZE: from LOOK DESCRIPTION, with eye realism: authentic micro-expression, organic iris texture, moisture on the lower lid, realistic sclera, and crisp catchlights that match the key light.
BACKGROUND AND ENVIRONMENT: from LOOK DESCRIPTION, with contact shadows where the body touches surfaces in frame.
LIGHTING AND CAMERA: from LOOK DESCRIPTION. Keep each light source with its direction, quality, Kelvin value and catchlight, and the camera height, lens look and depth of field.
COMPOSITION: the FRAMING from LOOK DESCRIPTION, followed by "vertical 9:16 portrait composition".
QUALITY: photorealistic editorial photography, visible natural skin pores and fine peach fuzz, authentic subsurface scattering, tactile fabric weave and embroidery relief, natural optical depth, zero plastic smoothing.
NEGATIVE PROMPT: at most 10 comma-separated items: extra fingers, fused fingers, distorted hands, floating fabric, plastic wax skin, text or watermark, distorted body proportions, face different from the reference photo, unnatural hair edges, stiff mannequin posture.

RULES:
- FRAME RULE: remove anything outside the visible range of LOOK DESCRIPTION from SUBJECT PHYSIQUE and POSE AND ACTION. Feet and footwear are never mentioned. HAIRSTYLE is not affected by the frame rule.
- Write each fact once, in its own section.
- Each section is 1 to 3 sentences in natural English. Stay near TARGET LENGTH.
- Never write the words "none", "not provided", "not visible" or "no" in an output line, except inside NEGATIVE PROMPT.
- Do not describe any garment, fabric or accessory.
- Output only the sections, with exact uppercase labels. No markdown, no bullets, no numbering, no quotes, no introduction.`;

const LOOK_FAST_PROMPT = `Analyze this LOOK photo in one pass. Output exactly these labelled lines, in this order. Keep each line short and concrete. No introduction.

FRAMING: one of closeup, bust-up, medium (waist-up), medium-full (mid-thigh), full length. Choose it by how much of the body is visible.
VISIBLE RANGE: the exact body zones inside this photo, top to bottom (for example: head to shoulders, head to waist, head to toe). Feet count as visible only if both feet are fully inside the photo.
POSE AND ACTION: torso direction (facing the camera, or turned toward screen-left or screen-right), head direction and tilt, each arm (elbow bent or extended, what the hand touches), each leg (bent or extended, where the foot is), which leg carries the weight, and contact with furniture or floor. Use screen-left and screen-right. No degrees.
AND GAZE: eye direction relative to the lens, head tilt, expression, lip rest state.
FOOTWEAR: footwear type and colour if the feet are visible, otherwise none.
LIGHTING AND CAMERA: each light source (direction from camera, hard or soft, rough Kelvin, catchlight shape and position), camera height, lens look, depth of field.
BACKGROUND AND ENVIRONMENT: setting, main furniture and props, surfaces, contact points.
MAKEUP: lipstick shade and finish, eyeliner, eyeshadow, blush, skin finish. Mehndi or henna with placement, if visible.
GARMENTS: each visible garment on its own line, starting with [upper body], [lower body] or [full body]. Name, fabric, colour with rough hex, fit, drape.
JEWELLERY AND ACCESSORIES: visible items with material and colour, otherwise none.
AVOID: 4 specific faults that would contradict this look.

STRICT RULES:
- Do NOT describe facial bone structure, face shape, nose, eye shape, lip shape or any identity feature.
- Do NOT describe hairstyle.
- Do NOT use degrees or numbers.`;

const OUTFIT_PROMPT = `Analyze this OUTFIT photo. Output exactly these labelled lines, in this order, with no introduction.

GARMENTS: every visible garment on its own line, starting with [upper body], [lower body] or [full body]. For each give the name, cut, neckline or waistline, sleeve, length, fabric and weight, colour with rough hex, texture, weave, embroidery, sequin, zari or print, fit and drape. A draped pallu, dupatta, cape or train is its own line.
FABRIC PHYSICS: where the fabric is fitted, where it is relaxed, and where folds, pleats and hems fall.
FOOTWEAR: footwear type, colour and heel height if visible, otherwise the word none.
JEWELLERY AND ACCESSORIES: visible jewellery and accessories with material and colour, or the word none.
LIPSTICK: shade and finish if the lips are visible, otherwise the word none.
MEHNDI: placement and pattern if mehndi, henna or skin art is visible on hands, wrists, arms or feet, otherwise the word none.
AVOID: 4 specific faults that would ruin this outfit.

STRICT RULES:
- Ignore the wearer's face, hairstyle, skin tone and background.
- Do NOT describe pose, gaze, lighting or camera.`;

const OPTIMIZER_RULES = {
  fast: { target: 800, max: 1000 },
  balanced: { target: 1400, max: 1600 },
  detailed: { target: 2000, max: 2400 }
};
