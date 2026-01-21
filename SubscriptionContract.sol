pragma solidity 0.8.31;

contract SubscriptionPlatform {
    address public owner;

    struct SubscriptionService {
        address owner;
        string name;
        uint256 fee; //same as uint, just preferred for clarity
        uint56 periodLength;
        bool isActive;
        uint256 balance;
    }

    uint256 public serviceIdCounter;

    mapping(uint256 => SubscriptionService) public services;
    mapping(uint256 => mapping(address => uint256)) public subscriptions;

    event ServiceCreated(
        uint256 indexed serviceId,
        address indexed owner,
        uint256 fee,
        uint256 periodLength
    );


    constructor() {
        owner = msg.sender;
    }

    function createService(uint256 _fee, uint256 _periodLength, string memory _name) external returns (uint256) {
        require(_fee > 0, "Fee must be > 0");
        require(_periodLength > 0, "Period must be > 0");

        uint256 serviceId = serviceIdCounter;

        services[serviceId] = SubscriptionService({
            name: _name,
            owner: msg.sender,
            fee: _fee,
            periodLength: _periodLength,
            isActive: true,
            balance: 0
        });

        serviceIdCounter++;

        emit ServiceCreated(serviceId, msg.sender, _fee, _periodLength);

        return serviceId;
    }




}