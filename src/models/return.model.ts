export interface ReturnMethod { 
    custom: Function;
    exists: Function;
    invalid: Function;
    unauthorized: Function;
}

export enum ReturnServiceType {
    custom = 'custom',
    exists = 'exists',
    invalid = 'invalid',
    unauthorized = 'unauthorized',
}
