import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ConfigService } from "@nestjs/config";
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
              const redis = createKeyv(configService.get("REDIS_URL"));
              
              // ✅ Attach listeners to check connection
              redis.on("error", (err: any) => {
                console.error("❌ Redis connection error:", err.message);
              });

              redis.on("connect", () => {
                console.log("✅ Redis connected successfully!");
              });

              return {
                stores: [
                  new Keyv({
                    store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                  }),
                  redis,
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

