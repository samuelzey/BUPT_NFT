//contain all of our wallet and smart contract interaction functions.
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json')
const contractAddress = "0xEAbefCc264C718242Dc3BC29f9514A1aE17c2e65";
export const connectWallet = async() =>{
    if(window.ethereum){
      try{
        const addressArray = await window.ethereum.request({
          method:"eth_requestAccounts",
        });
        const obj = {
          status:"👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      }catch(err){
        return{
          address:"",
          status:"😥 " + err.message,
        };
    }
  }else{
    return{
      address:"",
      status:(
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              你必须已经安装了Metamask钱包
            </a>
          </p>
        </span>
      ),
    };
  }
};
export const mintNFT = async() => {

  const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmeJ7EhmGsaBMcDUNdo625axzWr9st6yrU7hkdmcL3KSV4';
//我们假设tokenURI就是nft-metadata.json的地址
window.contract = await new web3.eth.Contract(contractABI, contractAddress);

//set up your Ethereum transaction
 const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.preSale().encodeABI()//make call to NFT smart contract
 };

//sign the transaction via Metamask
 try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    return {
        success: true,
        status: "✅ 成功！在Etherscan上查看: https://goerli.etherscan.io/tx/" + txHash
    }
 } catch (error) {
    return {
        success: false,
        status: "😥 发生了错误: " + error.message
    }

 }

};

export const ifWhilisted = async() => {

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const checkAddress = window.ethereum.selectedAddress;

  const message = await window.contract.methods.isAllowlistAddress(checkAddress).call();
  console.log(message);
  if(message == true)return{
      status: '恭喜！你在白名单中！'
    }
  if(message == false)return{
    status: '对不起，你不在白名单里面'
  }

};

export const getCurrentWalletConnected = async()=>{
  if(window.ethereum){
    try{
      const addressArray = await window.ethereum.request({
        method:"eth_accounts",
      });
      if (addressArray.length > 0){
        return {
          address: addressArray[0],
          status:"👆🏽 请确保你在以太坊主网上",
        };
      } else {
        return{
          address:"",
          status:"🦊 请点击右上角，连接Metamask钱包",
        };
      }
    }catch(err){
      return{
        address:"",
        status:"😥 " + err.message,
      };
    }
  }else{
    return {
      address:"",
      status:(
        <span>
          <p>
          {" "}
          🦊{" "}
            <a target = "_blank" href={`https://metamask.io/download.html`}>
            你必须已经安装了Metamask钱包
            </a>
          </p>
        </span>
      ),
    };
  }
};
