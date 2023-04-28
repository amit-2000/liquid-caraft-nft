const ensureIpfsUriPrefix = (cidOrURI) => {
    let uri = cidOrURI.toString();
    if (!uri.startsWith("ipfs://")) {
        uri = "ipfs://" + cidOrURI;
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith("ipfs://ipfs/")) {
        uri = uri.replace("ipfs://ipfs/", "ipfs://");
    }
    return uri;
};

export default ensureIpfsUriPrefix;
