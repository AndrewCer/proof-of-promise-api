import express from 'express';
const router = express.Router();

import { router as contractRoutes } from './routes/v1/contract.controller';
import { router as fileRotues } from './routes/v1/file.controller';

// Contract
router.use('/v1/contract', contractRoutes);

// File
router.use('/v1/file', fileRotues);

export { router }
