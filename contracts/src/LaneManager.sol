// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LaneManager
 * @dev Manages parallel execution lanes for high-frequency trading simulation.
 * Each lane has its own independent nonce (2D Nonce system).
 */
contract LaneManager {
    // Mapping of Lane ID to its current nonce
    mapping(uint256 => uint256) public laneNonces;
    
    // Total number of lanes supported
    uint256 public constant TOTAL_LANES = 4;

    event TradeExecuted(uint256 indexed laneId, uint256 nonce, address indexed user, bytes32 orderHash);
    event LaneReset(uint256 indexed laneId);

    error InvalidLane();
    error InvalidNonce();

    /**
     * @dev Executes a trade in a specific lane.
     * @param laneId The lane index (1 to TOTAL_LANES).
     * @param expectedNonce The next expected nonce for this lane.
     * @param orderHash Hash of the order details.
     */
    function executeTrade(uint256 laneId, uint256 expectedNonce, bytes32 orderHash) external {
        if (laneId == 0 || laneId > TOTAL_LANES) revert InvalidLane();
        if (laneNonces[laneId] != expectedNonce) revert InvalidNonce();

        // Increment nonce for parallel safety
        laneNonces[laneId]++;

        emit TradeExecuted(laneId, expectedNonce, msg.sender, orderHash);
    }

    /**
     * @dev Resets a lane nonce (for simulation/testing purposes).
     */
    function resetLane(uint256 laneId) external {
        if (laneId == 0 || laneId > TOTAL_LANES) revert InvalidLane();
        laneNonces[laneId] = 0;
        emit LaneReset(laneId);
    }

    /**
     * @dev View function to get nonces for all lanes.
     */
    function getAllNonces() external view returns (uint256[] memory) {
        uint256[] memory nonces = new uint256[](TOTAL_LANES);
        for (uint256 i = 0; i < TOTAL_LANES; i++) {
            nonces[i] = laneNonces[i + 1];
        }
        return nonces;
    }
}
