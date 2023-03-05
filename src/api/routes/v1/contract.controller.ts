import express from 'express';
import { Chain } from '../../../models/chain.model';
import { PromisePropertyFilter } from '../../../models/db/promise.model';
import { ReturnServiceType } from '../../../models/return.model';
import promiseDbService from '../../../services/db/promise.db.service';
import returnService from '../../../services/return/return.service';
import baseWalletService from '../../../services/wallet/base-wallet.service';
import polygonWalletService from '../../../services/wallet/polygon-wallet.service';

const router = express.Router();

/*
* START: CRUD
*/
// Create

// Read
router.get(
    '/promise/:hash',
    async (req: express.Request, res: express.Response) => {
        const { hash } = req.params;

        const promise = await promiseDbService.findOneLean({ promiseHash: hash }, PromisePropertyFilter.public);
        if (!promise) {
            return returnService.sendResponse(ReturnServiceType.invalid, res);
        }

        res.json({
            success: promise
        });
    });

router.get(
    '/promises/:address',
    async (req: express.Request, res: express.Response) => {
        const { address } = req.params;

        const promise = await promiseDbService.findLean({ signers: address }, PromisePropertyFilter.public);
        if (!promise) {
            return returnService.sendResponse(ReturnServiceType.invalid, res);
        }

        res.json({
            success: promise
        });
    });

// Update
router.patch(
    '/promise/:hash',
    async (req: express.Request, res: express.Response) => {
        const { hash } = req.params;
        const { address } = req.body;

        const promise = await promiseDbService.findOne({ promiseHash: hash }, PromisePropertyFilter.server);
        if (!promise) {
            return returnService.sendResponse(ReturnServiceType.invalid, res);
        }

        let contractFunctions;
        let isSigner;
        if (promise.chain === Chain.polygon) {
            contractFunctions = polygonWalletService.contractFunctions;
            isSigner = await contractFunctions.signers(hash, address);
        }
        else {
            contractFunctions = baseWalletService.contractFunctions;
            // TODO(nocs): once infura base connection is fixed, can take this away
            isSigner = true;
        }

        if (isSigner) {
            if (!promise.signers) {
                promise.signers = [address];
            }
            else {
                promise.signers.push(address);
            }


            await promise.save();
        }

        res.json({
            success: isSigner
        });
    });
// Delete

/*
* END: CRUD
*/

/*
* START: Helper methods
*/

/*
* END: Helper methods
*/

export { router }
