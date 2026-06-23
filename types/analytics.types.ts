export interface ProjectStats {
    projectId: string;
    totalUpdates: number;
    uniqueContributors: number;
    averageConfidence: number;
    blockerCount: number;
    lastActivityAt: string | null;
}

export interface UserStats {
    userId: string;
    totalUpdates: number;
    projectsContributed: number;
    averageConfidence: number;
    lastUpdateAt: string | null;
}

export interface ConfidenceTrendPoint {
    bucket: string;
    averageConfidence: number;
    sampleSize: number;
}

export interface StaleMember {
    userId: string;
    name: string;
    lastUpdateAt: string | null;
    daysSinceLastUpdate: number | null;
}

export type ProjectStatsResponse = ProjectStats;
export type UserStatsResponse = UserStats;
export type StaleMemberResponse = StaleMember;