import { decodeIx } from "./parser";

(async () => {

  // Some examples for test
  
  //const txSig = '5snAJSJg9Kvt3KpYpixMZQoZfB3FxervpPC3y3jjeShSMQcmcRZDQtQYJzHrFkFY64WmwFhbcGiXmJgx2nQxxRst'  // JUPv3 USDC -> mSOL                     OK
  //const txSig = 'AzHLS6Cy73sQWgkcj1WoYvvSidqY9f78eE9BihCABcQZaVCfHazbH7SZU3F1pKuecei17vPEAMDAZg8T7SiQAVf'   // JUPv1 wrappedSOL -> USDC               OK
  //const txSig = 'GVa9EhEPsuLtBmLDSi7Do5WU99B9cBq7WASVipN3p73rGdN4865KRV9crYXBNNZPLeUDeJ73HxUCMrgZPPkKtci'   // JUPv2 Split Swap  DUST -> wrappedSOL   OK
  const txSig = 'TqFx6hFRwBG5o1K6D29PKsHeHRbNhUENzZsWHz9sjhMWeqFXoZMQQ3Dhp6QT81yY5dwG8bby57MxDRNRL5NBZQq'  // JUPv3 USDC -> native SOL               OK
  //const txSig = '5KdxeiGLjtHHZwZGQFM4t8oAZ8jJn6pA53vPgAHQNca3JQdwVYyEGPvX5XGnDWWuf5XRDZB7QNYT3odqY8TGZb93'  // JUPv2 USDC -> USDC                     NOK - ToDO use innerInstructions (transfert) ?
  //const txSig = '3EHS36VbEvXJEaBZfaHQqd7NnFJTXN5ZxqyNsVLvCagbu16nhSecgirR1VpCz2FgvihbMTgBGPrHFwEfrcZRB9MM'  // JUPv3 USDC -> ETH with PAI dust        OK

  const swap = await decodeIx(txSig)
  if (swap){
    console.log(swap)
  } else {
    console.log("This is not a swap transaction")
  }

})();
