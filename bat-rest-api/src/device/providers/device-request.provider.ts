import { Connection } from 'mongoose';
import { DeviceRequestSchema } from '../schema/request-device.schema';

export const deviceRequestProvider = [
  {
    provide: 'DEVICE_REQUEST_MODEL',
    useFactory: (connection: Connection) => connection.model('DeviceRequest', DeviceRequestSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];