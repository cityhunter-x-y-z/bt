// Game dimensions (16:9 aspect ratio, 640×360 native resolution)
// Scales perfectly: 720p (2×), 1080p (3×), 1440p (4×)
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;
export const TILE_SIZE = 32; // 20 tiles wide × 11.25 tall visible

// Sprite dimensions (larger detailed sprites, 1 tile wide × 1.5 tiles tall)
export const SPRITE_WIDTH = 32; // character width in pixels
export const SPRITE_HEIGHT = 48; // character height in pixels

// Player movement (proportionally scaled for larger tiles)
export const PLAYER_SPEED = 120; // pixels/second
export const PLAYER_RUN_SPEED = 190; // pixels/second

// Camera settings (proportionally scaled deadzone)
export const CAMERA_DEADZONE_X = 160;
export const CAMERA_DEADZONE_Y = 100;

// Stats and resources
export const MAX_ENERGY = 100;
export const MAX_STRESS = 100;
export const STARTING_MONEY = 5000; // ₹
export const STARTING_ENERGY = 70;
export const STARTING_STRESS = 20;

// Skill system
export const SKILL_XP_THRESHOLDS = [0, 100, 300, 600, 1000]; // 5 tiers (0-indexed)

export const SKILL_TIER_NAMES = {
  technical: ['Basics', 'Intermediate', 'Proficient', 'Advanced', 'Expert'],
  soft_skills: ['Shy', 'Friendly', 'Charismatic', 'Influential', 'Leader'],
  city_survival: ['Tourist', 'Newcomer', 'Resident', 'Local', 'Namma Bengalurean'],
} as const;

// Scene keys (immutable registry)
export const SCENE_KEYS = Object.freeze({
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  CHARACTER_SELECT: 'CharacterSelectScene',
  AIRPORT: 'AirportScene',
  PG: 'PGScene',
  NEIGHBORHOOD: 'NeighborhoodScene',
  INTERVIEW: 'InterviewScene',
});

// Player background definitions
export const PLAYER_BACKGROUNDS = {
  architecture: {
    label: 'Architecture Graduate',
    description: 'Trained in spatial design and visual thinking',
    statBonuses: { creativity: 2, spatial_awareness: 1 },
  },
  engineering: {
    label: 'Engineering/Tech Graduate',
    description: 'Strong in problem-solving and logic',
    statBonuses: { technical: 2, logic: 1 },
  },
  design: {
    label: 'Design/Creative Graduate',
    description: 'Expert in visual communication',
    statBonuses: { creativity: 2, communication: 1 },
  },
  commerce: {
    label: 'Commerce/Business Graduate',
    description: 'Skilled in negotiation and finance',
    statBonuses: { negotiation: 2, finance: 1 },
  },
} as const;

export type PlayerBackground = keyof typeof PLAYER_BACKGROUNDS;

// Depth layers (for z-ordering sprites and UI)
export const DEPTH = {
  GROUND: 0,
  WALLS: 1,
  OBJECTS: 2,
  ENTITIES: 3,
  ABOVE_PLAYER: 10,
  UI: 100,
  DIALOGUE: 200,
} as const;

// Game state defaults
export const DEFAULT_PLAYER_NAME = 'Player';
export const DEFAULT_HOME_STATE = 'Other';
export const DEFAULT_DIRECTION = 'down';
