import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("Save Token", function () {

  async function deploySaveErc() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const DepositAmount = 10;
    const testAmount= 5;

       //deploying the token
    const CaveToken= await ethers.getContractFactory("CaveToken");
    const token = await CaveToken.deploy();

        //deploying the contract
    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveErc20 = await SaveERC20.deploy(token.target);

    return { saveErc20,token,owner,otherAccount,DepositAmount,testAmount};

  }


  describe("checking address zero test functions instance", async () => {

    it("it should not be address 0", async () => {
      const {owner} = await loadFixture(deploySaveErc);
      expect(owner.address).not.equal(ethers.ZeroAddress);

    })

    it("check desposit to greater than zero", async () => {
      const {token,owner} = await loadFixture(deploySaveErc);
      
      expect(token.balanceOf(owner.address)).is.not.equal(0);

    })

    it("it should be approved to transfer ",async()=>{
      const {token,owner, saveErc20,DepositAmount,testAmount} = await loadFixture(deploySaveErc)

      await token.approve(saveErc20.target,DepositAmount);

      await saveErc20.deposit(DepositAmount);

      const depositBalance= await saveErc20.checkUserBalance(owner.address);

      expect(depositBalance).is.equal(DepositAmount);
    });

    it("it should be emit deposit ",async()=>{
      const {token,owner, saveErc20,DepositAmount} = await loadFixture(deploySaveErc)
      
      await token.approve(saveErc20.target,DepositAmount);
      
        await expect(saveErc20.deposit(DepositAmount))
        .to.emit(saveErc20, 'SavingSuccessful')
        .withArgs(
          owner.address,
          DepositAmount
        );

    });


});

});

