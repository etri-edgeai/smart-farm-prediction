import { Request } from 'express';
import * as rawbody from 'raw-body';

export class StringUtils {
  static isNumeric(n) {
    return n != "" && !isNaN(+n);
  }
  static toNumber(n) {
    return this.isNumeric(n) ? +n : null;
  }

  /**
   * get raw body or parsed body
   * @param req 
   * @returns 
   */
  static async getJsonBody(req: Request) {
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);
      const text = raw.toString().trim();
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(e.message + ": " + text);
      }

    } else {
      return req.body;
    }
  }
}