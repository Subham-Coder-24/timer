export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remainingTime: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  halfwayAlert?: boolean;
  createdAt: number;
}

export interface TimerHistory {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: number;
}

export interface TimerGroup {
  [category: string]: Timer[];
}