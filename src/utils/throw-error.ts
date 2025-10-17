export type TAppError = Error & {
    status?: number;
};

export const throw_error = (message: string, status = 500): never => {
    const error: TAppError = new Error(message);
    error.status = status;

    throw error;
};
