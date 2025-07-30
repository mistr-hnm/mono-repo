import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()           
        
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

        response.status(status).json({
            status : false,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.originalUrl,
        });
    }
}