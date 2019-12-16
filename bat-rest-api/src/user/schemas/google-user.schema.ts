import * as mongoose from 'mongoose';

export const GoogleUserSchema = new mongoose.Schema({
    email: String,
    employeeId: String,
    firstName: String,
    lastName: String,
    photoUrl: String,
    role: String
});
