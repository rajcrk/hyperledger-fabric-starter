import { Connection } from 'mongoose';
import { GoogleUserSchema } from '../schemas/google-user.schema';

export const googleUsersProviders = [
  {
    provide: 'GOOGLE_USER_MODEL',
    useFactory: (connection: Connection) => connection.model('GoogleUser', GoogleUserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];