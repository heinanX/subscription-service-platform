// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

contract SubscriptionPlatform {
    address public owner;

    struct SubscriptionService {
        address serviceOwner;
        string name;
        uint256 fee;
        uint256 periodLength;
        bool isActive;
        uint256 balance;
    }

    uint256 public serviceIdCounter;

    mapping(uint256 => SubscriptionService) public services;

    // Memo: Mapping that tracks subscriptions: serviceId => user address => subscription expiration timestamp
    mapping(uint256 => mapping(address => uint256)) public subscriptions;

    event ServiceCreated(
        uint256 indexed serviceId,
        address indexed serviceOwner,
        uint256 fee,
        uint256 periodLength
    );
    event Subscribed(
        uint256 indexed serviceId,
        address indexed subscriber,
        uint256 endTime
    );

    event SubscriptionGifted(
        uint256 indexed serviceId,
        address indexed from,
        address indexed to,
        uint256 endTime
    );

    constructor() {
        owner = msg.sender;
    }

    modifier validateSubscriptionService(uint256 _serviceId) {
        SubscriptionService storage service = services[_serviceId];
        require(service.serviceOwner != address(0), "Service does not exist");
        require(service.isActive, "Service is paused");
        require(msg.value == service.fee, "Incorrect fee");
        _;
    }

    modifier isServiceOwner(uint256 _serviceId) {
        require(
            services[_serviceId].serviceOwner == msg.sender,
            "Not service owner"
        );
        _;
    }

    // ----------------------------------------- functions

    function createService(
        uint256 _fee,
        uint256 _periodLength,
        string memory _name
    ) external returns (uint256) {
        require(_fee > 0, "Fee must be > 0");
        require(_periodLength > 0, "Period must be > 0");

        uint256 serviceId = serviceIdCounter;

        services[serviceId] = SubscriptionService({
            name: _name,
            serviceOwner: msg.sender,
            fee: _fee,
            periodLength: _periodLength,
            isActive: true,
            balance: 0
        });

        serviceIdCounter++;

        emit ServiceCreated(serviceId, msg.sender, _fee, _periodLength);

        return serviceId;
    }

    function subscribe(
        uint256 _serviceId
    ) external payable validateSubscriptionService(_serviceId) {
        SubscriptionService storage service = services[_serviceId];

        uint256 currentExpiry = subscriptions[_serviceId][msg.sender];

        uint256 newExpiry = currentExpiry > block.timestamp
            ? currentExpiry + service.periodLength
            : block.timestamp + service.periodLength;

        subscriptions[_serviceId][msg.sender] = newExpiry;
        service.balance += msg.value;

        emit Subscribed(_serviceId, msg.sender, newExpiry);
    }

    function giftSubscription(
        uint256 _serviceId,
        address _toUser
    ) external payable validateSubscriptionService(_serviceId) {
        require(_toUser != address(0), "Invalid recipient");

        SubscriptionService storage service = services[_serviceId];

        uint256 subscribersExpiration = subscriptions[_serviceId][_toUser];

        uint256 newExpiry = subscribersExpiration > block.timestamp
            ? subscribersExpiration + service.periodLength
            : block.timestamp + service.periodLength;

        subscriptions[_serviceId][_toUser] = newExpiry;
        service.balance += msg.value;

        emit SubscriptionGifted(_serviceId, msg.sender, _toUser, newExpiry);
    }

    function hasActiveSubscription(
        uint256 serviceId,
        address user
    ) external view returns (bool) {
        return subscriptions[serviceId][user] > block.timestamp;
    }

    function getSubscriptionExpiration(
        uint256 serviceId,
        address user
    ) external view returns (uint256) {
        return subscriptions[serviceId][user];
    }

    function updateServiceFee(
        uint256 _serviceId,
        uint256 _newFee
    ) external isServiceOwner(_serviceId) {
        require(_newFee > 0, "Fee must be > 0");
        services[_serviceId].fee = _newFee;
    }

    function toggleServiceStatus(
        uint256 _serviceId
    ) external isServiceOwner(_serviceId) {
        SubscriptionService storage service = services[_serviceId];
        service.isActive = !service.isActive;
    }
}
