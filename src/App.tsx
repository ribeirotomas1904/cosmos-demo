
import { chains, assets } from 'chain-registry';

import { Logger, WalletManager } from '@cosmos-kit/core';
import { wallets } from '@cosmos-kit/keplr-extension';

import { SigningStargateClient, } from "@cosmjs/stargate"

const RPC_ADDRESS = "wss://rpc.sentry-01.theta-testnet.polypore.xyz"

function Component() {

  return (
    <>
      <h3>faucet address: cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he</h3>

      <br />

      <button
        onClick={async () => {
          const walletManager = new WalletManager(chains, wallets, new Logger(), "connect_only", undefined, undefined, assets);

          const walletRepo = walletManager.getWalletRepo("cosmoshubtestnet");


          await walletRepo.connect(walletRepo.wallets[0].walletName, true);

          console.log(walletRepo.current);

          const offlineSigner = await walletRepo.wallets[0].getSigningStargateClient();

          offlineSigner.getChainId()

          console.log(await offlineSigner.sendTokens(
            "cosmos1qkgwhmya6ftv4y99xac3ldxh8jd9a49xyyf4ff",
            "cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he",
            [{ denom: "uatom", amount: "1" }],
            {
              amount: [{ denom: "uatom", amount: "500" }],
              gas: "100000",
            }
          ))

          // const client = await SigningStargateClient.connectWithSigner(RPC_ADDRESS, offlineSigner!);

          // console.log(await client.sendTokens(
          // "cosmos1qkgwhmya6ftv4y99xac3ldxh8jd9a49xyyf4ff",
          // "cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he",
          // [{ denom: "uatom", amount: "1" }],
          // {
          //   amount: [{ denom: "uatom", amount: "500" }],
          //   gas: "100000",
          // }
          // ))
        }}>
        connect
      </button>
    </>
  );
}


function App() {
  return (
    <Component />
  );
}

export default App
