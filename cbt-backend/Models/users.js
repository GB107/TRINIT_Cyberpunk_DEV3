const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    photo : { type: String, required: true },
    test: {
        test_id: { type: String, required: true },
        answers: { type: Array, required: true }
    }
 });
 
const Users = mongoose.model('cbtusers',userSchema);

module.exports = Users;