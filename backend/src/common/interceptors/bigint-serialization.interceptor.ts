import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function serialize(value: any): any {
  if (value === null || value === undefined) return value;
  const t = typeof value;
  if (t === "bigint") return value.toString();
  if (t === "string" || t === "number" || t === "boolean") return value;
  if (value instanceof Date) {
    // Preserva precisão e formato ISO (ou null se inválida)
    return isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (Array.isArray(value)) return value.map(serialize);
  if (t === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = serialize(v);
    return out;
  }
  return value;
}

@Injectable()
export class BigIntSerializationInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => serialize(data)));
  }
}
