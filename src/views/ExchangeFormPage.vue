<template>
<div v-if="rates" class="exchange-wrapper">
    <HeaderValues class="exchange_header" color="white" />


    <div class="exchange_main">
        <transition name="fade">
            <div v-if="form_is_ready" class="exchange_content">
                <span class="exchange__header">Get PKOIN</span>

                <div class="exchange__info">
                    <span class="exchange__text">Limit: 
                        <span class="exchange__price">{{ pkoin_available }} PKOIN</span>
                    </span>

                    <div class="exchange_rates-wrapper">
                        <span class="exchange__text">1 PKOIN: {{ to_currency_amount }} {{ currency.code }} / {{ to_USD_amount }} USD</span>
                    </div>
                </div>

                <div class="exchange">
                    <div class="exchange__info-wrapper">

                            <span class="p-float-label">
                                <InputText class="form_email" id="email_address" type="text" v-model="email_address" />
                                <label for="email_address">Your email (optional)</label>
                            </span>

                            <span class="p-float-label">
                                <InputText id="wallet_address" type="text" v-model="wallet_address" />
                                <label for="wallet_address">Your PKOIN wallet address</label>
                            </span>
                            
                            <Dropdown 
                                class="input" 
                                v-model="currency" 
                                :options="currencies_list" 
                                optionLabel="name"
                                appendTo="body"
                            >
                            <template #value="slotProps">
                                    <div class="p-dropdown-coin-value">
                                        <span>{{ slotProps.value.name }}</span>
                                        <img class="drop_icon" :src="getCurrencyLogo(slotProps.value.code)" alt="">
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <div class="p-dropdown-coin-value">
                                        <span>{{ slotProps.option.name }}</span>
                                        <img class="drop_icon" :src="getCurrencyLogo(slotProps.option.code)" alt="">
                                    </div>
                                </template>
                            </Dropdown>

                            <div class="exchange-values">

                                <span class="p-float-label">
                                    <InputText @input="calculatePkoinAmount" id="paid_amount" type="text" v-model="paid_amount"/>
                                    <label v-if="isPaidAmountValid" for="paid_amount">You send ({{ currency.code }})</label>
                                    <label class="invalid_field" v-else for="paid_amount">Enter a number</label>
                                </span>

                                <span class="p-float-label">
                                    <InputText @input="calculatePaidAmount" id="pkoin_amount" type="text" v-model="pkoin_amount" />
                                    <label v-if="isPkoinValueValid" for="pkoin_amount">You get (PKOIN)</label>
                                    <label class="invalid_field" v-else for="pkoin_amount">Enter a number</label>
                                </span>

                            </div>

                    </div>
                </div>

                <div class="submit-btn-wrapper">
                    <div class="button-container">
                        <Button v-if="transaction_in_process" disabled class="p-button-outlined submit submit-disabled"><i class="pi pi-spin pi-spinner"></i></Button>
                        <Button v-else label="Purchase" @click="submit" class="p-button-outlined submit"/>

                        <!-- <Button v-if="isMobileDevice" label="Support" @click="displaySupportModal" class="p-button-outlined support-btn"/> -->
                    </div>
                </div>

            </div>
        </transition>

        <transition name="fade">
            <div v-if="transaction && current_transaction_freshness" class="payment">
                <PaymentBlock />
            </div>
        </transition>

    </div>



    <Dialog header="Header" :visible.sync="support_modal_visible" >
        <template #header>
            <h3>Support Ticket</h3>
        </template>

        <SupportModal @closeModal="handleSupportModalEmit" />
    </Dialog>

    <PageFooter class="footer" color="white" />

</div>
<!--<div v-else class="exchange-wrapper load-error">
    Something went wrong. Please reload the page (F5)
</div>-->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'


import SupportModal from '@/components/SupportModal.vue'
import PageFooter from '@/components/PageFooter.vue'
import HeaderValues from '@/components/HeaderValues.vue'
import PaymentBlock from '@/components/PaymentBlock.vue'

import parameters from '@/assets/parameters.js'

export default {
    name: 'ExchangeForm',
    components: {
        InputText,
        Dropdown,
        Button,
        Dialog,
        SupportModal,
        PageFooter,
        HeaderValues,
        PaymentBlock
    },

    computed: {
        ...mapGetters([
            'rates',
            'selected_currency',
            'status',
            'get_purschase_error_status',
            'transaction_history',
            'current_history_statuses'
        ]),

        getTransactionHistory() {
            return this.transaction_history
        },

        isPkoinValueValid() {
            let value = Number(this.pkoin_amount)

            return !(isNaN(value) && value !== '')
        },

        isPaidAmountValid() {
            let value = Number(this.paid_amount)

            return !(isNaN(value) && value !== '')
        },

        isPurchaseButtonActive() {
            return this.wallet_address && this.pkoin_amount && this.paid_amount && this.doesNotExceedLimit
        },

        doesNotExceedLimit() {
            return Number(this.pkoin_amount) <= Number(this.pkoin_available)
        },

        getCurrencyCode() {
            return localStorage.getItem('purchased_currency')
        },

        getWalletAddress() {
            return localStorage.getItem('wallet_address')
        },

        getMinutesLeft() {
            return this.status?.minutesLeft
        },

        isMobileDevice() {
            return window.innerWidth <= 768
        },

        getCurrentTransactionStatus() {
            return this.current_history_statuses
        }
    },

    async created(){
        console.log('re', this.getTransactionFreshness)

        

        this.current_transaction_freshness = Boolean(localStorage.getItem('new_transaction'))
        console.log('BOOL', this.current_transaction_freshness)


        setTimeout(() => {
            this.form_is_ready = true
        }, 400)

        this.checkTransactionActuality()

        await this.getCurrencyRates()

        this.currencies_list = parameters.currencies
        this.pkoin_data = this.rates.find(item => item.currency === 'PKOIN')
        this.currency = this.selected_currency
        this.to_currency_amount = this.selected_currency.toBTC?.toFixed(6) || this.pkoin_data.toBTC.toFixed(6)
        this.to_USD_amount = this.pkoin_data.toUSD.toFixed(6)
        this.currency_data = this.rates.find(item => item.currency === this.currency.code)
        this.pkoin_available = (500 / this.pkoin_data.toUSD).toFixed(2)
    },

    methods: {
        ...mapActions([
            'getCurrencyRates',
            'buyPKOIN',
            'getPKOINDealStatus',
            'setDefaultWalletAddress',
            'getTransactionsHistoryList',
            'updateHistoryTransactionStatuses'
        ]),

        prepareRequestList(list) {
            if(!list) list = {}
            const arr = Object.values(list)

            return arr.map(item => {
                return {
                    Address: item.payment_address,
                    Currency: item.сurrency
                }
            })
        },

        prepareRequestArray() {
            const address = localStorage.getItem('wallet_address')
            const currency = localStorage.getItem('purchased_currency')

            return [{"Address":address,"Currency":currency}]
        },

        async updateTransaction() {
            await this.updateHistoryTransactionStatuses(JSON.stringify(this.prepareRequestArray()))

            this.current_transaction = this.getCurrentTransactionStatus ? this.getCurrentTransactionStatus[0] : null
            console.log('!@!@!@ form', this.current_transaction)
        },

        async checkTransactionActuality() {
            // await this.getPKOINDealStatus({ currency: this.getCurrencyCode, address: this.getWalletAddress })
            await this.updateTransaction()

            // if(this.status?.status === 'EXPIREDAWAITINGFUNDS' || !this.status?.minutesLeft) {
            if(this.current_transaction?.status === 'EXPIREDAWAITINGFUNDS' || !this.current_transaction?.minutesLeft) {
                this.transaction = false
            } else {
                this.transaction = true
                this.form_is_ready = true
            }
        },

        showSupportModal() {
            this.display_support = !this.display_support
        },

        async submit() {
            this.transaction_in_process = true

            if(this.isPurchaseButtonActive) {
                await this.purchase({currency: this.currency.code, address: this.wallet_address, email: this.email_address})

                if(status === null) {
                    this.$toast.add({severity:'error', summary: 'Failed to purchase PKOIN. Please try later', detail:'', life: 3500})
                    this.transaction = false
                    this.transaction_in_process = false
                    return
                }

                if(this.get_purschase_error_status === 'POC address is not valid') {
                    this.$toast.add({severity:'error', summary: 'Such PKOIN wallet address doesn`t exist', detail:'', life: 3500})
                    this.transaction_in_process = false
                    return
                }
                
                if(this.get_purschase_error_status && this.get_purschase_error_status.includes('is not available')) {
                    this.$toast.add({severity:'error', summary: 'You can`t use this currency at this moment :( Try another one', detail:'', life: 3500})
                    this.transaction_in_process = false
                    return
                }

                this.$toast.add({severity:'warn', summary: `${this.pkoin_amount} PKOIN is an approximation. The final amount calculates depending on the exhange rate after your funds are received.`, detail:'', life: 7000})
    
                // localStorage.setItem('purchased_currency', this.currency.code)
                localStorage.setItem('await_pkoin_amount', this.pkoin_amount)
                localStorage.setItem('paid_amount', this.paid_amount)
                localStorage.setItem('user_wallet_address', this.wallet_address)
                localStorage.setItem('new_transaction', true)
                localStorage.setItem('logo', parameters.coin_logos[this.currency.code])

                this.current_transaction_freshness = true

                this.setDefaultWalletAddress()
                this.saveTransactionInfo()

                this.transaction = true
    
            } else {

                if(!this.doesNotExceedLimit) {
                    this.transaction_in_process = false
                    return this.$toast.add({severity:'warn', summary: 'Purchased amount of PKOINs exceeds the limit', detail:'', life: 3500})
                }

                this.$toast.add({severity:'warn', summary: 'Unable to submit: Either some of fields are empty or have invalid values', detail:'', life: 311500})
            }

            this.transaction_in_process = false
        },

        async purchase() {
            try {
                await this.buyPKOIN({currency: this.currency.code, address: this.wallet_address, email: this.email_address})
            } catch (error) {
                console.error('Failed to purchase PKOINs:', error)
                this.$toast.add({severity:'error', summary: 'Failed to purchase PKOIN. Please try later.', detail:'', life: 3500})
            }
        },

        calculatePaidAmount() {
            let value = Number(this.pkoin_amount)

            if (value) {
                this.paid_amount = (value * this.to_currency_amount).toFixed(6)
            } else {
                this.paid_amount = null
            }
        },

        calculatePkoinAmount() {
            let value = Number(this.paid_amount)

            if (value) {
                this.pkoin_amount = (value / this.to_currency_amount).toFixed(6)
            } else {
                this.pkoin_amount = null
            }
        },

        displaySupportModal() {
            this.support_modal_visible = !this.support_modal_visible
        },

        handleSupportModalEmit() {
            this.support_modal_visible = false
        },

        getCurrencyLogo(name) {
            const arr = parameters.coin_logos.filter(item => item.name === name)

            return arr[0].link
        },

        saveTransactionInfo() {
            const transaction_history = JSON.parse(localStorage.getItem('transaction_history')) ?? {}
            const payment_address = localStorage.getItem('wallet_address')

            transaction_history[payment_address] = {
                user_аddress: localStorage.getItem('user_wallet_address'), 
                сurrency: localStorage.getItem('purchased_currency'), 
                pkoin_amount: localStorage.getItem('await_pkoin_amount'),
                payment_address: localStorage.getItem('wallet_address'),
                currency_sent: localStorage.getItem('paid_amount'),
                status: 'AWAITING FUNDS',
                id: transaction_history.length,
                date: Date.now(),
                // logo: this.getCurrencyLogo(this.currency.code)
            }
            
            localStorage.setItem('transaction_history', JSON.stringify(transaction_history))
        }
    },

    watch: {
        currency(newVal) {
            this.currency_data = this.rates.find(item => item.currency === newVal.code)
            this.to_currency_amount = (this.pkoin_data.toBTC / this.currency_data.toBTC).toFixed(6)

            this.calculatePaidAmount()
        },

        getMinutesLeft(newVal) {
            if(newVal === 0) {
                this.transaction = false
            }
        }
    },

    mounted : function(){
        if(this.$route.query.address) this.wallet_address = this.$route.query.address
    },

    data() {
        return {
            currency: { name: 'Bitcoin (BTC)', code:'BTC' },
            currency_data: null,
            pkoin_data: null,
            currencies_list: null,
            wallet_address: null,
            email_address: null,
            pkoin_amount: null,
            paid_amount: null,
            to_currency_amount: null,
            to_USD_amount: null,
            pkoin_available: null,
            display_support: false,
            transaction: false,
            form_is_ready: false,
            transaction_in_process: false,
            support_modal_visible: false,
            current_transaction: null,
            current_transaction_freshness: false
        }
    }
}
</script>

<style lang="sass" scoped>
.exchange-wrapper
    height: 100%
    // position: relative
    display: flex
    flex-direction: column
    justify-content: center
    align-items: flex-start
    background: url('../assets/images/exchange-background.jpg')
    background-position: center
    background-repeat: no-repeat
    background-size: cover
    color: white
    align-items: center

.exchange_main
    width: 100%
    max-height: 76%
    overflow-y: auto
    margin-top: 100px

.exchange_content
    width: 27%
    margin: 0 auto

.p-inputtext
    width: 100%

.input
    width: 100%

.exchange
    display: flex
    flex-direction: column
    box-shadow: $shadow
    border-radius: 5px
    background-color: white
    padding: $r * 3 $r * 3 0

::v-deep .p-button.p-button-outlined
    width: 150px
    color: white
    border: 1px solid rgba(68, 145, 193, 0.7)

::v-deep .p-button.p-button-outlined:hover
    background: $main-blue
    color: white
    border: 1px solid $main-blue

::v-deep .p-dialog .p-dialog-header
    padding: $r $r * 3

::v-deep .p-dialog .p-dialog-header h3
    margin: 0

::v-deep .p-dialog .p-dialog-content
    padding-bottom: $r * 2

::v-deep .exchange__info-wrapper .exchange-values .p-float-label
    width: 48%

::v-deep .p-float-label
    margin-bottom: 25px

.exchange__info-wrapper
    .exchange-values
        width: 100%
        display: flex
        justify-content: space-between
        padding: 0 0 $r * 3

        .invalid_field
            color: $main-red

        .p-float-label
            margin-top: 25px

.exchange__header
    display: inline-block
    text-align: left
    font-size: $r * 6
    font-weight: bold
    margin-bottom: 20px

.exchange__info
    display: flex
    justify-content: space-between
    margin-bottom: 10px

.exchange__text
    font-size: 1.2em

.p-dropdown
    text-align: left

.submit-btn-wrapper
    position: relative
    display: flex
    flex-direction: column
    align-items: flex-start
    padding: $r * 2 0

.button-container
    width: 100%
    display: flex
    justify-content: space-between

.submit-node
    // margin-top: 10px
    position: absolute
    bottom: -25px
    
.submit
    background: rgba(68, 145, 193, .7)

.support-btn
    background: rgba(140, 203, 94, .7)
    border: 1px solid rgba(140, 203, 94, .7)

.support
    position: absolute
    bottom: $r * 3
    right: $r * 4
    cursor: pointer
    font-weight: bold
    font-size: 1.1em

.footer
    position: absolute
    bottom: $r * 1.5
    width: 90%

.exchange_header
    position: absolute
    top: 2em

.payment
    width: 27%
    background: transparent
    border-radius: 5px
    margin-top: 12px
    margin: 0 auto

.load-error
    font-size: 1.3em

::v-deep .pi-spinner
    font-size: 1.3em

::v-deep .p-button
    display: flex
    justify-content: center

.drop_icon
    width: 20px
    height: 20px
    margin-left: 10px

.p-dropdown-coin-value
    display: flex
    align-items: center

@media only screen and (max-width: 1851px)
    .exchange_content
        width: 32%

    .payment
        width: 32%

@media only screen and (max-width: 1560px)

    .exchange_content
        width: 48%

    .payment
        width: 48%

@media only screen and (max-width: 1024px)

    .exchange_content
        width: 85%

    .payment
        width: 85%

@media only screen and (max-width: 768px)
    .exchange_header
        top: .5em

    .exchange_content
        margin-top: 20px
    
    .footer
        width: 70%

@media only screen and (max-width: 540px)

    .submit-node
        position: static
        margin-top: 10px

    .bloks-wrapper
        width: 90%

    .exchange_main
        width: 100%

    .exchange__header
        font-size: 2em

    .exchange__text
        font-size: .85em
    
    .exchange_header
        padding: 0 1em
        position: absolute

    .exchange_content
        width: 90%

    .payment
        width: 90%

    .footer
        position: static
        width: 90%
        bottom: $r

    .exchange__info
        flex-direction: column

@media only screen and (max-width: 420px)

    .exchange_main
        height: 100%

    .exchange_main
        margin-top: 0

    .exchange_header
        display: none

    .footer
        top: 10px
        right: 10px
    
    .exchange-wrapper
        height: 105%

    .footer
        // bottom: -22%

@media only screen and (max-width: 375px)

    // .footer
        // bottom: -34%

@media only screen and (max-width: 360px)

    // .exchange_main
    //     height: 100%

    // .exchange_main
    //     margin-top: 0

    // .exchange_header
    //     display: none

@media only screen and (max-width: 320px)
    ::v-deep .p-button.p-button-outlined
        width: 100px

    .exchange
        padding: 1.5em .4em 0

    .exchange-wrapper
        justify-content: flex-start
        // padding-top: 20px

    ::v-deep .p-float-label
        font-size: 14px

    .footer
        // bottom: -62%
</style>