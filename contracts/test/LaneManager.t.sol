// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LaneManager.sol";

contract LaneManagerTest is Test {
    LaneManager public laneManager;
    address public user = address(1);

    function setUp() public {
        laneManager = new LaneManager();
    }

    function test_InitialNonces() public {
        uint256[] memory nonces = laneManager.getAllNonces();
        for (uint256 i = 0; i < 4; i++) {
            assertEq(nonces[i], 0);
        }
    }

    function test_ExecuteTrade() public {
        bytes32 orderHash = keccak256("order1");
        
        vm.prank(user);
        laneManager.executeTrade(1, 0, orderHash);
        
        assertEq(laneManager.laneNonces(1), 1);
        assertEq(laneManager.laneNonces(2), 0);
    }

    function test_FailInvalidNonce() public {
        bytes32 orderHash = keccak256("order1");
        
        vm.prank(user);
        vm.expectRevert(LaneManager.InvalidNonce.selector);
        laneManager.executeTrade(1, 1, orderHash);
    }

    function test_FailInvalidLane() public {
        bytes32 orderHash = keccak256("order1");
        
        vm.prank(user);
        vm.expectRevert(LaneManager.InvalidLane.selector);
        laneManager.executeTrade(5, 0, orderHash);
    }
}
