//utils/validation-error.js
const {StatusCodes} = require('http-status-codes')

const AppError = require('./error-handler');


class ValidationError extends AppError {
    constructor(error){
        let errorName = error.name;
        let explanation = [];
        if (error.errors && Array.isArray(error.errors)) {
            error.errors.forEach((err) => {
                explanation.push(`${err.path}: ${err.message}`);
            });
        }else {
            // Fallback if no specific validation errors are available
            explanation.push(error.message || 'Validation error occurred');
        }
        super(
            errorName,
            message = 'Validation failed ',
            description = explanation.join(', '),
            statusCode = StatusCodes.UNPROCESSABLE_ENTITY,  // 422
        )


    
}}

module.exports = ValidationError;