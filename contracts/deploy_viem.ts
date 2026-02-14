import { createPublicClient, createWalletClient, http, parseEther, parseUnits, Hash, Hex, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { tempoTestnet } from '../src/lib/chains';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.moderato.tempo.xyz";

const account = privateKeyToAccount(PRIVATE_KEY);

const publicClient = createPublicClient({
    chain: tempoTestnet,
    transport: http(RPC_URL)
});

const walletClient = createWalletClient({
    account,
    chain: tempoTestnet,
    transport: http(RPC_URL)
});

async function deployContract(name: string, abi: any, bytecode: Hex, args: any[] = []) {
    console.log(`Deploying ${name}...`);

    // We use a lower level sendTransaction to ensure we can inject the custom fields
    // if standard deploy/writeContract doesn't support them easily with custom types.
    // Actually, Viem's deployContract supports 'type' and additional fields in 'request'.

    try {
        const hash = await walletClient.deployContract({
            abi,
            bytecode,
            args,
            type: '0x76' as any,
            // @ts-ignore
            nonceKey: 0n, // Deployment usually safe on lane 0
            // For deployment, we might need a feeToken that already exists.
            // If we don't have one, we might have to use legacy/base type if possible.
            // Let's try without feeToken first or use native.
        });

        console.log(`${name} tx sent: ${hash}`);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`${name} deployed at: ${receipt.contractAddress}`);
        return receipt.contractAddress;
    } catch (error) {
        console.error(`Failed to deploy ${name}:`, error);

        // Retry with Legacy if 0x76 fails for CREATE
        console.log("Retrying with Legacy type...");
        const hash = await walletClient.deployContract({
            abi,
            bytecode,
            args,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`${name} deployed (Legacy) at: ${receipt.contractAddress}`);
        return receipt.contractAddress;
    }
}

async function main() {
    // Load artifacts from foundry build
    const laneManagerArtifact = JSON.parse(readFileSync(join(__dirname, 'out/LaneManager.sol/LaneManager.json'), 'utf8'));

    const usdcAddr = "0x17a11d214eba12457422a2949b4d70ec06744ca7";
    const ethAddr = "0x5c60b4b4d7f51806c59044d3b24e78862b99b0c7";
    const laneAddr = await deployContract("LaneManager", laneManagerArtifact.abi, laneManagerArtifact.bytecode.object, []);

    console.log("\nRedeployment Summary (USDC and ETH kept):");
    console.log(`USDC_ADDRESS=${usdcAddr}`);
    console.log(`ETH_WRAPPER_ADDRESS=${ethAddr}`);
    console.log(`LANE_MANAGER_ADDRESS=${laneAddr}`);
}

main().catch(console.error);
