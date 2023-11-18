import { CosmosClient } from "@cosmjs/launchpad";
import Link from "next/link";
import React, { useState } from "react";
import Web3 from "web3";
import { SigningStargateClient } from "@cosmjs/stargate";

let testWalletAddr = "inj17xxadj7e9ermxnq7jl5t2zxu5pknhahac8ma8e";

const chainId = "injective-888"; // Replace with your chain ID
const rpcEndpoint = "https://testnet.sentry.tm.injective.network:443"; // Replace with the RPC endpoint of your chain

const navigation = [
  {
    name: "Markets",
    href: "/",
    icon: "/icon_markets.svg",
    iconSelected: "/icon_markets_selected.svg",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: "/icon_orders.svg",
    iconSelected: "/icon_orders_selected.svg",
  },
  {
    name: "Positions",
    href: "/positions",
    icon: "/icon_positions.svg",
    iconSelected: "/icon_positions_selected.svg",
  },
  {
    name: "Statistics",
    href: "/statistics",
    icon: "/icon_stats.svg",
    iconSelected: "/icon_stats_selected.svg",
  },
];
function DashboardLayout({ children, activePage }) {
  const [publicAddress, setPublicAddress] = useState("");
  // ! ************************************************************************************************************** KEPLR
  async function getKeplr() {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }
    await window.keplr.enable("injective-888"); // Example: Enable the Cosmos Hub chain
    const keplr = window.keplr;
    return keplr;
  }
  async function connectWallet() {
    const keplr = await getKeplr();
    if (!keplr) return;

    const chainId = "injective-888";

    const offlineSigner = keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    setPublicAddress(accounts[0].address);
    console.log({ keplr, accounts });
    return { keplr, accounts };
  }
  // async function sendTransaction(
  //   senderAddress,
  //   recipientAddress,
  //   amount,
  //   memo
  // ) {
  //   try {
  //     const keplr = await getKeplr();
  //     if (!keplr) return;

  //     const chainId = "injective-888";
  //     const offlineSigner = keplr.getOfflineSigner(chainId);
  //     const accounts = await offlineSigner.getAccounts();

  //     const cosmos = new CosmosClient(
  //       "https://testnet.sentry.tm.injective.network:443",
  //       chainId
  //     );

  //     const msgSend = {
  //       type: "cosmos-sdk/MsgSend",
  //       value: {
  //         from_address: senderAddress,
  //         to_address: recipientAddress,
  //         amount: [{ denom: "inj", amount: String(amount) }],
  //       },
  //     };

  //     const fee = {
  //       amount: [{ denom: "inj", amount: "5000" }],
  //       gas: "200000",
  //     };

  //     const { included } = await cosmos.sendTx({
  //       msgs: [msgSend],
  //       fee: fee,
  //       memo: memo,
  //     });

  //     console.log("Transaction included in a block:", included);
  //   } catch (error) {
  //     console.error("Error in sendTransaction:", error);
  //   }
  // }
  async function sendTransaction(
    senderAddress,
    recipientAddress,
    amount,
    memo
  ) {
    try {
      // Ensure Keplr is available
      if (!window.keplr) {
        alert("Please install Keplr extension");
        return;
      }

      // Enable the Injective testnet
      await window.keplr.enable("injective-888");
      const chainId = "injective-888";
      const offlineSigner = window.keplr.getOfflineSigner(chainId);

      // Create a new signing client
      const signingClient = await window.injective.getSigningClient({
        rpcUrl: "https://testnet.sentry.tm.injective.network:443",
        signer: offlineSigner,
      });

      // Define transaction message
      const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: senderAddress,
          toAddress: recipientAddress,
          amount: [{ denom: "inj", amount: String(amount) }],
        },
      };

      // Define fee
      const fee = {
        amount: [{ denom: "inj", amount: "5000" }],
        gas: "200000",
      };

      // Broadcast the transaction
      const response = await signingClient.sendTx({
        chainId: chainId,
        msgs: [msg],
        memo: memo,
        fee: fee,
      });

      console.log("Transaction response:", response);
    } catch (error) {
      console.error("Error in sendTransaction:", error);
    }
  }

  async function sendTransactionStargate(recipientAddress, amount, memo = "") {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      // Suggest/Enable the chain (if not already enabled)
      await window.keplr.enable(chainId);

      // Get Keplr's offlineSigner for the specific chain
      const offlineSigner = window.keplr.getOfflineSigner(chainId);

      // Create a Stargate client using Keplr's signer
      const client = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        offlineSigner
      );

      // Get the sender's address from the offline signer
      const [firstAccount] = await offlineSigner.getAccounts();
      const senderAddress = firstAccount.address;

      // Define the message for sending tokens
      const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: senderAddress,
          toAddress: recipientAddress,
          amount: [{ denom: "INJ", amount: String(amount) }], // Replace 'INJ' with the token denomination
        },
      };

      // Define fee
      const fee = {
        amount: [{ denom: "INJ", amount: "2000" }], // Replace 'INJ' with the fee denomination
        gas: "200000", // Adjust the gas limit according to your needs
      };

      // Broadcast the transaction
      const result = await client.signAndBroadcast(
        senderAddress,
        [msg],
        fee,
        memo
      );
      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Error in sendTransaction:", error);
    }
  }
  // ! ************************************************************************************************************** METAMASK
  async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      // MetaMask is installed
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Convert chainId to a decimal number
        const numericChainId = parseInt(chainId, 16);
        const account = accounts[0];
        console.log("Connected account:", account, numericChainId);
        setPublicAddress(account);
        // console.log(getTransactionHistory(account));
        return account; // You can use this account information in your application
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      // MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  }
  async function getTransactionHistory(address) {
    // Initialize Web3
    const web3 = new Web3(
      Web3.givenProvider || "https://sentry.tm.injective.network:443"
    );
    // Fetch transaction history for the address
    // This is a placeholder - you need to use a method compatible with INJ chain
    const transactions = await web3.eth.getPastLogs({ address: address });

    return transactions;
  }
  async function sendTransactionWithMetamask(fromAddress, toAddress, amount) {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      // Specify the transaction parameters
      const tx = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(amount, "ether"), // Convert the amount to Wei
        gas: 21000, // This is the gas limit for standard transactions
      };

      // Send the transaction
      const txHash = await web3.eth.sendTransaction(tx);
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }

  return (
    <main
      style={{ backgroundImage: 'url("/BG.png")' }}
      className="bg-cover h-screen w-screen pt-[20px] bg-fixed overflow-y-scroll pb-12"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center ">
          <img
            src={"/TemporalLogoSmall.svg"}
            alt="Temporal Logo"
            className="ml-16"
          />
          {navigation.map((singleNav) => (
            <Link
              key={singleNav.href}
              href={singleNav.href}
              className={`flex items-center uppercase ml-[52px] ${
                singleNav.name == activePage
                  ? "text-[#0ABAB5]"
                  : "text-[#f2f2f2]"
              }`}
            >
              <img
                src={
                  singleNav.name == activePage
                    ? singleNav.iconSelected
                    : singleNav.icon
                }
                className="!w-4 !h-4 mr-2"
              />{" "}
              {singleNav.name}
            </Link>
          ))}
        </div>
        {publicAddress ? (
          <>
            <button className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]">
              {publicAddress.slice(0, 5)}...
              {publicAddress.slice(
                publicAddress.length - 4,
                publicAddress.length
              )}
            </button>

            <button
              className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
              onClick={() => {
                sendTransactionStargate(testWalletAddr, 0.001);
                // sendTransaction(publicAddress, testWalletAddr, 0.001, {
                //   key: "value1",
                // });
              }}
            >
              Transact
            </button>
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
          >
            Connect Wallet
          </button>
        )}
      </header>
      <section className="max-w-[95vw] mx-auto">{children}</section>
      <footer></footer>
    </main>
  );
}

export default DashboardLayout;
