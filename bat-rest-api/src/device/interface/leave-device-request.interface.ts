import { Document } from 'mongoose';

export interface ILeaveDeviceRequest extends Document {
    id: string;
    ownerId: string;
    comment: string;
    leaveToId: string;
    dateOfLeave: Date;
}