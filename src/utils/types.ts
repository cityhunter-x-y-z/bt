import type { PlayerBackground } from './constants';

// Direction for player movement and NPC facing
export type Direction = 'down' | 'left' | 'right' | 'up';

// Player stats
export interface PlayerStats {
  energy: number; // 0-100
  stress: number; // 0-100
  money: number; // ₹
}

// Individual skill branch (XP and level)
export interface SkillBranch {
  xp: number;
  level: number; // 0-4 (5 tiers total)
}

// All skill branches
export interface PlayerSkills {
  technical: SkillBranch;
  soft_skills: SkillBranch;
  city_survival: SkillBranch;
}

// Union type for skill branch names
export type SkillBranchName = keyof PlayerSkills;

// Player character data
export interface PlayerData {
  name: string;
  background: PlayerBackground;
  homeState: string;
  position: {
    scene: string;
    x: number;
    y: number;
  };
  direction: Direction;
}

// Dialogue system types
export interface StatEffect {
  energy?: number;
  stress?: number;
  money?: number;
  xp?: number;
  xp_branch?: SkillBranchName;
  item_add?: string;
  item_remove?: string;
}

export interface SkillRequirement {
  skill: string;
  level: number;
}

export interface DialogueChoice {
  text: string;
  next: string;
  effect?: StatEffect;
  requires?: SkillRequirement;
  quest_trigger?: string;
}

export interface DialogueNode {
  text: string;
  portrait_expression?: number; // 0=neutral, 1=angry, 2=happy, etc.
  choices?: DialogueChoice[];
  next?: string; // auto-advance if no choices
  effect?: StatEffect;
  quest_trigger?: string;
  requires?: SkillRequirement;
}

export interface DialogueFile {
  id: string;
  speaker: string;
  portrait: string; // spritesheet key
  nodes: Record<string, DialogueNode>;
}

// Quest system types
export interface QuestObjective {
  id: string;
  text: string;
  type: 'interact' | 'dialogue' | 'collect' | 'reach' | 'challenge';
  target: string; // entity ID, NPC ID, item ID, or zone ID
  count?: number;
  optional?: boolean;
}

export interface QuestRewards {
  xp: number;
  xp_branch?: SkillBranchName;
  money?: number;
  items?: string[];
  skill_unlock?: string;
  unlocks?: string[]; // scene keys or quest IDs
}

export interface QuestFile {
  id: string;
  title: string;
  description: string;
  chapter: number;
  prerequisite_quests?: string[];
  objectives: QuestObjective[];
  rewards: QuestRewards;
  on_complete?: {
    unlock_scene?: string;
    trigger_dialogue?: string;
    trigger_cutscene?: string;
  };
}

// Item system types
export type ItemType = 'consumable' | 'key_item' | 'gift' | 'equipment';

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  icon: string; // spritesheet key
  type: ItemType;
  effect?: StatEffect;
  stackable: boolean;
  max_stack?: number;
}

// Save data (complete game state)
export interface SaveData {
  version: string; // "1.0.0" for migration support
  timestamp: number;
  player: PlayerData;
  stats: PlayerStats;
  skills: PlayerSkills;
  inventory: string[]; // item IDs
  quests: {
    active: Record<string, string[]>; // quest_id -> completed objective IDs
    completed: string[];
  };
  flags: Record<string, boolean>; // generic game flags for branching
  playtime_seconds: number;
}
