const CrudRepository = require('./curd-repositoty');
const { Auth } = require('../models');

class AuthRepository  extends CrudRepository{
    constructor() {
        super(Auth);
    }

async updateField(id, fieldName, fieldValue) {
    const data = { [fieldName]: fieldValue }; 
    return await Auth.update(data, { where: { id } });
}

}

module.exports = AuthRepository;