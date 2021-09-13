export default instance => {
    return {
        getCurrencyRates() {
            return instance.get('PocShifter/GetCurrencyRates')
        },

        buyPKOIN(currency, pAddress, email = '') {
            return instance.get(`PocShifter/${currency}/${pAddress}?payload=${email}`)
        },

        updateCurrenciesRates(){
            return instance.get('PocShifter/UpdateCurrenciesRates')
        },

        getPOCDealStatus(currency, pAddress){
            return instance.get(`PocShifter/GetPOCDealStatus?currency=${currency}&address=${pAddress}`)
        },

        updateHistoryStatuses(list) {
            return instance.get(`PocShifter/GetPOCDealStatus?list=${list}`)
        },

        submitSupportTicket({address, subject, text, email}) {
            return instance.post(`PocShifter/SupportTicket?paddress=${address}&subject=${subject}&text=${text}&email=${email}`)
        }
    }
}
