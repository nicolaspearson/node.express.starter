import Boom from 'boom';

import { Token } from '@/common/models/token.model';
import { logger } from '@/logger';

export function getJwtFromRequest(tokenString: string): Api.Jwt {
  try {
    const base64Payload = tokenString.split('.')[1];
    const decodedPayload = Buffer.from(base64Payload, 'base64');
    const jwt: Api.Jwt = JSON.parse(decodedPayload.toString());
    // We need our payload to always have the following properties
    if (!jwt.id) {
      // Use a generic error message
      throw new Error('Malformed payload');
    }
    new Token(tokenString).verifyToken();
    return jwt;
  } catch (error) {
    logger.debug(`Request is missing a valid jwt: ${error.message}`);
    throw Boom.unauthorized('Invalid jwt provided.');
  }
}
