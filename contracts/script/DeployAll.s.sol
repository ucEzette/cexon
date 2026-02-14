// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/LaneManager.sol";
import "../src/MockERC20.sol";

contract DeployAll is Script {
    function run() external {
        // Start broadcasting as the sender provided via --private-key or --account
        vm.startBroadcast();

        MockERC20 usdc = new MockERC20("Cexon USDC", "cUSDC", 6);
        MockERC20 weth = new MockERC20("Cexon ETH", "cETH", 18);
        LaneManager laneManager = new LaneManager();
        laneManager.initializePool(
            address(usdc),
            address(weth),
            2412.50 * 1e18
        );

        vm.stopBroadcast();

        console.log("cUSDC deployed at:", address(usdc));
        console.log("cETH deployed at:", address(weth));
        console.log("LaneManager deployed at:", address(laneManager));
    }
}
