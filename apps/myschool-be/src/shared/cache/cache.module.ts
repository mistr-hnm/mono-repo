import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createKeyv } from '@keyv/redis';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const url = `redis://${configService.get('REDIS_HOST') + ":" + configService.get('REDIS_PORT')}`;
                return {
                    stores: [createKeyv(url)],
                };
            },
            inject: [ConfigService]
        })
    ],
    providers: [CacheService],
    exports: [CacheService, CacheModule]
})
export class SharedCacheModule {
    constructor() {
        console.log("SharedCacheModule");
    }
}

