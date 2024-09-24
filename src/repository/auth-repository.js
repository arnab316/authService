const CrudRepository = require('./curd-repositoty');
const { Auth } = require('../models');

class AuthRepository  extends CrudRepository{
    constructor() {
        super(Auth);
    }
}

module.exports = AuthRepository;