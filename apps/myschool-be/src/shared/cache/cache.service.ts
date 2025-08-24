import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }


    async addToCache(key: string, value: string, ttl?: number) {
        try {
            await this.cacheManager.set(key, value ,ttl || (1000 * 60 * 60))
        } catch (error) {
            console.error('Cache get failed:', error);
            return null; // Graceful degradation
        }
    }

    async getFromCache(key: string) {
        try {
            return await this.cacheManager.get(key)
        } catch (error) {
            console.error('Cache get failed:', error);
            return null; // Graceful degradation
        }
    }

    async removeFromCache(key: string) {
        try {
            return await this.cacheManager.del(key)
        } catch (error) {
            console.error('Cache get failed:', error);
            return null; // Graceful degradation
        }
    }

}