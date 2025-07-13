import { Injectable, NestMiddleware } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request, Response, NextFunction } from 'express'
import { UnauthorizedException } from "src/lib/response-exceptions";
import { CacheService } from "src/shared/cache/cache.service";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        private readonly cacheService : CacheService
    ){}


   async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['myschool-signature'] || req.headers['myschool-signature'] != process.env.API_KEY) {
            throw new UnauthorizedException();
        }
        const { ip, method, originalUrl } = req;

        const allowedURLS = [
            "/api/v1/users/login",
            "/api/v1/users/signup",
        ];
        if(allowedURLS.includes(originalUrl)){
            next()
        } else {
            const authHeader = req.headers['authorization']

            if (!authHeader  || !authHeader.toLowerCase().startsWith('bearer ')) {
                throw new UnauthorizedException();
            }
            const token = authHeader.split(' ')[1]
            try{
                const decoded = await this.jwtService.verifyAsync(token)
                
                const cachedPermissions  = await this.cacheService.getFromCache('permission') as string;
                const module = originalUrl.split("/"); 
                const permissions = JSON.parse(cachedPermissions);
                if(!cachedPermissions){
                    throw new UnauthorizedException();
                }
                if(permissions.findIndex((element)=>element.module == module[3]) < 0){
                    throw new UnauthorizedException();
                }
                req['user'] = decoded.sub;
                next()
            }catch(err){
                throw new UnauthorizedException(err?.message);
            }
        }
    }
}