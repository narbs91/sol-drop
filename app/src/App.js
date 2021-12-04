import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";

// Constants
const TWITTER_HANDLE = "narb_s";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  

  const processWalletConnect = (connectedWallet) => {
    const publicKey = connectedWallet.publicKey.toString();
    console.log(`Connected with Public Key: ${publicKey}`);
    setWalletAddress(publicKey);
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana && solana.isPhantom) {
      const connectedWallet = await solana.connect();
      processWalletConnect(connectedWallet);
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;

    await solana.disconnect();

    console.log("Wallet disconnected!");

    setWalletAddress(null);
  };

  const pageLoadWalletConnect = async () => {
    const { solana } = window;

    if (solana && solana.isPhantom) {
      const connectedWallet = await solana.connect({ onlyIfTrusted: true });
      processWalletConnect(connectedWallet);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log("Phantom Wallet was found");
        
        await pageLoadWalletConnect();
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const renderConnectedContainer = () => (
    <button
      className="cta-button disconnect-wallet-button"
      onClick={disconnectWallet}
    >
      Logout
    </button>
  );

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}

          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
