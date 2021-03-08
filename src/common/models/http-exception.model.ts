import Boom from 'boom';

export interface HttpException extends Boom {
  status?: number;
}
