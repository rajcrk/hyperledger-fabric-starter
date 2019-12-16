import { Document } from 'mongoose';

export interface IRequestDevice extends Document {
    deviceId: string;
    deviceName: string;
    dateOfReturn: string;
    requestedBy: string;
    dateOfRequest: string;
    status: string;
}