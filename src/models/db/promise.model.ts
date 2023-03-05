import mongoose, { Schema, Document } from 'mongoose';
import { BurnAuth } from '../burn-auth.model';
import { Chain } from '../chain.model';

export enum PromisePropertyFilter {
    admin = '-_id -__v',
    public = '-_id -__v',
    server = '',
}

interface TokenAttributes {
    trait_type: string;
    value: string | number;
}

export interface Metadata {
    description: string;
    image: string | File;
    name: string;
    attributes?: TokenAttributes;
    external_url?: string;
}

export interface PromiseData {
    burnAuth: BurnAuth;
    chain: Chain;
    created: number;
    creator: string;
    price: number;
    restricted: boolean;
    tokenUri: string;
    promiseHash: string; // `${tokenUri}:${addr1.address}`
    metadata: Metadata;
    signers?: string[]; // Anyone that signs the Promise
    receivers?: string[]; // Optional but toggles restricted = true if pressent
}

export interface IPromise extends Document {
    burnAuth: BurnAuth;
    chain: Chain;
    created: number;
    creator: string;
    price: number;
    restricted: boolean;
    tokenUri: string;
    promiseHash: string; // `${tokenUri}:${addr1.address}`
    metadata: Metadata;
    signers?: string[];
    receivers?: string[];
}

const PromiseSchema = new Schema<IPromise>({
    burnAuth: {
        type: Number,
        required: true,
    },
    chain: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    price: Number,
    restricted: Boolean,
    tokenUri: {
        type: String,
        required: true,
    },
    promiseHash: {
        type: String,
        required: true,
        index: true,
    },
    metadata: {
        type: Schema.Types.Mixed,
        required: true,
    },
    signers: [{
        type: String
    }],
    receivers: [{
        type: String
    }]
    
});

export default mongoose.model<IPromise>('Promise', PromiseSchema);
