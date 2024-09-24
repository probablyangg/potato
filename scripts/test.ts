import { GasPrice, SigningStargateClient, StargateClient, coins } from '@cosmjs/stargate';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { toBech32 } from '@cosmjs/encoding';
import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/amino'

// Mnemonic for the account you want to use
const key = process.env.PRIVATE_KEY!;
const address = 'xion1vmzvym7t4kn09lzmj9clxk24yanr08xfr6fghg'
const rpcEndpoint = 'https://rpc.xion-testnet-1.burnt.com:443';

//Tx info
const amount = coins('1', 'uxion');
const gasPrice = GasPrice.fromString("0uxion");
const txOptions = { gasPrice };

// The main function to create and use the SigningStargateClient
async function main() {
    // Creating a wallet instance from a given mnemonic
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(key,'hex'), "xion");

    // Fetching account from the wallet
    const [account] = await wallet.getAccounts();
    const sender = toBech32("xion",rawSecp256k1PubkeyToRawAddress(account.pubkey))

    // Creating an instance of SigningStargateClient
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, txOptions);

    // Defining recipient and coins to be transferred
    const recipient = address;

    // Broadcasting the transaction
    const result = await client.sendTokens(sender, recipient, amount, "auto", "sending a msg!");

    console.log(result);
}

main().catch(console.error);