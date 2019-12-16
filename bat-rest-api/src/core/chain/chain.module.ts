import { Module } from '@nestjs/common';
import { RequestHelper } from './requesthelper';
import { HlfClient } from './hlfclient';
import { HlfCaClient } from './hlfcaclient';
import { HlfConfig } from './hlfconfig';
import { EventsModule } from '../events/events.module';
import { RegisterHelper } from './registerhelper';

@Module({
    providers: [
        RequestHelper,
        RegisterHelper,
        HlfConfig,
        HlfClient,
        HlfCaClient
    ],
    exports: [
        RequestHelper,
        RegisterHelper,
        HlfConfig,
        HlfClient,
        HlfCaClient
    ],
    imports: [
        EventsModule
    ]
})
export class ChainModule {
}
