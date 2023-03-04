import express from 'express';

import { ErrorCode } from '../../models/error-code.model';
import { ReturnMethod, ReturnServiceType } from '../../models/return.model';

const returnTypes: ReturnMethod = {
    custom: (res: express.Response, errorCode: ErrorCode) => {
        return res.json({ errorCode });
    },
    exists: (res: express.Response) => {
        return res.json({ errorCode: ErrorCode.entityExists });
    },
    invalid: (res: express.Response) => {
        return res.json({ errorCode: ErrorCode.invalidRequest });
    },
    unauthorized: (res: express.Response, msg?: string) => {
        return res.json({ errorCode: ErrorCode.unauthorized });
    },
}

class ReturnService {
    public sendResponse(type: ReturnServiceType, res: express.Response) {
        return returnTypes[type](res);
    }

    public sendCustomResponse(type: ReturnServiceType, res: express.Response, error: ErrorCode) {
        return returnTypes[type](res, error);
    }
}

export = new ReturnService();
