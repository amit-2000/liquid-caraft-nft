import { InjectedConnector } from "@web3-react/injected-connector";
// Add different connectors
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, , 97, 56, 42, 1337], // Change according to supported Network Ids
});
