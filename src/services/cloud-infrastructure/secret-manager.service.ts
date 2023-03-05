import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const parent = 'projects/proof-of-promise';

class SecretManagerService {

    public init() {
        if (process.env.NODE_ENV === 'development') {
            return;
        }

        return new Promise<void>(async (resolve) => {
            const [secrets] = await client.listSecrets({
                parent: parent,
            });
    
            for (const secret of secrets) {
                if (secret.name) {
                    const secretNameSplit = secret.name.split('/');
                    const envName = secretNameSplit[secretNameSplit.length - 1];
    
                    const [version] = await client.accessSecretVersion({
                        name: `${secret.name}/versions/latest`,
                    });

                    
                    
                    const payload = version.payload?.data?.toString();                    
                    process.env[envName] = payload;
                }
            }
    
            resolve(); 
        });
    }
}

export = new SecretManagerService();
