export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum BatState {
  Flying,
  Resting
}

export interface Skill {
  name: string;
  level: number; // 0-100
}