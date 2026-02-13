export const LANE_MANAGER_ADDRESS = "0x55129FC022f7F955132f722B70Dc90e97269211c" as const;
export const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as const; // Placeholder USDC address

export const LANE_MANAGER_ABI = [
    {
        "type": "function",
        "name": "executeTrade",
        "inputs": [
            { "name": "laneId", "type": "uint256", "internalType": "uint256" },
            { "name": "expectedNonce", "type": "uint256", "internalType": "uint256" },
            { "name": "orderHash", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
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
    {
        "type": "event",
        "name": "TradeExecuted",
        "inputs": [
            { "name": "laneId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "nonce", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "orderHash", "type": "bytes32", "indexed": false, "internalType": "bytes32" }
        ],
        "anonymous": false
    }
] as const;
