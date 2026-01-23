# SubscriptionPlatform Smart Contract

A decentralized subscription management platform built on Ethereum that allows service providers to create and manage subscription-based services, and users to subscribe or gift subscriptions to others.

## Overview

SubscriptionPlatform is a Solidity smart contract that enables:

- Service owners to create and manage subscription services
- Users to subscribe to services using cryptocurrency
- Users to gift subscriptions to other addresses
- Automated subscription expiration tracking
- Service owner balance management and withdrawals

## Features

### For Service Owners

- **Create Services**: Set up subscription services with custom fees and period lengths
- **Manage Pricing**: Update subscription fees as needed
- **Toggle Availability**: Pause or activate services at any time
- **Withdraw Earnings**: Safely withdraw accumulated subscription fees

### For Subscribers

- **Subscribe**: Purchase subscriptions for yourself
- **Gift Subscriptions**: Purchase subscriptions for other users
- **Automatic Renewal**: Subscriptions automatically extend when renewed before expiration
- **Transparent Tracking**: View subscription status and expiration times

## Smart Contract Details

**Solidity Version**: 0.8.28  
**License**: MIT

### Main Functions

#### Service Management

```solidity
createService(uint256 _fee, uint256 _periodLength, string memory _name)
```

Creates a new subscription service with specified fee (in wei) and period length (in seconds).

```solidity
updateServiceFee(uint256 _serviceId, uint256 _newFee)
```

Updates the subscription fee for an existing service (service owner only).

```solidity
toggleServiceStatus(uint256 _serviceId)
```

Toggles service between active and paused states (service owner only).

```solidity
withdrawBalance(uint256 _serviceId)
```

Withdraws accumulated fees from a service (service owner only).

#### Subscription Functions

```solidity
subscribe(uint256 _serviceId) payable
```

Subscribes the caller to a service. Extends existing subscription if still active.

```solidity
giftSubscription(uint256 _serviceId, address _toUser) payable
```

Purchases a subscription for another user.

#### View Functions

```solidity
hasActiveSubscription(uint256 serviceId, address user) returns (bool)
```

Checks if a user has an active subscription to a service.

```solidity
getSubscriptionExpiration(uint256 serviceId, address user) returns (uint256)
```

Returns the expiration timestamp of a user's subscription.

## Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd subscription-platform
```

2. Install dependencies

```bash
npm install
```

3. Compile the contract

```bash
npx hardhat compile
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

The current test suite provides approximately 45-55% coverage, focusing on core functionality:

- Contract deployment
- Service creation
- Subscription purchases
- Gift subscriptions
- Balance withdrawals
- Basic error handling

## Usage Example

### Creating a Service

```javascript
// Create a monthly subscription for 0.1 ETH
const fee = ethers.parseEther("0.1");
const periodLength = 30 * 24 * 60 * 60; // 30 days in seconds
const tx = await subscriptionPlatform.createService(
  fee,
  periodLength,
  "Premium Service"
);
```

### Subscribing to a Service

```javascript
const serviceId = 0;
const fee = ethers.parseEther("0.1");
await subscriptionPlatform.subscribe(serviceId, { value: fee });
```

### Gifting a Subscription

```javascript
const recipientAddress = "0x...";
await subscriptionPlatform.giftSubscription(serviceId, recipientAddress, {
  value: fee,
});
```

### Checking Subscription Status

```javascript
const isActive = await subscriptionPlatform.hasActiveSubscription(
  serviceId,
  userAddress
);
const expiryTime = await subscriptionPlatform.getSubscriptionExpiration(
  serviceId,
  userAddress
);
```

## Security Considerations

- Uses checks-effects-interactions pattern for withdrawals
- Implements proper access control with modifiers
- Validates all inputs before state changes
- Uses Solidity 0.8.28 with built-in overflow protection
- Balance tracking separated per service

## Events

The contract emits the following events:

```solidity
event ServiceCreated(uint256 indexed serviceId, address indexed serviceOwner, uint256 fee, uint256 periodLength)
event Subscribed(uint256 indexed serviceId, address indexed subscriber, uint256 endTime)
event SubscriptionGifted(uint256 indexed serviceId, address indexed from, address indexed to, uint256 endTime)
```

## License

This project is licensed under the MIT License.

## Contributing

## Future Enhancements

Potential improvements for future versions:

- Refund mechanism for cancelled subscriptions
- Multi-tier subscription levels
- Subscription discounts for bulk purchases
- Subscription transfer functionality
- Automated subscription renewals
