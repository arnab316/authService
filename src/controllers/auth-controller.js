const {AuthService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const authService = new AuthService();
const {logMessage} = require('../utils/log-service')

const handleError = (res, error) => {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; 
    const errorResponse = {
        success: false,
        message: error.message || 'An unexpected error occurred',
    };
    if (error.details) {
        errorResponse.error = error.details; 
    } else {
        errorResponse.error = {
            name: error.name || 'Error',
            message: error.message || 'An error occurred',
            description: error.description || 'No additional information available',
            statusCode: statusCode,
        };
    }
    return res.status(statusCode).json(errorResponse);
};




//? Controller for user signup
const signup = async (req, res) => {
    try {
        const data = req.body;  // Get data from request body
        const auth = await authService.signup(data);
await logMessage('authController', 'info', `Signup successful for user ${data.userId}`);        
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Signup successful',
            data: auth,
        });
    } catch (error) {
 await logMessage('authController', 'error', `Signup failed: ${error.message}`);        
 handleError(res, error)
    }
};
//? controller for login
const signin = async (req, res) => {

    try {
        const data = req.body;
        const auth = await authService.signin(data);
await logMessage('authController', 'info', `Login successful for user ${data.userId}`);        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: auth,
        });
    } catch (error) {
        await logMessage('authController', 'error', `Login failed: ${error.message}`);        
        handleError(res, error)
    }
}

const getAll = async(req, res) => {
    try {
        const auths = await authService.getAllAuth();
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Data fetched successfully',
            data: auths,
        });
    } catch (error) {
        handleError(res, error)
    }
}
const validateToken = async(req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required for authentication',
            });
        }
        const decoded = await authService.validateToken(token);
        await logMessage('authController', 'info', `token is valid ${decoded}`); 
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Token is valid',
            data: decoded,
        });
    } catch (error) {
        await logMessage('authController', 'error', ` token is not valid: ${error.message}`);
        handleError(res, error)
    }
}

module.exports = {
    signup,
    signin,
    getAll,
    validateToken
    
};