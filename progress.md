# Assignment Description:

Develop a contract that functions as a subscription platform, where anyone can create their own subscription service. Each subscription service must have an owner, a fee, and a subscription period (e.g. 30 days), and be able to be paused or resumed individually.

The contract must include functions to pay for or extend a subscription, check whether an address has an active subscription, and retrieve the expiration date of active subscriptions. It must also be possible to gift a subscription to another address.

The creator of a subscription service must be able to change the subscription fee, pause or resume their own service, and withdraw the revenue that has been collected for that specific subscription service.

---

# Completed Tasks:

Task 1: Each subscription service must have an owner, a fee, and a subscription period (e.g. 30 days), and be able to be paused or resumed individually.

Status: Completed

Solution: Created a SubscriptionService struct that holds each subscription service containing:

- name
- owner
- fee
- period
- isPaused
- balance,

.
.

Task 2: The contract must include functions to pay for or extend a subscription
Status: In-progress

---

# To dos:

Task: Check whether an address has an active subscription
Task: Retrieve the expiration date of active subscriptions
Task: Function to gift a subscription to another address
Task: The creator of a subscription service must be able to change the subscription fee
Task: The creator of a subscription service must be able to pause or resume their own service
Task: The creator of a subscription service must be able to withdraw the revenue that's been acumilated for that specific subscription service.
