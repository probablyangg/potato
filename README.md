# potato 🥔

## Writing and Deploying an NFT contract on Xion Chain

> [!NOTE]
> Steps 1-5 aren't necessary (todo: add more here)

1. Clone the CW-NFTs repo
   ```
   git clone https://github.com/CosmWasm/cw-nfts
   ```
2. Navigate to the directory
   ```
   cd cw-nfts
   ```
3. Compile and Optimize the Wasm bytecode
   ```
    docker run --rm -v "$(pwd)":/code \
      --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
      --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
      cosmwasm/optimizer:0.16.0
   ```
   We are using CosmWasm's Optimizing Compiler in the above step, it is a tool used to reduce the build size of compiled contracts, making them more efficient for deployment on the blockchain. Read more [here](https://github.com/CosmWasm/optimizer)

   This step will store all the output in the `cw-nfts/artifacts` directory

4. Upload the bytecode to the chain
    ```
    $ RES=$(xiond tx wasm store ./artifacts/cw721_base.wasm \
            --gas-adjustment 1.3 \
            --gas-prices 0.001uxion \
            --gas auto \
            -y --output json \
            --chain-id xion-testnet-1 \
            --node https://rpc.xion-testnet-1.burnt.com:443 \
            --from test)
    ```
    ```
    $ echo $RES

    {"height":"0","txhash":"B557242F3BBF2E68D228EBF6A792C3C617C8C8C984440405A578FBBB8A385035","codespace":"","code":0,"data":"","raw_log":"","logs":[],"info":"","gas_wanted":"0","gas_used":"0","tx":null,"timestamp":"","events":[]}
    ```
5.  Get CODE_ID
    Query the chain using the transaction hash from previous step to get the CODE_ID

    ```
    $ CODE_ID=$(xiond query tx B557242F3BBF2E68D228EBF6A792C3C617C8C8C984440405A578FBBB8A385035 --node https://rpc.xion-testnet-1.burnt.com:443 --output json | jq -r '.events[-1].attributes[1].value')
    ```

    ```
    $ echo $CODE_ID

    1213
    ```
6.  instantiate the contract
     ```
      MSG='{
        "name": "Potato NFT",
        "symbol": "POTATO",
        "minter": "xion12ed74j6y2km7y6a60d5rmea7ptkjh5k82akpc76at3dfgex388zstruy8t"
      }'
    ```
    ```
      xiond tx wasm instantiate $CODE_ID "$MSG" \
        --from test --label "potato nft" --gas-prices 0.025uxion --gas auto --gas-adjustment 1.3 -y --no-admin --chain-id xion-testnet-1 --node https://rpc.xion-testnet-1.burnt.com:443
    ```

    output:
    ```
      gas estimate: 217976
      code: 0
      codespace: ""
      data: ""
      events: []
      gas_used: "0"
      gas_wanted: "0"
      height: "0"
      info: ""
      logs: []
      raw_log: ""
      timestamp: ""
      tx: null
      txhash: 09D48FE11BE8D8BD4FCE11D236D80D180E7ED7707186B1659F5BADC4EC116F30
    ```

7.  Get contract address: Query the chain using the transaction hash from previous step to get the contract address
    ```
      $ CONTRACT=$(xiond query tx 09D48FE11BE8D8BD4FCE11D236D80D180E7ED7707186B1659F5BADC4EC116F30 --node https://rpc.xion-testnet-1.burnt.com:443 --output json | jq -r '.events[-1].attributes[1].value')
    ```
    ```
    $ echo $CONTRACT

    xion1v6476wrjmw8fhsh20rl4h6jadeh5sdvlhrt8jyk2szrl3pdj4musyxj6gl
    ```
8.  Save contract address in `src/utils/constants.ts`
