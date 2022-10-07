import { ArgumentsHost, Catch, ExceptionFilter, HttpAdapterHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { IncomingMessage } from "http";
import { ResponseBody } from "./response-body";

/**
 * transform microservice RpcException to HttpException
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = exception.status;
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : 
      status && Number.isInteger(status) ? status : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = new ResponseBody(httpStatus, exception.message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    const req: any = ctx.getRequest<IncomingMessage>();
    Logger.error(req.realIp, req.url, req.body, JSON.stringify(responseBody));
  }
}