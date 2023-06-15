import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseHandler {
  public static ok(data: string | object) {
    throw new HttpException(data, HttpStatus.OK);
  }

  public static conflict(data: string | object) {
    throw new HttpException(data, HttpStatus.CONFLICT);
  }

  public static notFound(data: string | object) {
    throw new HttpException(data, HttpStatus.NOT_FOUND);
  }
}
