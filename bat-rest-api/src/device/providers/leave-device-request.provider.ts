import { Connection } from 'mongoose';
import { LeaveDeviceRequestSchema } from '../schema/leave-device-request.schema';

export const leaveDeviceRequestProvider = [
  {
    provide: 'LEAVE_DEVICE_REQUEST',
    useFactory: (connection: Connection) => connection.model('LeaveDeviceRequest', LeaveDeviceRequestSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];