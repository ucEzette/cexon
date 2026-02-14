export const LANE_MANAGER_ADDRESS = "0x7fafa41d52efa6ad03cb51a877602f6cb0cc5431" as const;
export const USDC_ADDRESS = "0x17a11d214eba12457422a2949b4d70ec06744ca7" as const;
export const ETH_WRAPPER_ADDRESS = "0x5c60b4b4d7f51806c59044d3b24e78862b99b0c7" as const;

export const LANE_MANAGER_ABI = [
    {
        "type": "function",
        "name": "executeTrade",
        "inputs": [
            { "name": "laneId", "type": "uint256", "internalType": "uint256" },
            { "name": "expectedNonce", "type": "uint256", "internalType": "uint256" },
            { "name": "orderHash", "type": "bytes32", "internalType": "bytes32" },
            { "name": "tokenIn", "type": "address", "internalType": "address" },
            { "name": "tokenOut", "type": "address", "internalType": "address" },
            { "name": "amountIn", "type": "uint256", "internalType": "uint256" },
            { "name": "minAmountOut", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "initializePool",
        "inputs": [
            { "name": "tokenA", "type": "address", "internalType": "address" },
            { "name": "tokenB", "type": "address", "internalType": "address" },
            { "name": "initialPrice", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addLiquidity",
        "inputs": [
            { "name": "token", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidity",
        "inputs": [
            { "name": "token", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "userLiquidity",
        "inputs": [
            { "name": "", "type": "address", "internalType": "address" },
            { "name": "", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "pools",
        "inputs": [{ "name": "poolId", "type": "bytes32", "internalType": "bytes32" }],
        "outputs": [
            { "name": "tokenA", "type": "address", "internalType": "address" },
            { "name": "tokenB", "type": "address", "internalType": "address" },
            { "name": "reserveA", "type": "uint256", "internalType": "uint256" },
            { "name": "reserveB", "type": "uint256", "internalType": "uint256" },
            { "name": "price", "type": "uint256", "internalType": "uint256" },
            { "name": "exists", "type": "bool", "internalType": "bool" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAllNonces",
        "inputs": [],
        "outputs": [
            { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "laneNonces",
        "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    { "type": "error", "name": "InvalidLane", "inputs": [] },
    { "type": "error", "name": "InvalidNonce", "inputs": [] },
    { "type": "error", "name": "InsufficientLiquidity", "inputs": [] },
    { "type": "error", "name": "PoolNotFound", "inputs": [] }
] as const;

export const ERC20_ABI = [
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "allowance",
        "inputs": [
            { "name": "owner", "type": "address", "internalType": "address" },
            { "name": "spender", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            { "name": "spender", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            { "name": "to", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "mint",
        "inputs": [
            { "name": "to", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
] as const;
