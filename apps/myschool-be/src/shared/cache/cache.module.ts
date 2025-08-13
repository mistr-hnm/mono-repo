import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
              return {
                stores: [
                  new Keyv({
                    store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                  }),
                  createKeyv(configService.get('REDIS_URL')),
                ],
              };
            },
            inject: [ConfigService]
          }),      
    ],
    providers: [CacheService],
    exports: [CacheService, CacheModule]
})
export class SharedCacheModule {}

