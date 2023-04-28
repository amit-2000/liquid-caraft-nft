import React, { useState, useEffect, useRef } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { injected } from "./utils/connectors";
import { useWeb3React } from "@web3-react/core";
import Logo from "./asset/img/Artboard 1-8.png";
import { Button, Modal } from "react-bootstrap";
import { useMarketplaceContract, useNFTTokenContract } from "./hooks";
import useEthBalance from "./hooks/useEthBalance";
import Metamask from "./Components/Metamask";
import { truncateAddress, WithLoadingComponent } from "./helpers/index";
import LiquidCraftModal from "./Components/Modal/LiquidCraftModal";
import "./App.css";
import sortDown from "./asset/img/sort-down.svg";
import walletIcon from "./asset/img/wallet.svg";
import sortUp from "./asset/img/sort-up.svg";
import SuccessImage from "./asset/img/Group 553.png";
import ErrorImage from "./asset/img/Group 554.png";
import Ethereum from "./asset/img/Ellipse 39.png";
import Binance from "./asset/img/binance.jpg";

var reader = new FileReader();
export default function App() {
  const [modal, setModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChain, setChainID] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [loader, setLoader] = useState(false);
  const [message, setmessage] = useState({ type: "", message: "" });
  const [isAceeptedtier, setTermsacceptedTier] = useState(false);
  const [isAceeptedtier2, setTermsacceptedTier2] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();
  const marketPlacecontract = useMarketplaceContract();
  const [successmodal, setsuccessmodal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [conditionmodal, setconditionmodal] = useState(false);
  const nftContracts = useNFTTokenContract();
  const [Item, setItem] = useState("");
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const {
    account,
    error,
    active,
    activate,
    connector,
    deactivate,
    chainId,
    close,
  } = useWeb3React();

  // console.log(active);
  const getIPFSurl = (url) => {
    // console.log(url)
    const result = url?.replace("ipfs://", "");
    console.log(`https://ipfs.io/ipfs/${result.replaceAll(" ", "%20")}`);
    return `https://ipfs.io/ipfs/${result.replaceAll(" ", "%20")}`;
  };
  const ether = useEthBalance();

  // console.log(active)
  const getAllitem = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_END_POINT_URL}/api/v1/item/getAllItems`
    );
    console.log(response);
    const data = await response.json();

    setItem(data.data.data);
  };
  const handleDisconnectWalletClick = () => {
    deactivate();
    setIsDropdownOpen(false);
    localStorage.setItem("shouldConnect", "false");
  };
  useEffect(() => {
    // setInterval(() => {
    getAllitem();
    // }, 6000);
  }, []);

  const onBuynowClick = (e) => {
    e.preventDefault();
    setModal(false);

    setLoader(true);
    console.log(selectedChain, chainId);
    console.log(selectedData);
    if (selectedChain === 1) {
      if (chainId === 56) {
        setsuccessmodal(true);
        setLoader(false);
        return setmessage({
          message: "Please Change the Network to Main Network",
        });
      }
      nftContracts.methods
        .balanceOf(
          account,
          selectedData.tokenId || selectedData?.itemDetails?.tokenId
        )
        .call()
        .then((value) => {
          if (parseInt(value) + quantity > 10) {
            setLoader(false);
            // console.log("limitExcede")

            setsuccessmodal(true);
            setmessage({ message: "Purchase limit exceeded" });
          } else {
            marketPlacecontract.methods
              .buyToken(
                selectedData.tokenId || selectedData?.itemDetails?.tokenId,
                quantity
              )
              .estimateGas({ from: account })
              // .send({ from: account,   value: (selectedData?.itemDetails.price * quantity * Math.pow(10 , 18)).toString() })
              .then((gasLimit) => {
                // console.log(res);
                marketPlacecontract.methods
                  .buyToken(
                    selectedData.tokenId || selectedData?.itemDetails?.tokenId,
                    quantity
                  )
                  .send({
                    from: account,
                    value: (
                      selectedData?.itemDetails.price *
                      quantity *
                      Math.pow(10, 18)
                    ).toString(),
                  })
                  .then((res) => {
                    setmessage({
                      type: "success",
                      message: "NFT Buy Successfully",
                    });
                    setsuccessmodal(true);
                    // setTimeout(() => {
                    //     history.push("/collections");
                    // }, 5000);
                    setQuantity(0);
                    getAllitem();
                    setModal(false);
                    setLoader(false);
                  })
                  .catch((err) => {
                    setmessage({
                      type: "error",
                      message: err.message.split("{")[0] || "Meta Mask Error",
                    });
                    setsuccessmodal(true);
                    setQuantity(0);
                    setModal(false);
                    setLoader(false);
                  });
              })
              .catch((err) => {
                // console.log("err" , err);
                // console.log("errName" , err.name);
                // console.log("errMsg" , err.message);
                console.log(err);

                setmessage({
                  type: "error",
                  message: err.message.split("{")[0] || "Meta Mask Error",
                });
                setsuccessmodal(true);
                setQuantity(0);
                setModal(false);
                3;
                setLoader(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          // console.error("error" , err)
        });
    } else {
      window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x38", // 0x61
              chainName: "Smart Chain - binance",
              nativeCurrency: {
                name: "Binance Coin",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: [
                "https://speedy-nodes-nyc.moralis.io/036ae4597aee06455d1b3aca/bsc/testnet",
              ],
              blockExplorerUrls: ["https://bscscan.com/"],
            },
          ],
        })
        .then(() => {
          setActivatingConnector(injected);
          activate(injected);
          // nftContracts.methods
          //     .setApprovalForAll(
          //         process.env
          //             .REACT_APP_BINANCE_MARKETPLACE,
          //         true
          //     )
          //     .send({ from: account })
          // .then((response) => {
          // marketPlacecontract.methods
          //     .buyToken(
          //         selectedData.tokenId ||
          //             selectedData?.itemDetails?.tokenId,
          //             quantity
          //     )
          //     .estimateGas({ from: account })
          // .then(() => {
          nftContracts.methods
            .balanceOf(
              account && account,
              selectedData.tokenId || selectedData?.itemDetails?.tokenId
            )
            .call()
            .then((value) => {
              if (parseInt(value) + quantity > 10) {
                setLoader(false);
                // console.log("limitExcede")
                setsuccessmodal(true);
                setmessage({ message: "Purchase limit exceeded" });
              } else {
                marketPlacecontract.methods
                  .buyToken(
                    selectedData.tokenId || selectedData?.itemDetails?.tokenId,
                    quantity
                  )
                  .send({
                    from: account,
                    value: (
                      selectedData?.itemDetails.price *
                      quantity *
                      Math.pow(10, 18)
                    ).toString(),
                  })
                  .then((res) => {
                    // console.log(res);
                    setmessage({
                      type: "success",
                      message: "NFT Buy Successfully",
                    });
                    setsuccessmodal(true);
                    getAllitem();
                    setLoader(false);
                  })
                  .catch((err) => {
                    // console.log(err);
                    setmessage({
                      type: "error",
                      message: err.message.split("{")[0] || "Meta Mask Error",
                    });
                    setsuccessmodal(true);
                    setLoader(false);
                  });
              }
            });

          // })
          // .catch((err) => {
          //     console.log({ err });
          //     // setmessage({
          //     //     type: "error",
          //     //     message:
          //     //         err.message.split("{")[0] || "Meta Mask Error"
          //     // });
          //     // setsuccessmodal(true);
          //     setLoader(false);
          // });
          // })
          // .catch((err) => {
          //     console.log(err.message);
          //     // setmessage({
          //     //     type: "error",
          //     //     message:
          //     //         err.message.split("{")[0] || "Meta Mask Error"
          //     // });
          //     // setsuccessmodal(true);
          //     setLoader(false);
          // });
        });
    }
  };

  return (
    <>
      <div
        className={
          loader || successmodal || conditionmodal ? "hidesection" : ""
        }
      >
        <div className="hero__image">
          <div className="hero__AppBar">
            <div className="hero__logo">
              <a
                href="https://liquidcraft.io/"
                target="_blank"
                rel="noreferrer"
                className="Anchor_image"
              >
                <img alt="logo" width={150} height={65} src={Logo}></img>
              </a>
            </div>
            {!active ? (
              <Metamask></Metamask>
            ) : (
              <div className="user-info-wrapper" onClick={toggleDropdown}>
                <div className="user-address-wrapper">
                  <div className="wallet-status" />
                  <div className="user-address">{truncateAddress(account)}</div>
                </div>
                <div className="dropdown-wallet-icon">
                  <img src={walletIcon} alt="wallet-icon" />
                  {isDropdownOpen ? (
                    <img src={sortUp} alt="sort-up" />
                  ) : (
                    <img src={sortDown} alt="sort-down" />
                  )}
                </div>
              </div>
            )}

            {isDropdownOpen && (
              <div className="user-info-extended-wrapper">
                <div className="user-info-extended">
                  <div className="user-info-wallet">
                    <div className="wallet-details">Wallet Details</div>
                  </div>
                  <div className="user-info-wallet-address">
                    <div>
                      <span>ACCOUNT</span>
                    </div>
                    <div className="copyaddress">
                      <span className="address">{`${account
                        ?.substring(0, 10)
                        ?.trim()}...`}</span>
                    </div>
                  </div>
                  <div className="user-info-wallet-address">
                    <div className="eth-balance">
                      <div className="eth-text balance-text">
                        ETH : {`${ether?.substring(0, 10)?.trim()}...`}{" "}
                      </div>
                      {/* <div className="eth-value value">{ether}</div> */}
                    </div>
                  </div>
                  <div className="user-info-wallet">
                    <div
                      className="wallet-button"
                      onClick={handleDisconnectWalletClick}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="center_description">
            <div className="hero__head">
              <h1 className="hero__title">Dragons & Bourbon NFT Series</h1>
              <p className="hero__description mb-4">
                Welcome to the first native NFT launch from Liquid Craft!
              </p>
            </div>
          </div>
        </div>
        <WithLoadingComponent isLoading={loader} />

        <section className="hero__section">
          <div className="container">
            <div className="row justify-content-center">
              {Item &&
                Item.slice(0, 2).map(
                  (elem) =>
                    elem?.sellQuantity > 0 && (
                      <>
                        <div className="col-md-6 mb-5 mb-md-0">
                          <div
                            style={{
                              backgroundImage: `url( ${getIPFSurl(
                                elem?.itemDetails?.previewImage
                              )})`,
                            }}
                            className="card card__background__img"
                          >
                            <div className="card-head d-flex justify-content-between">
                              <h3 className="card__tier">
                                {" "}
                                {elem?.itemDetails?.chainId === 1
                                  ? "Tier 1"
                                  : "Tier 2"}
                              </h3>
                              <button className=" btn card__top__button">
                                {elem?.sellQuantity}/{elem?.quantity}
                              </button>
                            </div>
                            <div className="card__body">
                              <div className="card__price">
                                <span>
                                  <img
                                    className="ETHimg"
                                    src={
                                      elem.itemDetails?.chainId === 1
                                        ? Ethereum
                                        : Binance
                                    }
                                  ></img>
                                </span>
                                <span className="price">{elem?.price}</span>
                              </div>
                              <button
                                disabled={
                                  elem?.itemDetails?.chainId === 1
                                    ? isAceeptedtier
                                      ? false
                                      : true
                                    : isAceeptedtier2
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  setModal(true);
                                  setChainID(elem.itemDetails?.chainId);
                                  setSelectedData(elem);
                                }}
                                className="btn card__buy__button"
                              >
                                {elem.itemDetails?.chainId === 1
                                  ? "Buy on Eth"
                                  : "Buy on BSC"}
                              </button>
                            </div>
                          </div>
                          <div className="form-check mt-4">
                            {active ? (
                              <>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={
                                    elem?.itemDetails?.chainId === 1
                                      ? isAceeptedtier
                                        ? true
                                        : false
                                      : isAceeptedtier2
                                      ? true
                                      : false
                                  }
                                  id={
                                    elem.itemDetails?.chainId === 1
                                      ? "exampleCheck1"
                                      : "exampleCheck2"
                                  }
                                  onChange={() => {
                                    // if(elem.itemDetails?.chainId=== 1 ){
                                    //     setTermsacceptedTier(
                                    //     !isAceeptedtier
                                    // )
                                    if (isAceeptedtier || isAceeptedtier2) {
                                      if (elem.itemDetails?.chainId === 1) {
                                        return setTermsacceptedTier(false);
                                      } else {
                                        return setTermsacceptedTier2(false);
                                      }
                                    }
                                    setconditionmodal(true);
                                    setChainID(elem.itemDetails?.chainId);
                                    // }
                                    // else{
                                    //     setTermsacceptedTier2(
                                    //         !isAceeptedtier2
                                    //     )
                                    //     setconditionmodal(true)
                                    // }
                                  }}
                                />
                                <label
                                  className="form-check-label card__lable"
                                  htmlFor={
                                    elem.itemDetails?.chainId === 1
                                      ? "exampleCheck1"
                                      : "exampleCheck2"
                                  }
                                >
                                  I agree to the Harvest conditions
                                </label>
                              </>
                            ) : (
                              <p>Connect to the MetaMask Wallet</p>
                            )}
                            {/* <div className="card-text card__para mt-4">  <span>{ elem.itemDetails?.chainId === 1 ? "123 - Proof Cask Strength Straight Bourbon" :  "100 - Proof Straight Bourbon"}</span></div>
                                 <div className="card-text card__para mt-4">  <div className="liq_label">ABV</div> <span>{ elem.itemDetails?.chainId === 1 ? "61.5% ABV" :  "50% ABV"}</span>     </div> */}
                            {elem?.itemDetails?.liquorDescription && (
                              <div className="card-text card__para mt-4">
                                {" "}
                                <div className="liq_label">
                                  Description
                                </div>{" "}
                                <span>
                                  {" "}
                                  {elem?.itemDetails?.liquorDescription}
                                </span>{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )
                )}
            </div>
          </div>
        </section>
        <section>
          <div className="YoutubeSec">
            <h3 className="mb-3">Need help connecting to Metamask?</h3>
            <iframe
              width="400"
              height="275"
              src="https://www.youtube.com/embed/yWfZnjkhhhg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
        <footer className="text-center " style={{ backgroundColor: "#f1f1f1" }}>
          <div className="container pt-4">
            <p className="footer__text">Connect with Liquid Craft</p>

            <section className="mb-4">
              <a
                className="btn btn-link btn-floating btn-lg text-dark m-1"
                href="https://twitter.com/CraftLiquid"
                target="_blank"
                role="button"
                data-mdb-ripple-color="dark"
                rel="noreferrer"
              >
                <i className="fa fa-twitter"></i>
              </a>
              <a
                className="btn btn-link btn-floating btn-lg text-dark m-1"
                href="https://discord.gg/cNWvdUuRfv"
                target="_blank"
                role="button"
                data-mdb-ripple-color="dark"
                rel="noreferrer"
              >
                <i className="fa fa-discord"></i>
              </a>
            </section>
          </div>
          <div className="text-center footer__copyright p-3">
            ©2021 All Rights Reserved. Liquid Craft
            <a
              className="text-dark"
              href="https://liquidcraft.io/"
              target="_blank"
              rel="noreferrer"
            >
              Liquid Craft
            </a>
          </div>
        </footer>
      </div>
      <LiquidCraftModal
        show={successmodal}
        onClose={() => setsuccessmodal(false)}
      >
        <div className="modai-image-container">
          <a
            href="javascript:void(0)"
            className="closebtn"
            style={{
              position: "absolute",
              top: "0px",
              fontSize: "25px",
              textDecoration: "none",
              right: "15px",
              color: "black",
            }}
            onClick={() => setsuccessmodal(false)}
          >
            &times;
          </a>
          <div className="">
            <img
              src={message.type === "success" ? SuccessImage : ErrorImage}
              className="rounded new-liquor-success-img "
              alt="..."
            />
          </div>
        </div>
        <h2 className={"token__succesful__head"}>
          {message.type === "success"
            ? "NFT Buy successfully. "
            : "NFT Buy Error "}
        </h2>
        <p className={`popup ${"token__success__para"}`}>{message.message}</p>
      </LiquidCraftModal>
      <LiquidCraftModal
        show={conditionmodal}
        onClose={() => setconditionmodal(false)}
      >
        <div className="modai-image-container">
          <a
            href="javascript:void(0)"
            className="closebtn"
            style={{
              position: "absolute",
              top: "0px",
              fontSize: "25px",
              textDecoration: "none",
              right: "15px",
              color: "black",
            }}
            onClick={() => setconditionmodal(false)}
          >
            &times;
          </a>
        </div>
        <div className=" Terms_condition mt-4 ">
          <h2 className="m-2" style={{ margin: "auto", textAlign: "center" }}>
            Harvest Conditions
          </h2>
          <p className="terms_para">
            By proceeding you are agreeing that when you decide to harvest your
            NFT, you have read and acknowledged the Terms of Distribution set
            forth by the supplier. When harvesting your NFT, it will be
            irreversibly deactivated and distributed based on the set Terms of
            Distribution. In order to receive the physical product attached to
            the NFT, as of now, you will be responsible for picking up your
            harvested NFT at The Heart Distillery in Windsor, Colorado. In order
            to receive your spirit you will also be responsible for proving that
            you are of legal drinking age in the U.S.A. Failure to comply with
            any of these terms may lead to a termination of the agreement by the
            supplier. Delivery method may include shipping in the future, at
            which time an announcement will be made. This NFT will not be
            available for harvest until Liquid Craft’s Marketplace has launched
            and is live. To Harvest this NFT please go to Liquidcraft.io,
            connect wallet, and press Harvest. You will then be contacted by
            supplier to initiate harvest.
          </p>
        </div>
        <div className="CONDITION_BTN mt-5">
          <button
            onClick={() => {
              if (selectedChain === 1) {
                setTermsacceptedTier(true);
                setChainID("");
                setconditionmodal(false);
              } else {
                setTermsacceptedTier2(true);
                setconditionmodal(false);
                setChainID("");
              }
            }}
            className="btn btn-primary"
          >
            Accept
          </button>
          <button
            onClick={() => {
              if (selectedChain === 1) {
                setTermsacceptedTier(false);
                setconditionmodal(false);
                setChainID("");
              } else {
                setTermsacceptedTier2(false);
                setChainID("");
                setconditionmodal(false);
              }
            }}
            className="btn btn-warning"
          >
            Reject
          </button>
        </div>
      </LiquidCraftModal>
      <Modal
        className="modal fade liquidcraftmodal"
        id=""
        show={modal}
        backdrop={false}
        keyboard={false}
      >
        <Modal.Header className="modal-title bids-header">
          {/* <a
                    href="javascript:void(0)"
                    className="closebtn"
                    onClick={()=>setModal(false)}
                >
                    &times;
                </a> */}
          <a
            href="javascript:void(0)"
            className="closebtn"
            style={{
              position: "absolute",
              top: "0px",
              fontSize: "25px",
              textDecoration: "none",
              right: "15px",
              color: "black",
            }}
            onClick={() => setModal(false)}
          >
            &times;
          </a>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onBuynowClick}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Enter Buy Quantity</label>
              <input
                type="number"
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Quantity"
              />
            </div>
            <button
              type="submit"
              disabled={quantity == 0 ? true : false}
              class="btn btn-primary"
            >
              BUY
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
