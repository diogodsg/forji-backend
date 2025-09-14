import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    req.requestId = req.headers["x-request-id"] || randomUUID();
    next();
  }
}
