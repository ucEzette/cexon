// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/LaneManager.sol";

contract DeployLaneManager is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            )
        );

        vm.startBroadcast(deployerPrivateKey);

        address usdc = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // Demo USDC on Moderato
        address ethWrapper = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619; // Demo WETH on Moderato

        LaneManager laneManager = new LaneManager();

        vm.stopBroadcast();

        console.log("LaneManager deployed at:", address(laneManager));
    }
}
