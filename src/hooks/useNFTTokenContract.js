import useContract from "./useContract";
import NFT_TOKEN_ABIS from "../abis/NFT.json";

const NFT_CONTRACT = process.env.REACT_APP_RINKBY_NFT_CONTRACT_ADDRESS_MAIN;
const useNFTTokenContract = () => {
    return useContract(NFT_CONTRACT, NFT_TOKEN_ABIS.abi, false);
};

export default useNFTTokenContract;
