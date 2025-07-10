import { Injectable, NestMiddleware } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request, Response, NextFunction } from 'express'
import { UnauthorizedException } from "src/lib/response-exceptions";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
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
        }else{
            const authHeader = req.headers['authorization']

            if (!authHeader  || !authHeader.toLowerCase().startsWith('bearer ')) {
                throw new UnauthorizedException();
            }
            const token = authHeader.split(' ')[1]
            try{
                const decoded = await this.jwtService.verifyAsync(token)
                
                req['user'] = decoded.sub;
                next()
            }catch(err){ 
                throw new UnauthorizedException(err?.message);
            }
        }
    }
}