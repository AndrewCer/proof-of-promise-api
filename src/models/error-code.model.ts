export enum ErrorCode {
    contractMethodMissing = 'Contract method does not exist',
    database = 'Database error',
    entityExists = 'Entity already exists',
    entityDoesntExist = 'Entity does NOT exists',
    entityNotFound = 'Entity not found', // Different from entityDoesntExist. As the entity may exist but the specific query resulted in a null
    inputTextTooLong = 'Input text too long',
    inputTextTooShort = 'Input text too short',
    invalidRequest = 'Invalid request',
    invalidToken = 'Invalid token',
    noDataReturned = 'No data was returned', // Use when the model doesn't return any data.
    notEnoughPoints = 'Not enough points',
    unauthorized = 'Unauthorized',
    integrationServerError = '500 integration server error',
    storageServerError = 'Storage server error', // Use when cloud storage errors happen
    txnError = 'Error while submitting transaction',
}
