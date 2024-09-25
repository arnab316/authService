//services/auth-service.js
const {AuthRepository} =require('../repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error')
const {JWT_KEY} = require('../config/server-config')
const {logMessage} = require('../utils/log-service')

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }



    async validateToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_KEY);
            const authRecord = await this.authRepository.getByField('token', token);
            if (!authRecord) {
                throw new AppError('UnauthorizedError', 
                    'an error in validate token',
                    'Token not found or revoked', 401);
            }
            const isTokenExpired = new Date() > new Date(authRecord.expireAt);
            if (isTokenExpired) {
                throw new AppError('UnauthorizedError', 'error','Token has expired', 401);
            }
await logMessage('authService', 'info', `User ${token} signed up successfully`);           
            return decoded;
        } catch (error) {
await logMessage('authService', 'error', `Error during validate token ${error.message}`);             
            throw new AppError(
                'UnauthorizedError',
                'Token is invalid or expired',
                error.message,
                401
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
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
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


    async signin(data){
        try {
            const { userId, password: plainPassword } = data;
            const auth = await this.authRepository.getById(userId);
            if (!auth) {
                throw new AppError('AuthenticationError', 'User not found', 'No user found with this ID');
            }
            const passwordsMatch = await this.checkPassword(plainPassword, auth.passwordhash);
            if (!passwordsMatch) {
                throw new AppError('AuthenticationError', 'Invalid password', 'Password does not match');
            }
            const token = jwt.sign({ userId: auth.userId }, JWT_KEY, {
                expiresIn: '1h',
            });
//* log service            
 await logMessage('authService', 'info', `User ${userId} signed in successfully`);
            return {
                userId: auth.userId,
                token,
            };
        } catch (error) {
            if( error instanceof AppError){
                throw error;
            }
//* log service            
  await logMessage('authService', 'error', `Error during signin for user ${data.userId}: ${error.message}`);
                throw new AppError('InternalServerError', 
                    'An unexpected error occurred while fetching data', 
                    error.message);
            
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