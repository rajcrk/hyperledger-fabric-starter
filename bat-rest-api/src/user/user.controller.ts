import { Body, Controller, NotFoundException, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { ApiOAuth2Auth, ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvokeResult } from '../common/utils/invokeresult.model';
import { CreateUserDto } from './models/create-user.model';
import { LoginUserDto } from './models/login-user.model';
import { UserService } from './user.service';
import { CreateGoogleUserDto } from './models/create-google-user.model';
import { RolesGuard } from './guard/roles.guard';
import { AddAdminDto } from './models/add-admin';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './models/user.model';

@ApiUseTags('users')
@Controller('user')
export class UserController {

    /**
     * creates an instance of UserService.
     * @memberof UserController
     * @param {UserService} userService
     */
    constructor(private readonly userService: UserService) {
    }

    // /**
    //  * Register a new User
    //  *
    //  * @param {CreateUserDto} createUserDto
    //  * @param req
    //  * @returns {*}
    //  * @memberof UserController
    //  */
    // @Post('register')
    // @ApiOperation({title: 'register a new user'})
    // @ApiResponse({
    //     status: 201,
    //     description: 'The user has been successfully registered.',
    // })
    // @ApiOAuth2Auth(['write'])
    // registerUser(@Body() createUserDto: CreateUserDto, @Req() req): Promise<any> {
    //     return this.userService.registerUser(createUserDto, req.auth);
    // }

    // /**
    //  * Login User
    //  *
    //  * @returns {Promise<DeviceDto[]>}
    //  * @memberof DeviceController
    //  * @param id
    //  */
    // @Post('login')
    // @ApiOperation({title: 'Login User with username and password along with their creds'})
    // @ApiResponse({
    //     status: 200,
    //     description: 'Returns a User object',
    //     type: CreateUserDto,
    // })
    // @ApiResponse({
    //     status: 404,
    //     description: 'User does not exist!',
    //     type: NotFoundException
    // })
    // loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    //     return this.userService.loginUser(loginUserDto);
    // }

    /**
     * Register a new User
     *
     * @param {CreateUserDto} createGoogleUserDto
     * @param req
     * @returns {*}
     * @memberof UserController
     */
    @Post('register-with-google')
    @ApiOperation({title: 'register a new user'})
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully registered.',
    })
    @ApiOAuth2Auth(['write'])
    registerGoogleUser(@Body() createGoogleUserDto: CreateGoogleUserDto, @Req() req): Promise<any> {
        createGoogleUserDto.role = 'user';
        return this.userService.registerGoogleUser(createGoogleUserDto, null, req.auth);
    }

    /**
     * add a new user as admin
     * this end point is only accessible by a super admin
     * @param {CreateUserDto} createAdminUserDto
     * @param req
     * @returns {*}
     * @memberof UserController
     */
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('add-admin')
    @UseGuards(RolesGuard)
    @ApiOperation({title: 'add a new admin'})
    @ApiResponse({
        status: 201,
        description: 'admin has been successfully created.',
    })
    @ApiOAuth2Auth(['write'])
    addAdmin(@Body() createAdminUserDto: AddAdminDto, @Req() req): Promise<any> {
        // createAdminUserDto.role = 'admin';
        return this.userService.registerGoogleUser(null, createAdminUserDto, req.auth);
    }

    /**
     * get all device users
     *
     * @returns {Promise<UserDto[]>}
     * @memberof UserController
     * @param ownerId
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/:email')
    @ApiOperation({ title: 'Get all user information' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns an array of users',
        type: UserDto,
    })
    @ApiResponse({
        status: 404,
        description: 'No User exits',
        type: NotFoundException
    })
    getDeviceByOwnerId(@Param('email') email: string): Promise<any> {
        return this.userService.getAllUser(email);
    }

}