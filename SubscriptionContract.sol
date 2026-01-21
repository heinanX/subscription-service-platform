pragma solidity 0.8.31;

contract SubscriptionPlatform {

    struct SubscriptionService {
        address owner;
        string name;
        uint256 fee; //same as uint, just preferred for clarity
        uint56 period;
        bool isPaused;
        uint256 balance;
    }

}