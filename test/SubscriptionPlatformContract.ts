import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SubscriptionPlatformContract", function () {
  async function deploySubscriptionPlatformContractFixture() {
    const [owner, serviceOwner, subscriber, recipient] =
      await ethers.getSigners();

    const SubscriptionPlatform = await ethers.getContractFactory(
      "SubscriptionPlatform"
    );
    const subscriptionPlatform = await SubscriptionPlatform.deploy();

    return { subscriptionPlatform, owner, serviceOwner, subscriber, recipient };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { subscriptionPlatform, owner } =
        await deploySubscriptionPlatformContractFixture();
      expect(await subscriptionPlatform.owner()).to.equal(owner.address);
    });
  });

  describe("Service Creation", function () {
    it("Should create a service with valid parameters", async function () {
      const { subscriptionPlatform, serviceOwner } =
        await deploySubscriptionPlatformContractFixture();

      const fee = ethers.parseEther("0.1");
      const periodLength = 30 * 24 * 60 * 60; // 30 days in seconds
      const name = "The Amazing Thunder Dog Comics";

      await expect(
        subscriptionPlatform
          .connect(serviceOwner)
          .createService(fee, periodLength, name)
      )
        .to.emit(subscriptionPlatform, "ServiceCreated")
        .withArgs(0, serviceOwner.address, fee, periodLength);

      const service = await subscriptionPlatform.services(0);
      expect(service.serviceOwner).to.equal(serviceOwner.address);
      expect(service.name).to.equal(name);
      expect(service.fee).to.equal(fee);
      expect(service.periodLength).to.equal(periodLength);
      expect(service.isActive).to.equal(true);
      expect(service.balance).to.equal(0);
    });

    it("Should revert when fee is 0", async function () {
      const { subscriptionPlatform, serviceOwner } =
        await deploySubscriptionPlatformContractFixture();

      await expect(
        subscriptionPlatform
          .connect(serviceOwner)
          .createService(0, 30 * 24 * 60 * 60, "Unveild Mysteries of the World")
      ).to.be.revertedWith("Fee must be > 0");
    });
  });

  describe("Subscription", function () {
    it("Should allow user to subscribe to a service", async function () {
      const { subscriptionPlatform, serviceOwner, subscriber } =
        await deploySubscriptionPlatformContractFixture();

      const fee = ethers.parseEther("0.1");
      const periodLength = 30 * 24 * 60 * 60;

      await subscriptionPlatform
        .connect(serviceOwner)
        .createService(
          fee,
          periodLength,
          "Learn How To Conquer the World in Two Days"
        );

      const blockBefore = await ethers.provider.getBlock("latest");
      const expectedExpiry = blockBefore!.timestamp + 1 + periodLength;

      await expect(
        subscriptionPlatform.connect(subscriber).subscribe(0, { value: fee })
      )
        .to.emit(subscriptionPlatform, "Subscribed")
        .withArgs(0, subscriber.address, expectedExpiry);

      const hasActive = await subscriptionPlatform.hasActiveSubscription(
        0,
        subscriber.address
      );
      expect(hasActive).to.equal(true);

      const service = await subscriptionPlatform.services(0);
      expect(service.balance).to.equal(fee);
    });

    it("Should revert when paying incorrect fee", async function () {
      const { subscriptionPlatform, serviceOwner, subscriber } =
        await deploySubscriptionPlatformContractFixture();

      const fee = ethers.parseEther("0.1");
      const periodLength = 30 * 24 * 60 * 60;

      await subscriptionPlatform
        .connect(serviceOwner)
        .createService(
          fee,
          periodLength,
          "When You Find Yourself Compiling Tests at 2 in the Morning"
        );

      await expect(
        subscriptionPlatform
          .connect(subscriber)
          .subscribe(0, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Incorrect fee");
    });
  });

  describe("Gift Subscription", function () {
    it("Should allow gifting a subscription to another user", async function () {
      const { subscriptionPlatform, serviceOwner, subscriber, recipient } =
        await deploySubscriptionPlatformContractFixture();

      const fee = ethers.parseEther("0.1");
      const periodLength = 30 * 24 * 60 * 60;

      await subscriptionPlatform
        .connect(serviceOwner)
        .createService(fee, periodLength, "Friendship 101");

      const blockBefore = await ethers.provider.getBlock("latest");
      const expectedExpiry = blockBefore!.timestamp + 1 + periodLength;

      await expect(
        subscriptionPlatform
          .connect(subscriber)
          .giftSubscription(0, recipient.address, { value: fee })
      )
        .to.emit(subscriptionPlatform, "SubscriptionGifted")
        .withArgs(0, subscriber.address, recipient.address, expectedExpiry);

      const hasActive = await subscriptionPlatform.hasActiveSubscription(
        0,
        recipient.address
      );
      expect(hasActive).to.equal(true);
    });
  });

  describe("Withdraw Funds", function () {
    it("Should allow service owner to withdraw aquired balance", async function () {
      const { subscriptionPlatform, serviceOwner, subscriber } =
        await deploySubscriptionPlatformContractFixture();

      const fee = ethers.parseEther("0.1");
      const periodLength = 30 * 24 * 60 * 60;

      await subscriptionPlatform
        .connect(serviceOwner)
        .createService(
          fee,
          periodLength,
          "Investment Projections in 2026; everything you need to know about growing your wealth"
        );
      await subscriptionPlatform
        .connect(subscriber)
        .subscribe(0, { value: fee });

      const balanceBefore = await ethers.provider.getBalance(
        serviceOwner.address
      );

      const tx = await subscriptionPlatform
        .connect(serviceOwner)
        .withdrawBalance(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(
        serviceOwner.address
      );

      expect(balanceAfter).to.equal(balanceBefore + fee - gasUsed);

      const service = await subscriptionPlatform.services(0);
      expect(service.balance).to.equal(0);
    });
  });
});
