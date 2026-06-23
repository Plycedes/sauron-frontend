export interface RagSource {
    updateId: string;
    projectId: string;
    authorId: string;
    score: number;
    excerpt: string;
}

export interface RagQueryResult {
    query: string;
    answer: string;
    sources: RagSource[];
    confidence: number;
}

// TODO: backend currently only supports `query`, `projectId`, and `topK`. The
// `userId`, `from`, and `to` fields are sent optimistically — backend should
// filter the retrieval set on these once the endpoint is extended.
// `projectId` is now optional: omit to query across all of the caller's projects.
export interface RagQueryInput {
    projectId?: string;
    query: string;
    topK?: number;
    userId?: string;
    from?: string;
    to?: string;
}
