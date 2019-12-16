import { Injectable, CanActivate, ExecutionContext, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class RolesGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const superAdminList = ['skumar@ztech.io', 'rkumar@ztech.io'];

    const request = context.switchToHttp().getRequest();
    let token: any = jwtDecode(request.headers.authorization.split(' ')[1]);
    console.log('token is ==> ', token);
    if (superAdminList.indexOf(token.email) > -1 && token.role == 'admin') {
      return true;
    }
    return false;
  }
}