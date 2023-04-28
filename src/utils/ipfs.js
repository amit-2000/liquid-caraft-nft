import IPFS from "ipfs-http-client";

const IPFS_HOST = process.env.REACT_APP_IPFS_HOST;
const IPFS_PORT = process.env.IPFS_PORT;
const IPFS_PROTOCOL = process.env.IPFS_PROTOCOL;

const ipfs = new IPFS({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL
});

export default ipfs;
