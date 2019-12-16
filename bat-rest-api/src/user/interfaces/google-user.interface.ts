import { Document } from 'mongoose';

export interface IGoogleUser extends Document {
    email: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
}