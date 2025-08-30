import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { ConfigService } from "@nestjs/config";
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import Redis from "ioredis";

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
              const redisUrl = configService.get("REDIS_URL");
              console.log("redisUrl",redisUrl);
              
              const rawRedis = new Redis(redisUrl, {
                tls: { rejectUnauthorized: false } // required sometimes in prod
              });

              rawRedis.on("connect", () => console.log("✅ Redis connected!"));
              rawRedis.on("error", (err) => console.error("❌ Redis error:", err.message));
               
              const redisStore = createKeyv(redisUrl);

              return {
                stores: [
                  new Keyv({
                    store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                  }),
                  redisStore,
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

