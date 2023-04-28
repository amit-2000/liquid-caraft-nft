import React, { useState, useEffect, useRef } from "react";

import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "../hooks";
import { injected } from "../utils/connectors";
const Metamask = () => {
  const ONBOARD_TEXT = "Click to install MetaMask!";
  const CONNECT_TEXT = "Connect Metamask";

  const [metamaskButtonText, setMetamaskButtonText] = useState(ONBOARD_TEXT);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [activatingConnector, setActivatingConnector] = useState();
  const onboarding = useRef();
  const { account, error, active, activate, connector, deactivate, chainId } =
    useWeb3React();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);
  // useEffect(()=>{
  // if(localStorage.getItem("shouldConnect")==="true"){
  // const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager || !!activatingConnector);
  // }
  // } , [])

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // For Metamask OnBoarding
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);
  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (account && account.length > 0) {
        onboarding.current.stopOnboarding();
      } else {
        setMetamaskButtonText(CONNECT_TEXT);
      }
    }
  }, [account]);
  const onConnectWithMetamaskClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        })
        .then(() => {
          setActivatingConnector(injected);
          activate(injected);
          localStorage.setItem("shouldConnect", "true");
        });
    } else {
      onboarding.current.startOnboarding();
    }
  };
  // console.log(chainId);
  return (
    <button
      className="btn hero__button mr-md-5 mr-2"
      // disabled={account ? true : false}
      onClick={() => onConnectWithMetamaskClick()}
    >
      {account ? "Wallet Connected" : metamaskButtonText}
    </button>
  );
};

export default Metamask;
