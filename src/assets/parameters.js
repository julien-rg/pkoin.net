/*
--fix
Здесь по-хоршему ссылки на иконки нужно добавить в объекты массива currencies
При попытке добавить их туда приложение падало, поэтому как временное решение ссылки хранятся в coin_logos

Из-за такой организации хранения ссылок, в коде можно встретить функцию-костыль getCurrencyIcon()
Если собрать всю информацию в currencies, то этот костыль можно будет убрать

*/

const parameters = {
    currencies: [
        {name: 'Bitcoin (BTC)', code: 'BTC'},
        {name: 'Ethereum (ETH)', code: 'ETH'},
        {name: 'Tether (USDT) ERC-20', code: 'USDT'},
        // {name: 'Binance Coin (BNB) ERC-20', code: 'BNB'},
        {name: 'Dogecoin (DOGE)', code: 'DOGE'},
        {name: 'XPR (XRP)', code: 'XRP'},
        {name: 'Uniswap (UNI) ERC-20', code: 'UNI'},
        {name: 'Bitcoin Cash (BCH)', code: 'BCH'},
        {name: 'Litecoin (LTC)', code: 'LTC'},
        {name: 'Stellar (XLM)', code: 'XLM'},
        {name: 'TRON (TRX)', code: 'TRX'},
        {name: 'DAI (DAI) ERC-20', code: 'DAI'},
        {name: 'NEO (NEO)', code: 'NEO'},
        {name: 'Bitcoin SV (BSV)', code: 'BSV'},
        {name: 'Dash (DASH)', code: 'DASH'},
        {name: 'Zcash (ZEC)', code: 'ZEC'},
        {name: 'Basic Attention Token (BAT) ERC-20', code: 'BAT'},
        {name: 'New Economy Movement (XEM)', code: 'XEM'},
    ],

    coin_logos: [
        {name:'BTC', link:'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=013'},
        {name:'ETH', link:'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=013'},
        {name:'USDT', link:'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=013'},
        // {name:'BNB', link:'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=013'},
        {name:'DOGE', link:'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=013'},
        {name:'XRP', link:'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=013'},
        {name:'UNI', link:'https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=013'},
        {name:'BCH', link:'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=013'},
        {name:'LTC', link:'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=013'},
        {name:'XLM', link:'https://cryptologos.cc/logos/stellar-xlm-logo.svg?v=013'},
        {name:'TRX', link:'https://cryptologos.cc/logos/tron-trx-logo.svg?v=013'},
        {name:'DAI', link:'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=013'},
        {name:'NEO', link:'https://cryptologos.cc/logos/neo-neo-logo.svg?v=013'},
        {name:'BSV', link:'https://cryptologos.cc/logos/bitcoin-sv-bsv-logo.svg?v=013'},
        {name:'DASH', link:'https://cryptologos.cc/logos/dash-dash-logo.svg?v=013'},
        {name:'ZEC', link:'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=013'},
        {name:'BAT', link:'https://cryptologos.cc/logos/basic-attention-token-bat-logo.svg?v=013'},
        {name:'XEM', link:'https://cryptologos.cc/logos/nem-xem-logo.svg?v=013'}
    ]
}

export default parameters
