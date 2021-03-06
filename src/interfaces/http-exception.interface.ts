import Boom from 'boom';

export default interface HttpException extends Boom {
  status?: number;
}
