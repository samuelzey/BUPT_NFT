import { useEffect, useState } from "react";
import {connectWallet,getCurrentWalletConnected,mintNFT,ifWhilisted} from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => { //TODO: implement
    const {address,status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
const walletResponse = await connectWallet();
setStatus(walletResponse.status);
setWallet(walletResponse.address);
  };
  function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 请确保你正在使用以太坊主网");
      } else {
        setWallet("");
        setStatus("🦊 请点击右上角，连接Metamask钱包");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          你必须已经安装了Metamask钱包
        </a>
      </p>
    );
  }
}

  const onMintPressed = async () => { //TODO: implement
    const { status } = await mintNFT();
    setStatus(status);
  };
  const onCheckPressed = async () => {
    const { status } = await ifWhilisted();
    setStatus(status);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ 北邮区块链协会NFT领取</h1>
      <p>
        只有白名单内的地址可以领取NFT，申请<a href="./#">点击这里</a>
      </p>
      <form>
        <h2>🤔 NFT名称</h2>
        <div class="intro-text">
        鸿雁传链
        </div>
        <h2>✍️ 介绍: </h2>
        <div class="intro-text">
        鸿雁传链重绘了北邮校徽的鸿雁，背上载着北邮人，周围是各大公链，寓意北邮人在链圈薪火相传。
        </div>
      </form>
      <div>
      <button id="checkIfEligible"onClick={onCheckPressed}>
        资格查询
      </button>
      </div>
      <button id="mintButton" onClick={onMintPressed}>
        领取
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
