import { FilterQuery } from 'mongoose';

import PromiseDoc, { IPromise, PromisePropertyFilter } from '../../models/db/promise.model';

class PromiseDbService {
    /*
    * START: CRUD
    */
    // Create

    // Read
    async exists(filterQuery: FilterQuery<any>) {
        return await PromiseDoc.exists(filterQuery);
    }

    async findLean(filterQuery: FilterQuery<any>, propertyFilter: PromisePropertyFilter) {
        return await PromiseDoc.find(filterQuery).select(propertyFilter).lean().exec();
    }

    async findOne(filterQuery: FilterQuery<any>, propertyFilter: PromisePropertyFilter) {
        return await PromiseDoc.findOne(filterQuery).select(propertyFilter).exec();
    }
    async findOneLean(filterQuery: FilterQuery<any>, propertyFilter: PromisePropertyFilter) {
        return await PromiseDoc.findOne(filterQuery).select(propertyFilter).lean().exec();
    }

    // Update
    async bulkSave(documents: IPromise[]) {
        return await PromiseDoc.bulkSave(documents);
    }

    // Delete

    /*
    * END: CRUD
    */
}

export = new PromiseDbService();
