import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.moderato.tempo.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const LANE_MANAGER_ADDRESS = "0xF5Cd4eb6fCB99AceD9Ef7184E865caE99f5DcFAf";
const USDC_ADDRESS = "0xBD3dAc5467eC691709798844B36D3dDAc484Fe20";
const ETH_WRAPPER_ADDRESS = "0xc91DE334276fEA6DC52f1b20c7d9576B9697A33c";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Testing with wallet:", wallet.address);

    const erc20Abi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function balanceOf(address account) public view returns (uint256)",
        "function decimals() public view returns (uint8)"
    ];

    const laneManagerAbi = [
        "function executeTrade(uint256 laneId, uint256 expectedNonce, bytes32 orderHash, address tokenIn, uint256 amountIn, uint256 minAmountOut) external",
        "function laneNonces(uint256) public view returns (uint256)"
    ];

    const usdc = new ethers.Contract(USDC_ADDRESS, erc20Abi, wallet);
    const ceth = new ethers.Contract(ETH_WRAPPER_ADDRESS, erc20Abi, wallet);
    const laneManager = new ethers.Contract(LANE_MANAGER_ADDRESS, laneManagerAbi, wallet);

    console.log("Checking balances...");
    const usdcBalance = await usdc.balanceOf(wallet.address);
    console.log("USDC Balance:", ethers.formatUnits(usdcBalance, 6));

    console.log("Approving LaneManager...");
    const txApprove = await usdc.approve(LANE_MANAGER_ADDRESS, ethers.MaxUint256);
    await txApprove.wait();
    console.log("Approved.");

    const laneId = 1;
    const nonce = await laneManager.laneNonces(laneId);
    console.log("Current Nonce for Lane 1:", nonce.toString());

    console.log("Executing Trade (USDC -> cETH)...");
    const amountIn = ethers.parseUnits("10", 6); // 10 USDC
    const orderHash = ethers.id("test-order");

    const txTrade = await laneManager.executeTrade(
        laneId,
        nonce,
        orderHash,
        USDC_ADDRESS,
        amountIn,
        0, // minAmountOut
        {
            gasLimit: 1000000,
            type: 0 // legacy
        }
    );
    console.log("Trade Transaction Sent:", txTrade.hash);
    const receipt = await txTrade.wait();
    console.log("Trade Confirmed in block:", receipt.blockNumber);

    const newNonce = await laneManager.laneNonces(laneId);
    console.log("New Nonce for Lane 1:", newNonce.toString());

    const cethBalance = await ceth.balanceOf(wallet.address);
    console.log("New cETH Balance:", ethers.formatUnits(cethBalance, 18));
}

main().catch(console.error);
