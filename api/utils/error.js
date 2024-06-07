//custom error handler who handles the error for some functions 
export const errorHandler = (statusCode , message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message; 
    return error;
}