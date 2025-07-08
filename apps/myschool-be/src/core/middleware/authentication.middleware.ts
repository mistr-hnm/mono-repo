import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['myschool-signature'] || req.headers['myschool-signature'] != process.env.API_KEY) {
            return res.status(400).send({
                message: "Invalid Secret Key!!",
                code: "INVALID_REQUEST"
            });
        }
        // console.log("authorization",req.headers['authorization']);
        next();
    }
}