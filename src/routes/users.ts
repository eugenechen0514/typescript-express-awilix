import express from 'express';
import {Request, Response, NextFunction} from 'express';
import { makeInvoker } from 'awilix-express';
import {Config} from '../config'

function makeAPI({ config }: {config: Config}) {
  return {
    getUser: (req: Request, res: Response, next: NextFunction) => {
      res.json({version: config.server.version});
    },
  }
}

const api = makeInvoker(makeAPI);
const router = express.Router();
router.get('/', api('getUser'));

export default router;
