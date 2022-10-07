import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

const edgeResolvePath = (file: string) => path.resolve(path.join(__dirname, '..', `frontend/edge-mon/${file.replace('edge/', '')}`));

@Injectable()
export class EdgeMonMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { url } = req;
    if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
      // it has a file extension --> resolve the file
      res.sendFile(edgeResolvePath(url));
    } else {
      // in all other cases, redirect to the index.html!
      res.sendFile(edgeResolvePath('index.html'));
    }
  }
}
