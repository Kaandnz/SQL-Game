export type Difficulty = "easy" | "medium" | "hard" | "boss";

export type WorldStatus = "locked" | "available" | "completed";

export interface ColumnSchema {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: {
    table: string;
    column: string;
  };
  description?: string;
}

export interface TableSchema {
  name: string;
  description: string;
  columns: ColumnSchema[];
  sampleRows?: Record<string, any>[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  icon: string;
  tables: TableSchema[];
  seedSql: string;
}

export interface HintTiers {
  level1: string; // Conceptual hint
  level2: string; // SQL structure hint
  level3: string; // Near syntax hint
}

export interface Challenge {
  id: string;
  worldId: number;
  order: number;
  title: string;
  subtitle: string;
  story: string;
  objective: string;
  difficulty: Difficulty;
  concepts: string[];
  databaseId: string;
  expectedColumns?: string[];
  orderMatters?: boolean;
  hints: HintTiers;
  solutionQuery: string;
  starterQuery?: string;
  baseXp: number;
  prerequisites?: string[];
  learningNotes?: string;
}

export interface World {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  category: "Fundamentals" | "Intermediate" | "Advanced" | "Mastery";
  requiredWorldId?: number;
  concepts: string[];
}

export type ErrorType =
  | "SYNTAX_ERROR"
  | "SECURITY_VIOLATION"
  | "EXECUTION_ERROR"
  | "COLUMN_MISMATCH"
  | "ROW_COUNT_MISMATCH"
  | "DATA_MISMATCH"
  | "ORDERING_MISMATCH"
  | "EMPTY_RESULT";

export interface EvaluationResult {
  isCorrect: boolean;
  userRows: Record<string, any>[];
  userColumns: string[];
  expectedRows?: Record<string, any>[];
  expectedColumns?: string[];
  executionTimeMs: number;
  rowCount: number;
  error?: {
    type: ErrorType;
    message: string;
    rawError?: string;
    suggestion?: string;
  };
  xpEarned?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "xp" | "streak" | "mastery" | "special";
  unlockedAt?: string;
  condition: (state: any) => boolean;
}

export interface UserProgressState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  completedChallenges: Record<
    string,
    {
      solvedAt: string;
      hintsUsed: number;
      viewedSolution: boolean;
      xpEarned: number;
      userSql: string;
      attempts: number;
    }
  >;
  unlockedWorlds: number[];
  unlockedAchievements: string[];
  soundEnabled: boolean;
  theme: "dark";
}
