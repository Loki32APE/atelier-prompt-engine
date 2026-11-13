/**
 * ATELIER PROMPT ENGINE — 8-MODULE VISUAL LAB SCHEMA
 * Authentic Granular Editorial Taxonomy
 */

const LAB_SCHEMA = [
  {
    id: 'mod_camera',
    title: '1. Camera Settings',
    icon: 'ico-mod-camera',
    open: true,
    fields: [
      { key: 'shotType', label: 'Shot Type (Mandatory)', options: ['Full body', 'Medium three-quarter shot', 'Close-up editorial portrait', 'Cowboy shot', 'Wide architectural framing'] },
      { key: 'device', label: 'Device', options: ['Medium Format Digital Camera', 'Full-Frame Mirrorless', '35mm Analog Film Camera', 'Flagship Smartphone ProRAW'] },
      { key: 'lens', label: 'Lens', options: ['85mm f/1.4 Prime', '50mm f/1.8 Standard', '35mm f/2.0 Documentary', 'Ultra-Wide (13mm eq., dynamic perspective)', '135mm Telephoto Compression'] },
      { key: 'lighting', label: 'Lighting', options: ['Warm golden hour sunset glow', 'Soft directional north-window daylight', 'Diffused studio octabox key light', 'High-contrast editorial chiaroscuro', 'Overcast natural ambient light'] }
    ]
  },
  {
    id: 'mod_theme',
    title: '2. Theme / Genre',
    icon: 'ico-mod-theme',
    open: false,
    fields: [
      { key: 'theme', label: 'Theme', options: ['Minimalist Editorial Lookbook', 'Vibrant Wedding Mehendi', 'Royal Heritage Bridal Couture', 'Contemporary Architectural Streetwear', 'Quiet Luxury Studio Campaign'] }
    ]
  },
  {
    id: 'mod_artstyle',
    title: '3. Art Style',
    icon: 'ico-mod-artstyle',
    open: false,
    fields: [
      { key: 'artStyle', label: 'Art Style', options: ['Photorealistic high-end editorial', 'Analog Kodak Portra 400 film aesthetic', 'Crisp commercial studio photography', 'Raw documentary fashion realism', 'Fine-art monochrome silver gelatin'] }
    ]
  },
  {
    id: 'mod_location',
    title: '4. Background / Location',
    icon: 'ico-mod-location',
    open: false,
    fields: [
      { key: 'background', label: 'Background', options: ['Textured warm lime-plaster studio wall', 'Boho-chic garden setup with cushions and marigolds', 'Sandstone heritage palace courtyard', 'Minimalist raw concrete gallery', 'Seamless dark charcoal studio backdrop'] }
    ]
  },
  {
    id: 'mod_attire',
    title: '5. Attire & Jewellery',
    icon: 'ico-mod-attire',
    open: false,
    fields: [
      { key: 'top', label: 'Top', options: ['Double-breasted wool blazer', 'Raw silk embroidered blouse', 'Crisp oversized poplin shirt', 'Ribbed merino turtleneck'] },
      { key: 'bottom', label: 'Bottom', options: ['Wide-leg tailored wool trousers', 'Flared silk lehenga skirt', 'Pleated linen palazzo pants', 'Structured column midi skirt'] },
      { key: 'fullDress', label: 'Full Dress', options: ['Handloom emerald Banarasi silk saree', 'Belted stone cotton-gabardine trench coat', 'Floor-length ivory Anarkali ensemble', 'Draped minimalist satin column gown'] },
      { key: 'jewelEar', label: 'Jewellery - Ear', options: ['Sculpted gold chandbali earrings', 'Minimalist brushed gold hoops', 'Antique kundan jhumkas', 'Pearl drop studs'] },
      { key: 'jewelNose', label: 'Jewellery - Nose', options: ['Delicate gold nath nose ring', 'Tiny diamond nose pin', 'Traditional Maharashtrian nath'] },
      { key: 'jewelHair', label: 'Jewellery - Hair', options: ['Gold matha patti hair ornament', 'Fresh white jasmine gajra', 'Minimalist brass hair pin'] },
      { key: 'jewelForehead', label: 'Jewellery - Forehead', options: ['Antique polki maang tikka', 'Dainty gold borla', 'Subtle vermilion bindi'] },
      { key: 'jewelNeck', label: 'Jewellery - Neck', options: ['Heritage temple gold choker', 'Layered freshwater pearl necklace', 'Fine sculptural collar torque'] },
      { key: 'jewelWaist', label: 'Jewellery - Waist', options: ['Ornate gold kamarbandh waist belt', 'Slim braided leather waist cincher'] },
      { key: 'jewelHand', label: 'Jewellery - Hand', options: ['Stacked matte gold bangles and hathphool', 'Minimalist signet ring', 'Intricate bridal henna mehendi'] },
      { key: 'jewelFoot', label: 'Jewellery - Foot', options: ['Silver ghungroo payal anklets', 'Delicate gold chain anklet'] },
      { key: 'accessory1', label: 'Accessory 1', options: ['Structured leather top-handle bag', 'Embroidered potli clutch', 'Acetate editorial sunglasses'] },
      { key: 'accessory2', label: 'Accessory 2', options: ['Sheer organza dupatta drape', 'Silk pocket square', 'Vintage analog rangefinder'] },
      { key: 'footwear', label: 'Footwear', options: ['Embroidered zardozi mojari juttis', 'Pointed leather slingback heels', 'Minimalist square-toe leather boots', 'Strappy metallic sandals'] }
    ]
  },
  {
    id: 'mod_appearance',
    title: '6. Appearance',
    icon: 'ico-mod-appearance',
    open: false,
    subGroups: [
      {
        id: 'sub_makeup',
        title: 'Makeup',
        icon: 'ico-mod-makeup',
        fields: [
          { key: 'makeupBase', label: 'Base', options: ['Luminous satin skin finish', 'Dewy glass-skin editorial base', 'Natural matte velvet complexion'] },
          { key: 'makeupEyes', label: 'Eyes', options: ['Soft smoked kohl kajal liner', 'Warm bronze shimmer lids', 'Clean groomed brows with bare lids'] },
          { key: 'makeupLips', label: 'Lips', options: ['Muted terracotta rose matte lip', 'Deep crimson velvet stain', 'Sheer hydrated berry tint'] },
          { key: 'skinTexture', label: 'Skin Texture', options: ['Authentic visible skin pores and fine details', 'Sun-kissed natural freckles', 'Warm golden-hour skin sheen'] }
        ]
      },
      {
        id: 'sub_hair',
        title: 'Hair',
        icon: 'ico-mod-hair',
        fields: [
          { key: 'hairLength', label: 'Length', options: ['Waist-length flowing hair', 'Collarbone-length lob', 'Chin-length editorial bob', 'Cropped pixie cut'] },
          { key: 'hairColour', label: 'Colour', options: ['Rich espresso black', 'Warm chestnut brown', 'Sunlit auburn highlights', 'Natural silver-streaked dark hair'] },
          { key: 'hairPartition', label: 'Partition', options: ['Crisp center partition', 'Deep side part', 'Sleek pulled-back hairline'] },
          { key: 'hairStyle', label: 'Style', options: ['Low sculptural chignon bun', 'Soft effortless editorial waves', 'Long braided plait with parandi', 'Sleek wet-look editorial sweep'] }
        ]
      }
    ]
  },
  {
    id: 'mod_action',
    title: '7. Action',
    icon: 'ico-mod-action',
    open: false,
    fields: [
      { key: 'stance', label: 'Stance & Posture', options: ['Composed three-quarter profile turn', 'Mid-stride walking forward', 'Seated on low architectural plinth', 'Relaxed contrapposto stance'] },
      { key: 'hands', label: 'Hand Placement', options: ['Fingertips resting gently on collarbone', 'Hands tucked into blazer pockets', 'Adjusting saree pallu drape', 'Arms relaxed naturally at sides'] },
      { key: 'gaze', label: 'Gaze Direction', options: ['Direct calm gaze into lens', 'Thoughtful off-camera gaze toward light', 'Downward serene profile glance'] },
      { key: 'expression', label: 'Expression', options: ['Poised neutral editorial expression', 'Subtle warm confident smile', 'Serene contemplative calm'] }
    ]
  },
  {
    id: 'mod_character',
    title: '8. Character Design',
    icon: 'ico-mod-character',
    open: false,
    fields: [
      { key: 'ageBracket', label: 'Age Bracket', options: ['Early 20s', 'Late 20s', 'Early 30s', '40s Editorial'] },
      { key: 'buildPhysique', label: 'Build / Physique', options: ['Tall slender runway silhouette', 'Athletic toned frame', 'Graceful natural build'] },
      { key: 'culturalNotes', label: 'Cultural Styling', options: ['Contemporary South Asian couture', 'Minimalist Milanese tailoring', 'Modern Parisian understated chic'] },
      { key: 'distinguishing', label: 'Distinguishing Features', options: ['Sharp cheekbones and defined jawline', 'Expressive almond eyes and arched brows', 'Natural beauty mark and serene poise'] }
    ]
  }
];

const NEGATIVE_PRESETS = [
  'plastic skin',
  'extra fingers',
  'harsh flash',
  'watermark',
  'distorted hands',
  'fused fingers',
  'floating fabric',
  'doll-like stare',
  'dead glassy eyes',
  'stiff mannequin posture'
];

const DEFAULT_DIRECTIVE_PROFILES = {
  physique: {
    'Editorial Sculpted': 'Sculpted facial contours, defined collarbones, poised upright posture, natural skin texture',
    'Graceful Natural': 'Soft natural proportions, relaxed shoulders, authentic skin pores and subtle highlights'
  },
  hairstyle: {
    'Jasmine Chignon': 'Center-parted low chignon wrapped in fresh white jasmine flowers with soft face-framing strands',
    'Sleek Editorial Sweep': 'Clean center-parted sleek low bun with glossy natural hair texture'
  },
  pose: {
    '3/4 Collarbone Turn': 'Three-quarter profile turn, fingertips resting gently on collarbone, calm direct camera gaze',
    'Architectural Stride': 'Composed mid-stride forward movement, chin slightly lifted, natural arm swing'
  }
};
