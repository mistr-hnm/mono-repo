import { ForbiddenException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt"
import { Request, Response, NextFunction } from 'express'
import { CacheService } from "src/shared/cache/cache.service";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService
    ) { }


    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['myschool-signature'] || req.headers['myschool-signature'] != process.env.API_KEY) {
            throw new UnauthorizedException("Signature invalid")
        }
        const { ip, method, originalUrl } = req

        const allowedURLS = [
            "/api/v1/users/login",
            "/api/v1/users/signup",
        ];
        if (allowedURLS.includes(originalUrl)) {
            next()
        } else {
            const authHeader = req.headers['authorization']

            if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
                throw new UnauthorizedException()
            }
            const token = authHeader.split(' ')[1]
            let decoded
            try{
               decoded = await this.jwtService.verifyAsync(token)
            }catch(error){
                if(error instanceof TokenExpiredError){
                    throw new UnauthorizedException('Authentication token expired')
                }else if(error instanceof JsonWebTokenError){
                    throw new UnauthorizedException('Invalid authentication token')
                }
                throw new UnauthorizedException('Failed to authenticate token')
            } 

            const cachedPermissions = await this.cacheService.getFromCache('permission') as string
                        
            if (!cachedPermissions) {
                throw new ForbiddenException("Permission not allowed")
            }
            const module = originalUrl.split("/")
            const permissions = JSON.parse(cachedPermissions)
            
            if (permissions.findIndex((element) => element.module == module[3]) < 0) {
                throw new ForbiddenException("Permission not allowed")
            }
            req['user'] = decoded.sub
            next()

        }
    }
}