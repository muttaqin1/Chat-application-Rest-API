import { corsURL } from '@config/index';
import { ForbiddenError } from '@helpers/AppError/ApiError';

export const customOrigin = (origin: any, cb: any) =>
  origin === corsURL || !origin
    ? cb(null, true)
    : cb(new ForbiddenError('Not allowed by CORS'));
