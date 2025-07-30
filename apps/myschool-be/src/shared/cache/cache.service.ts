import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }


    async addToCache(key: string, value: string, ttl?: number) {
        return await this.cacheManager.set(key, value, ttl || 30000)
    }

    async getFromCache(key: string) {
        return await this.cacheManager.get(key)
    }

    async removeFromCache(key: string) {
        return await this.cacheManager.del(key)
    }

}