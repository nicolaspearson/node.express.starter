import { Boom } from '@hapi/boom';

export interface HttpException extends Boom {
  status?: number;
}
