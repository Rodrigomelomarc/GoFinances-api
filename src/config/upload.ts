import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
  fileFilter(request: Request, file: Express.Multer.File, callback: Function) {
    const ext = path.extname(file.originalname);
    if (ext !== '.csv') {
      return callback(new Error('Only CSV files allowed'));
    }
    callback(null, true);
  },
};
