import { Connection, PublicKey, AccountMeta } from "@solana/web3.js";
import { BorshInstructionCoder, Idl, Program, Wallet, Provider } from "@project-serum/anchor";

const connection = new Connection('https://api.mainnet-beta.solana.com')

export class Leg{
    inUiAmount: number;
    inMint: string;
    outUiAmount: number;
    outMint: string;
    amm: string;
    constructor(inUiAmount: number, inMint: string, outUiAmount: number, outMint: string, amm: string) {
      this.inUiAmount = inUiAmount;
      this.inMint = inMint;
      this.outUiAmount = outUiAmount;
      this.outMint = outMint;
      this.amm = amm;
    }
}

export class Swap{
    signature: string;
    owner: string;
    slot: number;
    fee: number;
    legs: Leg[];
    inUiAmount: number;
    inMint: string;
    outUiAmount: number;
    outMint: string;
    constructor(legs: Leg[], signature: string, owner: string, slot: number, fee: number) {
      this.signature = signature;
      this.owner = owner;
      this.slot = slot;
      this.fee = fee;
      this.legs = legs;
      this.inUiAmount = legs[0].inUiAmount;
      this.inMint = legs[0].inMint;
      this.outUiAmount = legs[legs.length-1].outUiAmount;
      this.outMint = legs[legs.length-1].outMint;
    }
}

// This mapping is derived from the Jupiter IDL.
const accountNamesMapping: {[index: string]:any}  = {
  tokenSwap: {
    amm: sentenceCase("tokenSwapProgram"),
    source: sentenceCase("source"),
    destination: sentenceCase("destination"),
  },
  mercurialExchange: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("sourceTokenAccount"),
    destination: sentenceCase("destinationTokenAccount"),
  },
  serumSwap: {
    amm: sentenceCase("dexProgram"),
    source: sentenceCase("orderPayerTokenAccount"),
    coin: sentenceCase("coinWallet"),
    pc: sentenceCase("pcWallet"),
  },
  stepTokenSwap: {
    amm: sentenceCase("tokenSwapProgram"),
    source: sentenceCase("source"),
    destination: sentenceCase("destination"),
  },
  saberExchange: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("inputUserAccount"),
    destination: sentenceCase("outputUserAccount"),
  },
  cropperTokenSwap: {
    amm: sentenceCase("tokenSwapProgram"),
    source: sentenceCase("source"),
    destination: sentenceCase("destination"),
  },
  raydiumSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("userSourceTokenAccount"),
    destination: sentenceCase("userDestinationTokenAccount"),
  },
  raydiumSwapV2: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("userSourceTokenAccount"),
    destination: sentenceCase("userDestinationTokenAccount"),
  },
  aldrinSwap: {
    amm: sentenceCase("swapProgram"),
    base: sentenceCase("userBaseTokenAccount"),
    quote: sentenceCase("userQuoteTokenAccount"),
  },
  aldrinV2Swap: {
    amm: sentenceCase("swapProgram"),
    base: sentenceCase("userBaseTokenAccount"),
    quote: sentenceCase("userQuoteTokenAccount"),
  },
  cremaTokenSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("userSourceTokenAccount"),
    destination: sentenceCase("userDestinationTokenAccount"),
  },
  senchaExchange: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("inputUserAccount"),
    destination: sentenceCase("outputUserAccount"),
  },
  cykuraSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("inputTokenAccount"),
    destination: sentenceCase("outputTokenAccount"),
  },
  saberSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("inputUserAccount"),
    destination: sentenceCase("outputUserAccount"),
  },
  lifinityTokenSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("sourceInfo"),
    destination: sentenceCase("destinationInfo"),
  },
  whirlpoolSwap: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("tokenOwnerAccountA"),
    destination: sentenceCase("tokenOwnerAccountB"),
  },
  whirlpoolSwapExactOutput: {
    amm: sentenceCase("swapProgram"),
    source: sentenceCase("tokenOwnerAccountA"),
    destination: sentenceCase("tokenOwnerAccountB"),
  },
  marinadeFinanceDeposit: {
    amm: sentenceCase("marinadeFinanceProgram"),
    source: sentenceCase("transferFrom"),
    destination: sentenceCase("mintTo"),
  },
  marinadeFinanceLiquidUnstake: {
    amm: sentenceCase("marinadeFinanceProgram"),
    source: sentenceCase("getMsolFrom"),
    destination: sentenceCase("transferSolTo"),
  },
};

async function getIDL(program: string){
  const anchorWallet = {publicKey: new PublicKey('8hhVf9vH5Kf4z2XVybnXi5yMQZ6V2LEaPZwFTZogXARq')} as Wallet; // random Pubkey...
  const provider = new Provider(connection, anchorWallet, {});
  const prog = new PublicKey(program)
  const _idl = await Program.fetchIdl(prog, provider);
  if (_idl){
    return _idl // if IDL found, return IDL
  }
  else {
    return {  "version":"", "name":"", "instructions":[] }   // else, empty IDL to return an Anchor Idl type
  }
}

function sentenceCase(field: string): string {
  const result = field.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export async function decodeIx(txSig: string) {
  try {
    const tx = await connection.getTransaction(txSig)   // TransactionResponse
    const legs: Leg[] = []

    for(const ix of tx!.transaction!.message!.instructions){  // Iterate instructions (ix)
      const progId = tx!.transaction!.message!.accountKeys[ix.programIdIndex] // get ProgramId of ix
      const IDL: Idl = await getIDL(progId.toBase58())  // get IDL for ProgramId
      const decoder = new BorshInstructionCoder(IDL)    // init decoder with IDL
      let decodedIx = decoder.decode(ix.data,"base58")  // decode instruction data with decoder

      if (decodedIx){
        // get Accounts Meta to format it
        let accountMetas: AccountMeta[] = []
        ix.accounts.forEach(iix => {
          let account: AccountMeta = {
            pubkey: tx!.transaction!.message!.accountKeys[iix],
            isSigner: tx!.transaction!.message!.isAccountSigner(iix),
            isWritable: tx!.transaction!.message!.isAccountWritable(iix)
          }
          accountMetas.push(account)
        })
        const formatIx = decoder.format(decodedIx!, accountMetas)

        // Get source, destination accounts of swap instruction
        let source = null
        let destination = null
        let amm = null

        // Account mapping to get Source, Destination, Amm accounts
        const accountMapping = accountNamesMapping[decodedIx.name];
        if (accountMapping){
          source = formatIx!.accounts!.find(
            ({name}) => name === accountMapping.source
          )
          destination = formatIx!.accounts!.find(
            ({name}) => name === accountMapping.destination
          )
          amm = formatIx!.accounts!.find(
            ({name}) => name === accountMapping.amm
          )
        } else {
          continue
        }

        // Specific Whirlpool 'aToB' value
        if(decodedIx.name == 'whirlpoolSwap' || decodedIx.name == 'whirlpoolSwapExactOutput'){
          const test = formatIx!.args!.find(
            ({name}) => name === 'aToB'
          )
          if (test!.data !== "true") {
            [source, destination] = [destination, source]
          }
        }

        // get Index of AccountKeys from PubKey
        const indexSour = tx!.transaction!.message!.accountKeys.indexOf(source!.pubkey)
        const indexDest = tx!.transaction!.message!.accountKeys.indexOf(destination!.pubkey)
        // get Source TokenBalances from Index
        const postSourceBalance = tx!.meta!.postTokenBalances!.find(
          ({accountIndex}) => accountIndex === indexSour
        )
        const preSourceBalance = tx!.meta!.preTokenBalances!.find(
          ({accountIndex}) => accountIndex === indexSour
        )

        // compute Source Amount (inAmount)
        let amountSource: number = Math.abs(+(preSourceBalance?.uiTokenAmount?.uiAmount ?? 0) - +(postSourceBalance?.uiTokenAmount?.uiAmount ?? 0))
        if (!amountSource && !postSourceBalance?.mint){ // if not TokenBalances, try Balances (SOL)
          amountSource = Math.abs(tx!.meta!.preBalances[0] - tx!.meta!.postBalances[0]) / 10**9      // ToDo deduct Txfees /////////////////////////////////////////////////// /!\
        }
        // get Desination TokenBalances from Index
        const postDestinationBalance = tx!.meta!.postTokenBalances!.find(
          ({accountIndex}) => accountIndex === indexDest
        )
        const preDestinationBalance = tx!.meta!.preTokenBalances!.find(
          ({accountIndex}) => accountIndex === indexDest
        )

        // compute Destination Amount (outAmount)
        let amountDestination: number = Math.abs(+(preDestinationBalance?.uiTokenAmount?.uiAmount ?? 0) - +(postDestinationBalance?.uiTokenAmount?.uiAmount ?? 0))
        if (!amountDestination && !postDestinationBalance?.mint){ // if not TokenBalances, try Balances (SOL)
          amountDestination = Math.abs(tx!.meta!.preBalances[0] - tx!.meta!.postBalances[0])  / 10**9    // ToDo impact of  Txfees ??????????
        }

        // create Leg object
        // Maybe replace 'Native SOL' by 'So11111111111111111111111111111111111111112' according to the use case..
        const leg = new Leg(amountSource, postSourceBalance?.mint ?? 'Native SOL', amountDestination, postDestinationBalance?.mint ?? 'Native SOL', amm!.pubkey!.toBase58())
        legs.push(leg)
      }
    }

    if (legs.length > 0) {
      // create Swap object
      const signature = tx!.transaction!.signatures[0]
      const owner = tx!.transaction!.message!.accountKeys[0].toBase58()
      const slot = tx!.slot
      const fee = tx!.meta!.fee
      const swap = new Swap(legs, signature, owner, slot, fee)

      return swap
    } else {
      return false
    }
  } catch(e){ // catch error
    console.log(e)
    return false
  }
}
