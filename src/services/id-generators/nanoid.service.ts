/*
* Service for generating random ids.
* 14 characters with the below alphabet would require ~57 thousands years to have a 1% probability of at least one collision.
*/

import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

class NanoidService {

    private idGen = customAlphabet(alphabet, 21); // used for ids/codes application wide
    private apiGen = customAlphabet(alphabet, 32); // used for api keys

    public generate() {
        return this.idGen();
    }

    public generateApiKey() {
        return this.apiGen();
    }
}

export = new NanoidService();
