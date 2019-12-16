import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EnvConfig } from '../common/config/env';
import { HlfcredsgeneratorMiddleware } from '../common/middleware/hlfcredsgenerator.middleware';
import { JwtauthenticationMiddleware } from '../common/middleware/jwtauthentication.middleware';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { ChainModule } from '../core/chain/chain.module';
import { DatabaseModule } from '../database/database.module';
import { DeviceModule } from '../device/device.module';
import { leaveDeviceRequestProvider } from '../device/providers/leave-device-request.provider';
import { LeaveDeviceController } from './leave-device.controller';
import { LeaveDeviceService } from './leave-device.service';
import { usersProviders } from '../user/providers/user.provider';
import { googleUsersProviders } from '../user/providers/google-user.provider';

@Module({
  controllers: [LeaveDeviceController],
  providers: [
    LeaveDeviceService,
    ...leaveDeviceRequestProvider,
    ...googleUsersProviders
  ],
  imports: [
    AuthenticationModule,
    ChainModule,
    DatabaseModule,
    DeviceModule
  ]
})
export class LeaveDeviceModule {
  configure(consumer: MiddlewareConsumer): void {
    if (EnvConfig.SKIP_MIDDLEWARE) {
      consumer
        .apply(JwtauthenticationMiddleware, HlfcredsgeneratorMiddleware)
        .forRoutes(LeaveDeviceController);
    }
  }
}
