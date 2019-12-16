import { Module, NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants/auth.constants';
import { JwtStrategy } from '../auth/jwt.strategy';
import { EnvConfig } from '../common/config/env';
import { HlfcredsgeneratorMiddleware } from '../common/middleware/hlfcredsgenerator.middleware';
import { JwtauthenticationMiddleware } from '../common/middleware/jwtauthentication.middleware';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { RegisterHelper } from '../core/chain/registerhelper';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { googleUsersProviders } from './providers/google-user.provider';

@Module({
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
        RegisterHelper,
        ...usersProviders,
        ...googleUsersProviders,
        JwtStrategy,
    ],
    imports: [
        DatabaseModule,
        AuthenticationModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '1d'
            },
        }),
    ]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        if (EnvConfig.SKIP_MIDDLEWARE) {
            consumer
                .apply(JwtauthenticationMiddleware, HlfcredsgeneratorMiddleware)
                .forRoutes(UserController);
        }
    }
}
