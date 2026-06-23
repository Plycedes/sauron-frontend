export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiClientError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;

    constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiClientError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}