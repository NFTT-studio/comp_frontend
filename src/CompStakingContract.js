import { ethers } from "ethers"

const STAKING_ADDRESS ="0xe452c8be926e3cb24a9314a3638cb240a55e8e1a"
class CompStakingContractUtil{
     abi=[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint32","name":"compId","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"power","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint32","name":"power","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staking","type":"event"},{"inputs":[],"name":"compContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"tokenId","type":"uint32"}],"name":"compPower","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"compStakingMap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"startRedeemTokenId","type":"uint32"},{"internalType":"address","name":"poolTokenContract","type":"address"},{"internalType":"uint32","name":"initStakingRatio","type":"uint32"},{"internalType":"uint32","name":"onceCompReward","type":"uint32"}],"name":"createPool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"compIdList","type":"uint32[]"},{"internalType":"address","name":"poolTokenContract","type":"address"}],"name":"currentStakingParams","outputs":[{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"poolTokenContract","type":"address"}],"name":"poolAvailableBouns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pools","outputs":[{"internalType":"uint32","name":"startRedeemTokenId","type":"uint32"},{"internalType":"address","name":"poolTokenContract","type":"address"},{"internalType":"uint32","name":"initStakingRatio","type":"uint32"},{"internalType":"uint32","name":"onceCompReward","type":"uint32"},{"internalType":"address","name":"initOwner","type":"address"},{"internalType":"uint32","name":"totalPower","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"compId","type":"uint32"},{"internalType":"address","name":"poolTokenContract","type":"address"}],"name":"redeem","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"compIdList","type":"uint32[]"},{"internalType":"address","name":"poolTokenContract","type":"address"}],"name":"staking","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"standTemplates","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]
     provider
     contract
     poolContractAddress="0xd81b71cbb89b2800cdb000aa277dc1491dc923c3";
     constructor(connect) {
          this.provider = new ethers.providers.Web3Provider(connect,"any")
          this.contract = new ethers.Contract(STAKING_ADDRESS,this.abi,this.provider);
     }
     poolInfo = async()=>{

          let  [poolInfo,availableBouns] = await Promise.all([
                this.contract.pools(this.poolContractAddress),
                this.contract.poolAvailableBouns(this.poolContractAddress),
              ]);
          return [poolInfo.totalPower.toString(),ethers.utils.formatEther(availableBouns)];
     }

     compStakingInfo = async(compId)=>{
          return await this.contract.compStakingMap(this.poolContractAddress,compId);

     }
     stakingParams = async(compIds)=>{
          var params = await this.contract.currentStakingParams(compIds,this.poolContractAddress);
          return {power:params[0], amount: ethers.utils.formatEther(params[1]) }

     }

     isNMTAllowanceEnough=async (owner,amount)=>{
          const allowanceAbi = [
               "function allowance(address owner, address spender) external view returns (uint256)"
          ];
          const contract = new ethers.Contract(this.poolContractAddress, allowanceAbi, this.provider);
          const allowance = await contract.allowance(owner,STAKING_ADDRESS);
          return parseInt(ethers.utils.formatEther( allowance)) >parseInt( amount);
     }

     isNMTBalanceEnough=async (owner,amount)=>{

          return this.NMTBalance(owner) >= parseInt( amount);
     }
     NMTBalance=async (owner)=>{
          const balanceOfabi = [
               "function balanceOf(address) view returns (uint)"
          ];
          const contract = new ethers.Contract(this.poolContractAddress, balanceOfabi, this.provider);
          const balance = await contract.balanceOf(owner);
          return parseInt(ethers.utils.formatEther( balance))
     }


     NMTapproveAll=async()=>{
          const approveAbi = [
              "function approve(address spender, uint256 amount) external returns (bool)"
          ];
          const contract = new ethers.Contract(this.poolContractAddress, approveAbi, this.provider);
          const signer = this.provider.getSigner()
          let tx = await contract.connect(signer).approve(STAKING_ADDRESS, "10000000000000000000000000");
          return tx;
     }

     staking=async(compIdList)=>{
          const signer = this.provider.getSigner();
          let tx = await this.contract.connect(signer).staking(compIdList,this.poolContractAddress);
         return tx;
     }
     redeem = async (compId)=>{
          const signer = this.provider.getSigner()
          let tx = await this.contract.connect(signer).redeem(compId,this.poolContractAddress);
          return tx;
     }

}

export default CompStakingContractUtil;