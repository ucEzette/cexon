// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Manual ILaneERC20 interface to reduce dependency bloat
interface ILaneERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract LaneManager {
    mapping(uint256 => uint256) public laneNonces;
    uint256 public constant TOTAL_LANES = 4;

    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 price; // Scaled by 1e18, price of tokenA in tokenB
        bool exists;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(address => mapping(address => uint256)) public userLiquidity;

    event TradeExecuted(
        uint256 indexed laneId,
        uint256 nonce,
        address indexed user,
        bytes32 orderHash,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );

    event PoolInitialized(address tokenA, address tokenB, uint256 price);
    event LiquidityAdded(address indexed user, address indexed token, uint256 amount);
    event LiquidityRemoved(address indexed user, address indexed token, uint256 amount);

    error InvalidLane();
    error InvalidNonce();
    error InsufficientLiquidity();
    error PoolNotFound();

    constructor() {}

    function getPoolId(address a, address b) public pure returns (bytes32) {
        return a < b ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    function initializePool(address tokenA, address tokenB, uint256 initialPrice) external {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        pools[poolId] = Pool({
            tokenA: tokenA < tokenB ? tokenA : tokenB,
            tokenB: tokenA < tokenB ? tokenB : tokenA,
            reserveA: 0,
            reserveB: 0,
            price: initialPrice,
            exists: true
        });
        emit PoolInitialized(tokenA, tokenB, initialPrice);
    }

    function addLiquidity(address token, uint256 amount) external {
        ILaneERC20(token).transferFrom(msg.sender, address(this), amount);
        userLiquidity[msg.sender][token] += amount;
        emit LiquidityAdded(msg.sender, token, amount);
    }

    function removeLiquidity(address token, uint256 amount) external {
        if (userLiquidity[msg.sender][token] < amount) revert InsufficientLiquidity();
        userLiquidity[msg.sender][token] -= amount;
        ILaneERC20(token).transfer(msg.sender, amount);
        emit LiquidityRemoved(msg.sender, token, amount);
    }

    function executeTrade(
        uint256 laneId,
        uint256 expectedNonce,
        bytes32 orderHash,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external {
        if (laneId == 0 || laneId > TOTAL_LANES) revert InvalidLane();
        if (laneNonces[laneId] != expectedNonce) revert InvalidNonce();

        bytes32 poolId = getPoolId(tokenIn, tokenOut);
        Pool storage pool = pools[poolId];
        if (!pool.exists) revert PoolNotFound();

        // 1. Pull tokens
        ILaneERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // 2. Dynamic price logic
        uint256 amountOut;
        // Basic decimals handling: USDC (6), ETH (18)
        // If tokenA < tokenB, let's assume tokenA is USDC and tokenB is ETH
        // pool.price is price of tokenA in tokenB (e.g. 1 USDC = 0.000416 ETH)
        // Scaled by 1e18
        
        if (tokenIn == pool.tokenA) {
            amountOut = (amountIn * pool.price) / 1e18;
        } else {
            amountOut = (amountIn * 1e18) / pool.price;
        }

        if (amountOut < minAmountOut) revert InsufficientLiquidity();

        // 3. Send tokens
        ILaneERC20(tokenOut).transfer(msg.sender, amountOut);

        // 4. Increment
        laneNonces[laneId]++;

        emit TradeExecuted(
            laneId,
            expectedNonce,
            msg.sender,
            orderHash,
            tokenIn,
            amountIn,
            amountOut
        );
    }

    function getAllNonces() external view returns (uint256[] memory) {
        uint256[] memory nonces = new uint256[](TOTAL_LANES);
        for (uint256 i = 0; i < TOTAL_LANES; i++) {
            nonces[i] = laneNonces[i + 1];
        }
        return nonces;
    }
}
