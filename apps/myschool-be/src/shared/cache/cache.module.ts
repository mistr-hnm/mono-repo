import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    store: redisStore,
                    url: configService.get('REDIS_URL'),
                    ttl: 600, // 10 minutes default
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

