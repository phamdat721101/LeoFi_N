// const Contract = require('web3-eth-contract');

// const tokenAbi = require("../abi/tokenAbi.json");
// const {provider} = require('../utils/provider')

// Contract.setProvider(provider)

// exports.setAdminToken = async(req) =>{
//     let contract = new Contract(tokenAbi, leofiCfg.leofiTokenAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await contract.methods.addWhiteListAddress(req.admin).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

const xrpl = require('xrpl')
const {leofiCfg, contractParams} = require('../config/vars')

exports.mint_nft = async () => {
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

exports.create_trustline = async(req) =>{
    const account = "rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k"

    // Connect to a testnet node
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    await client.connect()
    standbyResultField.value = results
            
    const standby_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const operational_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const currency_code = standbyCurrencyField.value
    const trustSet_tx = {
        "TransactionType": "TrustSet",
        "Account": standbyAccountField.value,
        "LimitAmount": {
        "currency": standbyCurrencyField.value,
        "issuer": standbyDestinationField.value,
        "value": standbyAmountField.value
        }
    }
    const ts_prepared = await client.autofill(trustSet_tx)
    const ts_signed = standby_wallet.sign(ts_prepared)
    results += '\nCreating trust line from operational account to standby account...'
    standbyResultField.value = results
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += '\nTrustline established between account \n' +
        standbyDestinationField.value + ' \n and account\n' + standby_wallet.address + '.'
        standbyResultField.value = results
    } else {
        results += '\nTrustLine failed. See JavaScript console for details.'
        document.getElementById('standbyResultField').value = results     
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
    }
}