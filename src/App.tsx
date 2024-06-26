import { useState } from 'react';

import { chains, assets } from 'chain-registry';

import { ChainProvider, useChain } from '@cosmos-kit/react';
import { wallets } from '@cosmos-kit/keplr-extension';

import { SigningStargateClient } from "@cosmjs/stargate"
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";

const RPC_ADDRESS = "wss://rpc.sentry-01.theta-testnet.polypore.xyz"

function Component() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [balances, setBalances] = useState<readonly Coin[] | null>(null);

  const chainContext = useChain("cosmoshubtestnet");

  const updateBalances = async () => {
    const client = await SigningStargateClient.connectWithSigner(RPC_ADDRESS, chainContext.getOfflineSignerDirect());

    const balances = await client.getAllBalances(chainContext.address!);
    setBalances(balances);
  }

  const getBalances = () => {
    if (!chainContext.isWalletConnected) {
      return <p>connect your wallet to see your balances</p>
    }

    if (balances === null) {
      return <p>click on "update balances" to get your balance</p>
    }

    return <p>current balances: {JSON.stringify(balances)}</p>;
  }

  return (
    <>
      <h3>faucet address: cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he</h3>

      <br />

      <button
        onClick={async () => {
          chainContext.connect()
        }}>
        connect
      </button>

      {getBalances()}

      <button
        onClick={updateBalances}
      >
        update balances
      </button>

      <br />
      <br />
      <br />

      <label>
        Recipient address
        {' '}
        <input value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} />
      </label>

      <button
        onClick={async () => {

          if (recipientAddress === "") {
            return;
          }

          const client = await SigningStargateClient.connectWithSigner(
            RPC_ADDRESS,
            chainContext.getOfflineSignerDirect(),
          );

          const result = await client.sendTokens(
            chainContext.address!,
            recipientAddress,
            [{ denom: "uatom", amount: "1" }],
            {
              amount: [{ denom: "uatom", amount: "500" }],
              gas: "100000",
            }
          )

          console.log(result);

        }}>
        send
      </button >
    </>
  );
}


function App() {
  return (
    <ChainProvider
      chains={chains}
      assetLists={assets}
      wallets={wallets}
    >
      <Component />
    </ChainProvider >
  );
}

export default App
