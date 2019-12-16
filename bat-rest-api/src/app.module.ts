import { Module } from '@nestjs/common';
import { EnvConfig } from './common/config/env';
import { Log } from './common/utils/logging/log.service';
import { CoreModule } from './core/core.module';
import { DeviceModule } from './device/device.module';
import { PingModule } from './ping/ping.module';
import { UserModule } from './user/user.module';
import { RequestDeviceModule } from './request-device/request-device.module';
import { LeaveDeviceModule } from './leave-device/leave-device.module';

@Module({
    imports: [
        CoreModule,
        PingModule,
        UserModule,
        DeviceModule,
        RequestDeviceModule,
        LeaveDeviceModule
    ]
})
export class ApplicationModule {
    constructor() {
        // list env keys in console
        for (let propName of Object.keys(EnvConfig)) {
            Log.config.debug(`${propName}:  ${EnvConfig[propName]}`);
        }

    }
}