import { BigNumber, ethers } from 'ethers';

// Place NEW address here
import { jsonAbi } from '../../utils/abi/0x109f58Cb16Bc0A255458B6cB54489e5C5A3E39aD';

const isTestNet = (process.env.NODE_ENV === 'development' || process.env.TESTNET);

// Place NEW address here
const currentContractTestNet = '0x109f58Cb16Bc0A255458B6cB54489e5C5A3E39aD';
const currentContractMainNet = '';

// Place OLD address here
const historicalContractAddressesMainNet: string[] = [];
const historicalContractAddressesTestNet: string[] = [];

class PolygonWalletService {

    public contractAddress;
    public historicalContractAddresses = isTestNet ? historicalContractAddressesTestNet : historicalContractAddressesMainNet;
    public iface = new ethers.utils.Interface(jsonAbi);
    public sbtAbi = this.iface.format(ethers.utils.FormatTypes['full']);

    public nonceCounter: number = 0;

    constructor() {
        this.contractAddress = isTestNet ? currentContractTestNet : currentContractMainNet;
    }

    get provider() {
        console.log('running on network: ', isTestNet ? 'maticmum' : 'matic');
        return new ethers.providers.InfuraProvider(
            isTestNet ? 'maticmum' : 'matic',
            process.env.INFURA_API_KEY
        );
    }
    get signer() {
        return new ethers.Wallet({ address: process.env.SIGNER_ADDRESS as string, privateKey: process.env.SIGNER_KEY as string }, this.provider);
    }
    get contract() {
        return new ethers.Contract(this.contractAddress, this.sbtAbi, this.provider);
    }

    get contractFunctions() {
        return this.contract.functions;
    }

    public contractSigner() {
        return this.contract.connect(this.signer);
    }

    public createHash(str: string): string {
        return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
    }

    public async gasPrice(): Promise<BigNumber> {
        let price = await this.provider.getGasPrice();
        let gwei = ethers.utils.formatUnits(price, 'gwei');

        // Account for weird polygon shifts when the gas price is super low. It tends to swing way back up.
        if (parseFloat(gwei) < 30) {
            gwei = '35';
        }

        const difference = parseFloat(gwei.toString()) * 0.25;
        const increase = (parseFloat(gwei.toString()) + difference).toFixed(9);

        return ethers.utils.parseUnits(increase.toString(), 'gwei');
    }

    public resetToCurrentContract() {
        this.contractAddress = isTestNet ? currentContractTestNet : currentContractMainNet;
        const iface = new ethers.utils.Interface(jsonAbi);
        this.sbtAbi = iface.format(ethers.utils.FormatTypes['full']);
    }

    public async setHistoricContract(contractAddress: string) {
        this.contractAddress = contractAddress;
        const abiFile = await import(`../../utils/abi/${contractAddress}`) as any;
        this.iface = new ethers.utils.Interface(abiFile.jsonAbi || abiFile.jsonAbiMainNet);
        this.sbtAbi = this.iface.format(ethers.utils.FormatTypes['full']);
    }

    public async waitOneBlock() {
        let currentBlockNumber = await this.provider.getBlockNumber();

        await new Promise((resolve, reject) => {
            const blockListener = async (blockNumber: number) => {
                if (currentBlockNumber === blockNumber) {
                    this.provider.once('block', blockListener);
                    return;
                }

                resolve(true);
            };

            this.provider.once('block', blockListener);
        });
    }
}

export = new PolygonWalletService();
