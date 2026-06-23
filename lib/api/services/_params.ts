export function definedParams(record: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
        if (value !== undefined && value !== null) {
            out[key] = value;
        }
    }
    return out;
}
