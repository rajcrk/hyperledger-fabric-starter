import { Module, NestModule } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { EnvConfig } from '../common/config/env';
import { JwtauthenticationMiddleware } from '../common/middleware/jwtauthentication.middleware';
import { HlfcredsgeneratorMiddleware } from '../common/middleware/hlfcredsgenerator.middleware';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { ChainModule } from '../core/chain/chain.module';
import { deviceRequestProvider } from './providers/device-request.provider';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { RegisterHelper } from '../core/chain/registerhelper';
import { usersProviders } from '../user/providers/user.provider';
import { leaveDeviceRequestProvider } from './providers/leave-device-request.provider';
import { googleUsersProviders } from '../user/providers/google-user.provider';

@Module({
    controllers: [
        DeviceController,
    ],
    providers: [
        DeviceService,
        RegisterHelper,
        ...deviceRequestProvider,
        ...usersProviders,
        ...googleUsersProviders,
        ...leaveDeviceRequestProvider
    ],
    imports: [
        AuthenticationModule,
        ChainModule,
        DatabaseModule,
    ],
    exports: [
        DeviceService
    ]
})
export class DeviceModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {

        if (EnvConfig.SKIP_MIDDLEWARE) {
            consumer
                .apply(JwtauthenticationMiddleware, HlfcredsgeneratorMiddleware)
                .forRoutes(DeviceController);
        }
    }
}
