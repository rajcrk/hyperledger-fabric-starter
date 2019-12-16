import * as mongoose from 'mongoose';

export const LeaveDeviceRequestSchema = new mongoose.Schema({
    id: String,
    deviceName: String,
    ownerId: String,
    comment: String,
    leaveToId: String,
    dateOfLeave: String,
    status: { type: String, default: 'pending' }
});
