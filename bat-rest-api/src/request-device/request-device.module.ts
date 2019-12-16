import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RequestDeviceController } from './request-device.controller';
import { RequestDeviceService } from './request-device.service';
import { deviceRequestProvider } from '../device/providers/device-request.provider';
import { DatabaseModule } from '../database/database.module';
import { RegisterHelper } from '../core/chain/registerhelper';
import { EnvConfig } from '../common/config/env';
import { JwtauthenticationMiddleware } from '../common/middleware/jwtauthentication.middleware';
import { HlfcredsgeneratorMiddleware } from '../common/middleware/hlfcredsgenerator.middleware';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { ChainModule } from '../core/chain/chain.module';

@Module({
  controllers: [RequestDeviceController],
  providers: [
    RegisterHelper,
    RequestDeviceService,
    ...deviceRequestProvider,
  ],
  imports: [
    AuthenticationModule,
    ChainModule,
    DatabaseModule
  ]
})
export class RequestDeviceModule {
  configure(consumer: MiddlewareConsumer): void {

    if (EnvConfig.SKIP_MIDDLEWARE) {
        consumer
            .apply(JwtauthenticationMiddleware, HlfcredsgeneratorMiddleware)
            .forRoutes(RequestDeviceController);
    }
}
}
