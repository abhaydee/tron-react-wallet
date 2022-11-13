import { React, useState, useEffect } from "react";
import "./App.css";
import Merge from "./Components/Merge";
import logo from "./logo.svg";
import Axios from "axios";
import contract from "./contracts.json";
const TronWeb = require("tronweb");
//template code for connecting react and tron network
function App({}) {
  const [buyState, setBuyState] = useState(false);
  const [mintedState, setMintedState] = useState("BUY");
  const [mintedState2, setMintedState2] = useState("BUY");
  const [mintedState3, setMintedState3] = useState("BUY");
  const [walletState, setWalletState] = useState("Connect wallet");
  const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
  const fullNode = new HttpProvider("https://api.trongrid.io"); // Full node http endpoint
  const solidityNode = new HttpProvider("https://api.trongrid.io"); // Solidity node http endpoint
  const eventServer = "https://api.trongrid.io/";

  const privateKey =
    "930f604f50a311d849b5102c9134d41ab1ab994bfee7721278d8017207ec3377";

  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  async function triggerSmartContract(nftId) {
    if(nftId ===1){
      setMintedState("Minting.....");
    }
    else if(nftId===2){
      setMintedState2("Minting.....");
    }
    else {
      setMintedState3("Minting.....")
    }

    const trc721ContractAddress = "TDXDt9aCYd4rRvK2VzPLQbTX1WHzJQxP6k"; //contract address
    try {
      let instance = await window.tronWeb.contract().at(trc721ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      const balance = await instance
        .balanceOf("TC9v1hSE2uf5wVM8p8JgqXZwf4hWUzgGfn")
        .call();

      console.log("contract: ", balance.toNumber());
      // console.log(instance.abi[6].balanceOf(window.tronWeb.defaultAddress.base58))
      instance.makeAnEpicNFT(window.tronWeb.defaultAddress.base58);
      // let result = await contract.symbol().call();
      // console.log("result: ", result);
      if(nftId===1){
        setMintedState("Minted");

      }
      else if(nftId ===2){
        setMintedState2("Minted");
      }
      else {
        setMintedState3("Minted")
      }
    } catch (error) {
      console.error("trigger smart contract error", error);
    }
  }

  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: "none",
    address: "none",
    balance: 0,
    frozenBalance: 0,
    network: "none",
    link: "false",
  });

  const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronWeb && window.tronWeb.ready) {
      let walletBalances = await window.tronWeb.trx.getAccount(
        window.tronWeb.defaultAddress.base58
      );
      return walletBalances;
    } else {
      return 0;
    }
  };

  const navigateToAlgoVerse = () => {
    console.log("navigating to algoverse");
    // triggerSmartContract();
  };

  const getWalletDetails = async () => {
    if (window.tronWeb) {
      //checking if wallet injected
      if (window.tronWeb.ready) {
        let tempBalance = await getBalance();
        let tempFrozenBalance = 0;

        if (!tempBalance.balance) {
          tempBalance.balance = 0;
        }

        //checking if any frozen balance exists
        if (
          !tempBalance.frozen &&
          !tempBalance.account_resource.frozen_balance_for_energy
        ) {
          tempFrozenBalance = 0;
        } else {
          if (
            tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.frozen[0].frozen_balance +
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
          }
          if (
            tempBalance.frozen &&
            !tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
          }
          if (
            !tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
          }
        }

        //we have wallet and we are logged in
        setMyMessage(<h3>WALLET CONNECTED</h3>);
        setWalletState("Tron Link Connected");
        setMyDetails({
          name: window.tronWeb.defaultAddress.name,
          address: window.tronWeb.defaultAddress.base58,
          balance: tempBalance.balance / 1000000,
          frozenBalance: tempFrozenBalance / 1000000,
          network: window.tronWeb.fullNode.host,
          link: "true",
        });
      } else {
        //we have wallet but not logged in
        setMyMessage(<h3>WALLET DETECTED PLEASE LOGIN</h3>);
        setMyDetails({
          name: "none",
          address: "none",
          balance: 0,
          frozenBalance: 0,
          network: "none",
          link: "false",
        });
      }
    } else {
      //wallet is not detected at all
      setMyMessage(<h3>WALLET NOT DETECTED</h3>);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      // getWalletDetails();
      //wallet checking interval 2sec
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  },[]);

  const navigateToBuyMerge = () => {
    //  navigate("/merge")
    setBuyState(true);
  };

  const createSocialEvent = () => {

  }

  const registerForSocialEvent = ()=>{

  }

  const buyNft = async (nftId) => {
    triggerSmartContract(nftId);
  };

  const connectWallet = async () => {
    getWalletDetails(); 
  };
  return (
    <>
      <div className="App">
        <div className="Card">
          <h1> Welcome to TronVerse </h1>
          <div className="Logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="Stats">
            {myMessage}
            <h4>Your Tron Account Name{myDetails.name} </h4>
            <h4>Your Tron Account Address {myDetails.address}</h4>
            <h4>
              Tron token balance: {myDetails.balance} TRX (Frozen:{" "}
              {myDetails.frozenBalance} TRX)
            </h4>
            <h4>Network Selected: {myDetails.network}</h4>
            <h4>Link Established: {myDetails.link}</h4>
            <div className="flexColumn">
              <button
                className="cta-button connect-wallet-button"
                onClick={connectWallet}
              >
                {" "}
                {walletState}
              </button>

              {myDetails.name && (
                <button
                  className="cta-button connect-wallet-button"
                  onClick={navigateToAlgoVerse}
                >
                  {" "}
                  Connect to TronVerse
                </button>
              )}

              {myDetails.name && (
                <button
                  className="cta-button connect-wallet-button"
                  onClick={navigateToBuyMerge}
                >
                  {" "}
                  Buy Tron Merge
                </button>
              )}
              {myDetails.name && (
                <button
                  className="cta-button connect-wallet-button"
                  onClick={createSocialEvent}
                >
                  {" "}
                  Create a Social Event
                </button>
              )}
              {myDetails.name && (
                <button
                  className="cta-button connect-wallet-button"
                  onClick={registerForSocialEvent}
                >
                  {" "}
                  Register for a Social Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {buyState && (
        <div className="merch-container">
          <div className="card">
            <img
              src="https://litb-cgis.rightinthebox.com/images/640x853/202012/ctwzqr1608192948083.jpg?fmt=webp&v=1"
              width={100}
              height={100}
              alt="nft"
            />
            <h4> NFT 1</h4>
            <p> NFT1 description</p>
            <button
              className="cta-button connect-wallet-button"
              onClick={() => buyNft(1)}
            >
              {mintedState}
            </button>
          </div>
          <div className="card">
            <img
              src="https://litb-cgis.rightinthebox.com/images/640x853/202210/bps/product/inc/bncrjp1666791507145.jpg?fmt=webp&v=1"
              width={100}
              height={100}
              alt="nft"

            />
            <h4> NFT 2</h4>
            <p> NFT1 description</p>
            <button
              className="cta-button connect-wallet-button"
              onClick={() => buyNft(2)}
            >
              {" "}
              {mintedState2}
            </button>
          </div>
          <div className="card">
            <img
              src="https://litb-cgis.rightinthebox.com/images/640x853/202210/bps/product/inc/qxqjzp1666791531615.jpg?fmt=webp&v=1"
              width={100}
              height={100}
              alt="nft"
            />
            <h4> NFT 3</h4>
            <p> NFT1 description</p>
            <button
              className="cta-button connect-wallet-button"
              onClick={() => buyNft(3)}
            >
              {" "}
              {mintedState3}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
