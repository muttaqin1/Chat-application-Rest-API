import ApiSuccessResponse from '@helpers/ApiResponse/ApiSuccessResponse';
import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import TYPES from '@ioc/TYPES';
import { Response } from 'express';
import Request from '@interfaces/request';
import { inject } from 'inversify';
import IAuthService from '@interfaces/service/IAuthService';
import {
  controller,
  httpDelete,
  httpPost,
  request,
  response,
  httpPut
} from 'inversify-express-utils';
import IAuthController from '@interfaces/controller/IAuthController';
import { validateSchema as validate } from '@middlewares/validators/validateSchema';
import {
  loginSchema,
  signupSchema,
  tokenRefreshSchema
} from '@middlewares/validators/schema/auth';
import { deserializeUser } from '@auth/deserializeUser';
import { signupLimiter } from '@middlewares/rateLimit';

@controller('/v1/auth')
export default class UserController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  @httpPost('/login', validate(loginSchema))
  public async login(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const { userName, email, password } = req.body;
    const responseData = await this.authService.login({
      userName,
      email,
      password
    });
    new ApiSuccessResponse(res).send<loginResponse>(responseData);
  }

  @httpPost('/signup', signupLimiter, validate(signupSchema))
  public async signup(@request() req: Request, @response() res: Response) {
    const { userName, firstName, lastName, email, password, gender, avatar } =
      req.body;

    const responseData = await this.authService.signup({
      userName,
      firstName,
      lastName,
      email,
      password,
      gender,
      avatar
    });
    new ApiSuccessResponse(res).send<singupResponse>(responseData);
  }

  @httpDelete('/logout', deserializeUser)
  public async logout(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    await this.authService.logout(req.user);
    new ApiSuccessResponse(res).send({ message: 'logout success' });
  }

  @httpPut('/token-refresh', deserializeUser, validate(tokenRefreshSchema))
  public async tokenRefresh(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const responseData = await this.authService.refreshAccessToken(req);
    new ApiSuccessResponse(res).send(responseData);
  }
}
