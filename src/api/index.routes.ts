import express from 'express';
const router = express.Router();

import { router as fileRotues } from './routes/v1/file.controller';

// File
router.use('/v1/file', fileRotues);

export { router }
