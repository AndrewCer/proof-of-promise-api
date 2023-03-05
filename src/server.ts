// How we're setting this project up:
// https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf

/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

dotenv.config();

import { router as apiRoutes } from './api/index.routes';

import { globalOrigins } from './models/global.model';
import mongoConnectionService from './services/cloud-infrastructure/mongo-connection.service';
import secretManagerService from './services/cloud-infrastructure/secret-manager.service';



// ** CORS Policy **
const corsOptions: cors.CorsOptions = {
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: function (origin, callback) {
        let origins = globalOrigins;

        if (process.env.NODE_ENV === 'development') {
            origins.push('http://localhost:4200');
            origins.push('http://localhost:4201');
            origins.push('http://192.168.50.9:4200');
            origins.push('http://192.168.50.9:4201');
        }

        callback(null, origins);
    },
    preflightContinue: false,
};


/**
 * App Variables
 */

const PORT = process.env.PORT || 8080;

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());

app.use(express.json());
app.disable('x-powered-by');

/**
 * Gcloud warmup endpoint
 */
app.get('/_ah/warmup', (req, res) => {
    res.status(200).end();
});

/**
 * Routes
 */
app.use('/api', cors(corsOptions), apiRoutes);

app.get('*', (req, res) => {
    res.redirect('https://testnet-proofofpromise.xyz');
});

/**
 * Server Activation
 */
const server = app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);

    await secretManagerService.init();
    await mongoConnectionService.connect();
});
