//services/auth-service.js
const {AuthRepository} =require('../repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error')
const ForeignKeyError = require('../utils/foreignkey-error')
const {JWT_KEY} = require('../config/server-config')
const {logMessage} = require('../utils/log-service')
const moment = require('moment');
class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }


//* for validate tokens
async validateToken(token) {
    try {

        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_KEY);

        // Token is valid and not expired, proceed with fetching the auth record
        const authRecord = await this.authRepository.getByField('token', token);
        if (!authRecord) {
            throw new AppError(
                'UnauthorizedError',
                'Validation Error',
                'Token not found or revoked',
                401
            );
        }

        return decoded;

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error("Token validation failed: Token has expired at", error.expiredAt);
            throw new AppError(
                'UnauthorizedError',
                'Token Expired',
                'The provided token has expired. Please log in again.',
                401
            );
        } else {
            console.error("Error during token validation:", error);
            throw new AppError(
                'UnauthorizedError',
                'Token Invalid',
                'The provided token is invalid or malformed.',
                401
            );
        }
    }
}

//* for user  login 
async signin(data) {
    try {
        const { userId, password: plainPassword } = data;

        // Fetch user authentication details
        const auth = await this.authRepository.getByField('userId', userId);
        if (!auth) {
            throw new AppError('AuthenticationError', 'User not found', 'No user found with this ID');
        }

        // Verify password
        const passwordsMatch = await this.checkPassword(plainPassword, auth.passwordhash);
        if (!passwordsMatch) {
            throw new AppError('AuthenticationError', 'Invalid password', 'Password does not match');
        }

        // Log the current expireAt timestamp
        console.log(`Current expireAt for user ${userId}: ${auth.expireAt}`);

        // Get current time
        const currentTimestamp =  moment().utc().unix();
        const expireAtTimestamp = moment(auth.expireAt).utc().unix();

        console.log('Current Timestamp:', currentTimestamp);
        console.log('Expire At Timestamp:', expireAtTimestamp);
        // Log and check if the token or expireAt timestamp needs to be updated
        if (!auth.token || expireAtTimestamp < currentTimestamp) {
            console.log('Condition met, generating new token for user:', userId);
            //* Generate new token and expiration time
            const token = jwt.sign(
                { userId: auth.userId },
        JWT_KEY,
        { expiresIn: '24h' } 
            );
            //* Update Auth Object 
            auth.token = token;
            auth.expireAt =  moment().utc().add(24, 'hours').toISOString(); // Set to 24 hours from now
            
            // Explicitly set `expireAt` to ensure Sequelize recognizes it as updated
            auth.setDataValue('expireAt', auth.expireAt);

            //  save and check if `expireAt` persists correctly
            try {
                await auth.save();
                console.log(`Updated expireAt for user ${userId}: ${auth.expireAt}`);
            } catch (error) {
                console.log("Error saving auth with new expireAt:", error);
            }
        }else {
            console.log('Token is still valid; no new token generated.');
        }

        //* logger
        await logMessage('authService', 'info', `User ${userId} signed in successfully`);

        return {
            userId: auth.userId,
            token: auth.token,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        //* Log unexpected errors
        await logMessage('authService', 'error', `Error during signin for user ${data.userId}: ${error.message}`);
        throw new AppError(
            'InternalServerError', 
            'An unexpected error occurred while fetching data', 
            error.message
        );
    }
}


    async getAllAuth() {
        try {
            return await this.authRepository.getAll();
        } catch (error) {
            if(error instanceof AppError){
                throw error;
            }else {
                throw new AppError('InternalServerError', 
                    'An unexpected error occurred while fetching data', 
                    error.message);
            }
            
        }
    }
    async signup(data){
        try {
           // Generate JWT token
           const token = jwt.sign({ userId: data.userId }, JWT_KEY, {
            expiresIn: '1h', // Token expiration time, you can adjust this as needed
        });

        // Calculate token expiration time
        const expireAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Add token and expiration time to the data object
        const authData = {
            ...data,  // Spread other incoming data (like authId, userId, and password)
            token,
            expireAt
        };
        // Call the repository to create the new auth record
        const auth = await this.authRepository.create(authData);
        //* log service
        await logMessage('authService', 'info', `User ${data.userId} signed up successfully`);
        return auth;
        } catch (error) {

            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
              }else if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new ForeignKeyError(error);
              }
//* log service              
 await logMessage('authService', 'error', `Error during signup for user ${data.userId}: ${error.message}`);              
              throw new AppError(
                'ServerError',
                'An error occurred during signup',
                'Logical issue found',
              );  
        }

    }


    // ? validate password
    async checkPassword(plainPassword, hashedPassword){
        try {
            return await  bcrypt.compare(plainPassword, hashedPassword);
          } catch (error) {
            console.log('Error during password comparison in AuthService');
//* log service            
 await logMessage('authService', 'error', `Password comparison failed: ${error.message}`);        
            throw new AppError(
              'PasswordError',
              'Password comparison failed',
              'An error occurred while checking the password',
              500
            );
          }
    }
}


module.exports = AuthService