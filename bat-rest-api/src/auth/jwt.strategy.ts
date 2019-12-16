import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Log } from '../common/utils/logging/log.service';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { JwtValidation } from '../core/chain/logging.enum';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants/auth.constants';
import { JwtPayloadI } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JwtPayloadI) {
        // TODO: Need to add in proper validation of token
        Log.config.info(`Entering validate of ${this.constructor.name}`);
        let response = await this.userService.isUserRegisteredOnDb(payload.username);
        if (!response.isSuccess) {
            return ResponseUtility.generateErrorResponse(JwtValidation.INVALID_JWT);
        }
        return ResponseUtility.generateSuccessResponse(JwtValidation.VALID_JWT);
    }
}