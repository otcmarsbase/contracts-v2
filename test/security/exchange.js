
const assert = require('assert/strict');
const { default: BigNumber } = require('bignumber.js');
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { prepareJustContracts, getLastBlockTime, prepareEnvironment, skipTimeTo } = require("../utils")

describe("security/exchange", () => {
    beforeEach(async function() {
        const accounts = await ethers.getSigners();
        
        ({m, dex, dexAttackMock} = await prepareJustContracts());
    
        const USDTCoin = await ethers.getContractFactory("TetherToken");
        const TestToken = await ethers.getContractFactory("TestToken");
        const EPICCoin = await ethers.getContractFactory("EPICCoin");
    
        testToken = await TestToken.deploy();
        usdt = await USDTCoin.deploy(ethers.utils.parseEther("10000000"), "Tether", "USDT", 18);
        epicCoin = await EPICCoin.deploy();
        userAddress = accounts[0].address;
    
        approvalAmount = ethers.utils.parseEther("100000");
        transferAmount = ethers.utils.parseEther("100");
        amountAlice = ethers.utils.parseEther("50");
        amountBob = [ethers.utils.parseEther("10"), ethers.utils.parseEther("20"), ethers.utils.parseEther("20")];

        const [owner] = await ethers.getSigners();

        await owner.sendTransaction({
            to: dexAttackMock.address,
            value: transferAmount, 
        });

        await owner.sendTransaction({
            to: dex.address,
            value: transferAmount, 
        });

        // Zero Address means native ether
        zeroToken = "0x0000000000000000000000000000000000000000";
    
        // Make a list of tokens we are willing to accept
        tokensBob = [usdt.address, epicCoin.address, zeroToken];
      });
    describe("closeExpiredOffer reentrancy", ()=> {
        it("should prevent reentrancy attack", async function () {
            const feeAlice = 0;
            const feeBob = 0;
            const smallestChunkSize = ethers.utils.parseEther("1");
            const minimumSale = ethers.utils.parseEther("1");
            const deadline = await getLastBlockTime() + 10

            await dexAttackMock.createOffer(
                zeroToken,
                tokensBob,
                amountAlice,
                amountBob, 
                {
                    feeAlice: feeAlice,
                    feeBob: feeBob,
                    smallestChunkSize: smallestChunkSize.toString(),
                    deadline: deadline,
                    cancelEnabled: false,
                    modifyEnabled: false,
                    minimumSize: minimumSale.toString(),
                    holdTokens: true
                },
            );
            // Ensure the offer is active
            let offer = await dex.getOffer(0);
            assert.equal(offer.active, true);
            
            const dexBalance = await ethers.provider.getBalance(dex.address);
            expect(dexBalance).equal(transferAmount.add(amountAlice))
        
            await dexAttackMock.acceptOffer(0, zeroToken, smallestChunkSize);
            const dexBalanceAfter = await ethers.provider.getBalance(dex.address);
            expect(dexBalanceAfter).equal(transferAmount.add(amountAlice).add(smallestChunkSize.mul(5)))
            
            await skipTimeTo(deadline + 11)

            expect(dexAttackMock.exploit(0)).to.be.revertedWith("404-C1");
            
          });
    })
})