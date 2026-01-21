# Assignment Description:

Develop a contract that functions as a subscription platform, where anyone can create their own subscription service. Each subscription service must have an owner, a fee, and a subscription period (e.g. 30 days), and be able to be paused or resumed individually.

The contract must include functions to pay for or extend a subscription, check whether an address has an active subscription, and retrieve the expiration date of active subscriptions. It must also be possible to gift a subscription to another address.

The creator of a subscription service must be able to change the subscription fee, pause or resume their own service, and withdraw the revenue that has been collected for that specific subscription service.

---

# Completed Tasks:

Task 1: Each subscription service must have an owner, a fee, and a subscription period (e.g. 30 days), and be able to be paused or resumed individually.

`Status: Completed`
Solution: Created a SubscriptionService struct that holds each subscription service containing:

- name
- owner
- fee
- periodLength
- isActive
- balance

.
.

Task 2: Write a function to create a subscription service

`Status: Completed`
Solution: Write a function that lets a person create a subscription service by:

- Setting min-requirements for values (fee and periodLength) inside struct.
- Assigning id to struct
- Initiate struct with values
- Register event on blockchain

.
.

Task 3: The contract must include a function to pay for and extend a subscription

`Status: Complete`
Solution: Get right service from mapping and applying new expiration time to subscriber

- added service validation
- added validation for incoming fee
- checked current expiration with current time: if renewal => add service periodlength to current time, if not => take time and add to periodService
- stored the new expiration with the subscriber
- calculated balance and added to Subcription Service
- Registered event on blockchain

.
.

Task 4: Check whether an address has an active subscription

`Status: Complete`
Solution: Return a boolean by comparing the subscriber’s stored expiration timestamp with the current block time.

- If the subscription is expired or does not exist, it returns false.
- If the subscription is still valid, it returns true.

.
.

Task: Retrieve the expiration time of an active subscription

`Status: Complete`
Solution: Get user's subscription through mapping and return expiration date.

- Retrieve user's subscription expiration timestamp

.
.

Task 5: Function to gift a subscription to another address

`Status: Complete`
Solution: Repeat of subscripe function's logic but with toUser's id as second argument.

- created a modifier to avoid repeating the same requirements logic

.
.

Task 6: The creator of a subscription service must be able to change the subscription fee
Task 7: The creator of a subscription service must be able to pause or resume their own service

`Status: Complete`
Solution: Add two separate functions.

- One that takes two arguments: serviceId and newFee to update the subscription fee.
- The other uses the logical NOT operator (!) to flip the current isActive value, pausing or resuming the service.

.
.

Task 8: The creator of a subscription service must be able to withdraw the revenue that's been acumilated for that specific subscription service.

`Status: In-progress`
Solution:

# To dos: COMPLETED
