import express from 'express';
import mongoose from 'mongoose';

class MongoConnectionService {

    public async connect() {
        const options = {}

        const mongoDB = await this.getConnectionString();
        mongoose.set("strictQuery", false);
        mongoose.connect(mongoDB, options);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => {
            console.log(`Mongo connection state: ${mongoose.connection.readyState}`);
            console.log(`Successfully connect to MongoDB: ${db.name}`);
        });

        console.log(`Mongo connection state: ${mongoose.connection.readyState}`);
    }

    private async getConnectionString(): Promise<string> {
        if (process.env.TESTNET) {
            return process.env.TESTNET_DB_CONNECTION_STRING as string;
        }

        if (process.env.NODE_ENV === 'development') {
            return process.env.TEST_DB_CONNECTION_STRING as string;
        }

        return process.env.MONGO_CONNECTION_STRING as string;
    }
}

export = new MongoConnectionService();
