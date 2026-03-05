class ErrorHandler extends Error {
    statusCode;
    message;
    details;
    constructor(message,statusCode,details){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this,this.constructor);
    }
}
export default ErrorHandler;