import { Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    username: string;
    password: string;
    employeeId: string;
}