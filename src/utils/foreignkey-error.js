const { StatusCodes } = require('http-status-codes');
const AppError = require('./error-handler');

class ForeignKeyError extends AppError {
    constructor(error) {
        super(
            error.name,
            'Foreign Key Constraint Error',
            error.original.sqlMessage || 'A foreign key constraint error occurred',
            StatusCodes.CONFLICT // 409
        );
    }
}

module.exports = ForeignKeyError;
