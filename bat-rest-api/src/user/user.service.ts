import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { GoogleJwtPayloadI } from '../auth/interfaces/google-jwt-payload.interface';
import { JwtPayloadI } from '../auth/interfaces/jwt-payload.interface';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { IAuthUser } from '../core/authentication/interfaces/authenticateduser';
import { UserServiceErrors, UserServiceInfo } from '../core/chain/logging.enum';
import { RegisterHelper } from '../core/chain/registerhelper';
import { IGoogleUser } from './interfaces/google-user.interface';
import { IUser } from './interfaces/user.interface';
import { CreateGoogleUserDto } from './models/create-google-user.model';
import { CreateUserDto } from './models/create-user.model';
import { LoginUserDto } from './models/login-user.model';
import { AddAdminDto } from './models/add-admin';
import { UserDto } from './models/user.model';

@Injectable()
export class UserService {
    /**
     * Creates an instance of UserService.
     * @param {RegisterHelper} registerHelper
     * @memberof UserService
     */
    constructor(private registerHelper: RegisterHelper,
        @Inject('USER_MODEL') private readonly userModel: Model<IUser>,
        @Inject('GOOGLE_USER_MODEL') private readonly googleUserModel: Model<IGoogleUser>,
        private readonly jwtService: JwtService) { }

    /**
     * Create new user
     *
     * @param {CreateUserDto} userDto
     * @param {IAuthUser} authUser
     * @returns {Promise<any>}
     * @memberof UserService
     */
    async registerUser(userDto: CreateUserDto, authUser: IAuthUser): Promise<any> {
        try {
            // Saving the User information in mongoDB
            const newCustomer: CreateUserDto = {
                username: userDto.username,
                password: userDto.password,
                employeeId: userDto.employeeId
            };
            const createUser = new this.userModel(newCustomer);
            await createUser.save();
            // Registering the User with the Certification Authority
            return this.registerHelper.registerUser(userDto.username, userDto.employeeId)
                .then((response) => {
                    return ResponseUtility.generateSuccessResponse(UserServiceInfo.USER_REGISTRATION_SUCCESS);
                })
                .catch((error) => {
                    Logger.error(error);
                    return (ResponseUtility.generateErrorResponse(UserServiceErrors.USER_REGISTRATION_FAILED));
                });
        } catch (error) {
            Logger.log(error);
            return ResponseUtility.generateErrorResponse(UserServiceErrors.USER_REGISTRATION_FAILED);
        }
    }

    /**
     * Create new user
     *
     * @param {CreateUserDto} userDto
     * @param {IAuthUser} authUser
     * @returns {Promise<any>}
     * @memberof UserService
     */
    async registerGoogleUser(userDto?: CreateGoogleUserDto, addAdminDto?: AddAdminDto, authUser?: IAuthUser): Promise<any> {
        try {
            let user;
            if (addAdminDto != null) {
                user = await this.googleUserModel.findOneAndUpdate({ email: addAdminDto.userToAdmin }, { $set: { role: 'admin' } }, { new: true });
                if (user == null) { return ResponseUtility.generateErrorResponse(UserServiceInfo.USER_MUST_BE_REGISTERED); }
                return ResponseUtility.generateSuccessResponse(UserServiceInfo.ADMIN_CREATION_SUCCESS);
            }
            user = await this.googleUserModel.findOne({ email: userDto.email }).exec();
            if (user != null) {
                const payload: GoogleJwtPayloadI = { email: user.email, photoUrl: user.photoUrl, role: user.role };
                return this.createJwtPayload(payload);
            }
            // Saving the User information in mongoDB
            const newUser: CreateGoogleUserDto = {
                email: userDto.email,
                employeeId: userDto.employeeId,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                photoUrl: userDto.photoUrl,
                role: userDto.role
            };
            const createUser = new this.googleUserModel(newUser);
            createUser.save()
                .then((response) => {
                    Logger.log(response);
                    return ResponseUtility.generateSuccessResponse(UserServiceInfo.USER_REGISTRATION_SUCCESS);
                })
                .catch((error) => {
                    Logger.error(error);
                    return Promise.reject(ResponseUtility.generateErrorResponse(UserServiceErrors.USER_REGISTRATION_FAILED));
                });
            // Registering the User with the Certification Authority
            // return this.registerHelper.registerUser(userDto.username, userDto.employeeId)
            //     .then((response) => {
            //         return ResponseUtility.generateSuccessResponse(UserServiceInfo.USER_REGISTRATION_SUCCESS);
            //     })
            //     .catch((error) => {
            //         return Promise.reject(ResponseUtility.generateErrorResponse(UserServiceErrors.USER_REGISTRATION_FAILED));
            //     });
        } catch (error) {
            return Promise.reject(ResponseUtility.generateErrorResponse(UserServiceErrors.USER_REGISTRATION_FAILED));
        }
    }

    /**
     * Get device by id
     *
     * @returns {Promise<CreateUserDto>}
     * @memberof UserService
     */
    async loginUser(loginUserDto: LoginUserDto): Promise<any> {
        try {
            let user = await this.userModel.findOne({ username: loginUserDto.username }).exec();
            if (user == null || loginUserDto.password != user.password) {
                return ResponseUtility.generateErrorResponse(UserServiceErrors.INVALID_USER_CREDENTIALS);
            }
            return this.registerHelper.loginUser(loginUserDto.username).then(
                (userFromStore) => {
                    if (!userFromStore) {
                        return ResponseUtility.generateErrorResponse(UserServiceErrors.USER_NOT_ENROLLED_WITH_CA);
                    }
                    const payload: JwtPayloadI = { username: user.username, employeeId: user.employeeId };
                    return this.createJwtPayload(payload);
                }
            );
        } catch (error) {
            return Promise.reject(ResponseUtility.generateErrorResponse(UserServiceErrors.USER_LOGIN_FAILED));
        }
    }

    createJwtPayload(user: any) {
        let jwt = this.jwtService.sign(user);
        return { token: jwt };
    }

    /**
     * 
     * @param username 
     */
    async isUserRegisteredOnDb(username: string): Promise<any> {
        try {
            let user = await this.userModel.findOne({ username: username }).exec();
            if (user == null) { return ResponseUtility.generateErrorResponse(UserServiceErrors.USER_LOGIN_FAILED); }
            return ResponseUtility.generateSuccessResponse(UserServiceInfo.USER_LOGIN_SUCCESS);
        } catch (error) {
            Logger.error(error);
            return ResponseUtility.generateErrorResponse(UserServiceErrors.USER_LOGIN_FAILED);
        }
    }

    async getAllUser(email: string): Promise<any> {
        try {
            const users = await this.googleUserModel.find({email: { $regex: email }}).exec();
            return ResponseUtility.generateSuccessResponse(users);
        } catch (error) {
            return ResponseUtility.generateErrorResponse('an error occurred');
        }
    }
}
