const xrpl = require('xrpl')

async function mint_nft() {
    const account = "rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k"

    // Connect to a testnet node
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    await client.connect()

    const standby_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": "rH4PVgbcK9ryvSp37gYYHhgYK3D47FGNY7",
        "URI": xrpl.convertStringToHex("x.com"),
        "Flags": parseInt("1"),
        "TransferFee": parseInt("0"),
        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
      }
    
    // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet} )
    const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
    })

    // ------------------------------------------------------- Report results
    results = '\n\nTransaction result: '+ tx.result.meta.TransactionResult
    results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)

    console.log("NFT creating resp: ", results)
   
    await client.disconnect()
}

module.exports = { mint_nft }