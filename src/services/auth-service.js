//services/auth-service.js
const {AuthRepository} =require('../repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/error-handler');
const ValidationError = require('../utils/validation-error')

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
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
    async singup(data){
        try {
           const auth = await this.authRepository.create(data);
           return auth;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
              }
              throw new AppError(
                'ServerError',
                'An error occurred during signup',
                'Logical issue found',
              );  
        }
    }


    async singin(data){
        try {
            const auth = await this.authRepository.getById(data);
            const passwordsMatch = await this.checkPassword(plainPassword, auth.passwordhash);

        } catch (error) {
            
        }
    }


  async  checkPassword(){
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
          } catch (error) {
            console.log('Error during password comparison in AuthService');
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