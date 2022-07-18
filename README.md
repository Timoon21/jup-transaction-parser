<div id="top"></div>

<br />
<div align="center">
<h3 align="center">Jupiter Aggregator Transaction Parser</h3>

  <p align="center">
    How to recover data directly from the blockchain
    <br />
    <br />
  </p>
</div>


### Getting started

```bash
# Clone the repository (you can also click "Use this template")
git clone https://github.com/timoon21/jup-transaction-parser.git jup-transaction-parser
cd jup-transaction-parser

...
# Install dependencies
npm install


# Run parser.ts file
`npm run parser`.# runs ./src/parser.ts file
...
```

<p align="right">(<a href="#top">back to top</a>)</p>

## ToDo
Currently, I use the Pre and Post Balances Accounts.
This does not allow me to parse the intermediate token during a swap over multiple legs.
I plan in the future to parse the innerInstructions to decode the Token Transfer.

## Useful Links

* [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)
* [Solana JSON RPC API](https://docs.solana.com/developing/clients/jsonrpc-api)
* [SOL / BORSH Decoder](https://borsh.m2.xyz/)
* [Anchor Program Registry](https://www.apr.dev/)
* [Serialization Cookbook](https://solanacookbook.com/guides/serialization.html#how-to-deserialize-account-data-on-the-client)
* [Sonar Watch - Solana Workshop - HH Paris](https://github.com/sonarwatch/solana-workshop)

<p align="right">(<a href="#top">back to top</a>)</p>


## Jupiter Links

* [Jupiter Aggregator](https://jup.ag)
* [@JupiterExchange](https://twitter.com/JupiterExchange)
* [Discord Server](https://discord.com/invite/jup)

<p align="right">(<a href="#top">back to top</a>)</p>
