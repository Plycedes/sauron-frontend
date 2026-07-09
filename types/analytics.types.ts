import type { UpdateCategory } from './update.types';

export interface ConfidenceBreakdown {
  low: number;
  medium: number;
  high: number;
}

export type CategoryBreakdown = Record<UpdateCategory, number>;

export interface MemberStats {
  userId: string;
  totalHours: number;
  updateCount: number;
  confidenceBreakdown: ConfidenceBreakdown;
}

export interface ProjectStatsResponse {
  projectId: string;
  companyId: string;
  totalHours: number;
  totalUpdates: number;
  categoryBreakdown: CategoryBreakdown;
  dateRange: { from: string | null; to: string | null };
  members: MemberStats[];
}

export interface PerProjectStats {
  projectId: string;
  totalHours: number;
  updateCount: number;
  avgConfidence: number;
}

export interface UserStatsResponse {
  userId: string;
  companyId: string;
  lastUpdateDate: string | null;
  currentStreak: number;
  categoryBreakdown: CategoryBreakdown;
  projects: PerProjectStats[];
}

export interface ConfidenceTrendPoint {
  date: string;
  low: number;
  medium: number;
  high: number;
}

export interface StaleMemberResponse {
  userId: string;
  lastUpdateDate: string | null;
  daysSinceUpdate: number;
}
