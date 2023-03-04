import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { ethers } from 'ethers';
import express from 'express';
import multer from 'multer';
import { NFTStorage, File } from "nft.storage";
import PromiseDoc, { IPromise, PromiseData } from '../../../models/db/promise.model';
import { ErrorCode } from '../../../models/error-code.model';
import nanoidService from '../../../services/id-generators/nanoid.service';

const router = express.Router();

const upload = multer();

const rawDocBucketName = process.env.NODE_ENV === 'development' || process.env.TESTNET ? 'proof_of_promise_dev' : 'proof_of_promise';

/*
* START: CRUD
*/
// Create
router.post(
    '/upload',
    upload.single('uploaded-image'),
    async (req: express.Request, res: express.Response) => {
        const nftStorageKey = process.env.NFT_STORAGE_API_KEY;

        const fileId = nanoidService.generate();

        const cloud_image = 'https://storage.googleapis.com/proof_of_promise/pop-logo.png';

        let imageFile;
        if (cloud_image) {
            const fileType = cloud_image.split(/[#?]/)[0].split('.').pop()!.trim();

            const { data } = await axios.get(cloud_image, { responseType: 'arraybuffer' });

            imageFile = new File([data], `${fileId}.${fileType}`, {
                type: `image/${fileType}`,
            });
        } else if (req.file) {

        }
        else {
            res.json({ errorCode: ErrorCode.invalidRequest });
        }

        const metadata: any = {
            name: req.body.name,
            description: req.body.description ? req.body.description : '',
            image: imageFile,
        }

        if (req.body.attributes) {
            metadata.attributes = JSON.parse(req.body.attributes);
        }

        if (req.body.external_url) {
            metadata.external_url = req.body.external_url;
        }

        let tokenUrl: string;

        if (req.file) {
            // Store backup to gcloud
            const file = req.file as Express.Multer.File;

            const storage = new Storage();
            const fileExtension = file.mimetype.split('/')[1];
            const fileName = `token-files/${fileId}.${fileExtension}`;

            metadata.external_url = `https://storage.googleapis.com/${rawDocBucketName}/${fileName}`;

            // Save to IPFS
            const client = new NFTStorage({ token: nftStorageKey as string });
            const token = await client.store(metadata);

            tokenUrl = token.url;

            const blob = storage.bucket(rawDocBucketName).file(fileName);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', err => {
                console.log('blob stream error: ', err);
                res.json({ errorCode: ErrorCode.storageServerError });
            });

            blobStream.on('finish', async () => {
                metadata.image = cloud_image;
                res.json({
                    success: {
                        uri: token.url,
                        metadata,
                    }
                });
            });

            blobStream.end(file.buffer);
        }
        else {
            // Save to IPFS
            const client = new NFTStorage({ token: nftStorageKey as string });
            const token = await client.store(metadata);

            tokenUrl = token.url;

            metadata.image = cloud_image;
            res.json({
                success: {
                    uri: token.url,
                    metadata,
                }
            });
        }

        const receivers = req.body.receivers;
        let receiversArr = [];
        if (receivers && receivers.length) {
            receiversArr = receivers.split(',');
        }

        metadata.image = 'https://storage.googleapis.com/proof_of_promise/pop-logo.png';

        const promiseData: PromiseData = {
            burnAuth: req.body.burnAuth,
            created: Date.now(),
            creator: req.body.creator,
            price: req.body.price,
            metadata,
            restricted: false,
            tokenUri: tokenUrl,
            promiseHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${tokenUrl}:${req.body.creator}`))
        }

        if (receiversArr && receiversArr.length) {
            promiseData.restricted = true;
            promiseData.receivers = receiversArr;
        }

        // save to DB here
        const promise: IPromise = new PromiseDoc(promiseData);
        await promise.save();
    });
// Read

// Update

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
