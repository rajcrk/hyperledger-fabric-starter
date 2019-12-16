import * as mongoose from 'mongoose';

export const DeviceRequestSchema = new mongoose.Schema({
    deviceId: String,
    deviceName: String,
    dateOfReturn: String,
    requestedBy: String,
    dateOfRequest: String,
    status: { type: String, default: 'pending' },
});
