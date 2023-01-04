import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto } from '../users/dtos/user.dto';
import { plainToClass } from 'class-transformer';

export class SerialInterceptors implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run Something before a request is handled by the request handler
    // console.log('Im Running before the handler', context);
    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
