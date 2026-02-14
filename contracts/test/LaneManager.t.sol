// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/LaneManager.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 ether);
    }
}

contract LaneManagerTest is Test {
    LaneManager public laneManager;
    MockToken public usdc;
    MockToken public weth;
    address public user = address(1);

    function setUp() public {
        usdc = new MockToken("USDC", "USDC");
        weth = new MockToken("WETH", "WETH");
        laneManager = new LaneManager();

        // Initialize pool: 1 USDC = 1 WETH (simple for testing)
        laneManager.initializePool(address(usdc), address(weth), 1 * 1e18);

        // Fund the user and the LaneManager for swaps
        usdc.transfer(user, 1000 ether);
        weth.transfer(address(laneManager), 1000 ether);
        usdc.transfer(address(laneManager), 1000 ether);
    }

    function test_InitialNonces() public {
        uint256[] memory nonces = laneManager.getAllNonces();
        for (uint256 i = 0; i < 4; i++) {
            assertEq(nonces[i], 0);
        }
    }

    function test_ExecuteTrade() public {
        bytes32 orderHash = keccak256("order1");
        uint256 amountIn = 1 ether;

        vm.startPrank(user);
        usdc.approve(address(laneManager), amountIn);
        laneManager.executeTrade(
            1,
            0,
            orderHash,
            address(usdc),
            address(weth),
            amountIn,
            0
        );
        vm.stopPrank();

        assertEq(laneManager.laneNonces(1), 1);
        assertEq(usdc.balanceOf(user), 999 ether);
        // Rate is 1:1
        assertEq(weth.balanceOf(user), 1 ether);
    }

    function test_FailInvalidNonce() public {
        bytes32 orderHash = keccak256("order1");

        vm.startPrank(user);
        usdc.approve(address(laneManager), 1 ether);
        vm.expectRevert(LaneManager.InvalidNonce.selector);
        laneManager.executeTrade(
            1,
            1,
            orderHash,
            address(usdc),
            address(weth),
            1 ether,
            0
        );
        vm.stopPrank();
    }

    function test_FailInvalidLane() public {
        bytes32 orderHash = keccak256("order1");

        vm.startPrank(user);
        usdc.approve(address(laneManager), 1 ether);
        vm.expectRevert(LaneManager.InvalidLane.selector);
        laneManager.executeTrade(
            5,
            0,
            orderHash,
            address(usdc),
            address(weth),
            1 ether,
            0
        );
        vm.stopPrank();
    }
}
