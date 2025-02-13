const mongoose = require('mongoose');
const {Schema , model}= mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    country: { type: String, required: true }
});

const UserModel= model('User', UserSchema);

module.exports = UserModel;