import { useWeb3React } from "@web3-react/core";
import useContract from "./useContract";
import MARKETPLACE_ABI from "../abis/marketPlace.json";

const useMarketplaceContract = () => {
    const { account, error, active, activate, connector, deactivate, chainId } = 
    useWeb3React();
    const MARKETPLACE_CONTRACT = chainId === 1 ? process.env.REACT_APP_RINKBY_MARKETPLACE_CONTRACT_ADDRESS_MAIN : (chainId===56 ? process.env.REACT_APP_BINANCE_MARKETPLACE_MAINNET : null )
    console.log(MARKETPLACE_CONTRACT , chainId)
    return useContract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI.abi, false);
};


export default useMarketplaceContract;
