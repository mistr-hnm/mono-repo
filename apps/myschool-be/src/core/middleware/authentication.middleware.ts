import { Injectable, NestMiddleware } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
    ){}


    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['myschool-signature'] || req.headers['myschool-signature'] != process.env.API_KEY) {
            return res.status(400).send({
                message: "Invalid Secret Key.",
                code: "INVALID_REQUEST"
            });
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
                    return res.status(400).send({
                        message: "Missing or invalid Authorization header",
                        code: "UNAUTHORIZED"
                    });
            }
            const token = authHeader.split(' ')[1]
            try{
                const decoded = this.jwtService.verify(token)
                req['user'] = decoded.sub;
                next()
            }catch(err){
                return res.status(400).send({
                    message: "Invalid or expired token",
                    code: "UNAUTHORIZED"
                });
            }
        }
    }
}