<template>
    <div class="transaction_block">

        <!-- Это компонент с QR котом и инфой по актуальной тразакции на странице / -->
        <!-- --fix Думаю, лучсше будет не запрашивать инфу с сервера здесь, а делать это в его родителе и передавать сюда пропсами -->

        <div class="transaction_section">
            <span class="header" v-if="calculatePKOINDealStatus !== 'EXPIRED'">Please send your {{ getPurchasedCurrencyCode }} to this address</span>
        </div>

        <div class="transaction_section">
            <div class="purchase">
                <span class="purchase_address" 
                    v-if="calculatePKOINDealStatus !== 'EXPIRED'"
                    v-clipboard:copy="getWalletAddress"
                    v-clipboard:success="showClipboardNotification"
                >{{ getWalletAddress }}</span>
                    <i class="pi pi-copy copy"
                        v-if="calculatePKOINDealStatus !== 'EXPIRED'"
                        v-clipboard:copy="getWalletAddress"
                        v-clipboard:success="showClipboardNotification"
                    ></i>
                <div>
                </div>
            </div>

            <span v-if="current_transaction.minutesLeft" class="payment_small-header">
                Address will be valid for the next
                <ProgressSpinner 
                    class="spinner" 
                    v-if="is_loading"
                />
                <strong v-else-if="status">{{ current_transaction.minutesLeft }}</strong>
                <strong v-else>60</strong>
                minutes
                <i class="pi pi-clock clock"></i>
            </span>
        </div>

        <div class="transaction_section">
            <div class="spending_params">
                <div class="qr-wrapper" ref="qrwrapper" v-if="calculatePKOINDealStatus !== 'EXPIRED'">
                    <span class="qr-wallet">Scan this QR-code to autofill address field in your {{ getPurchasedCurrencyCode }} wallet app:</span>
                    <canvas id="qr"></canvas>
                </div>

                <div v-if="is_loading" class="status_wrapper">
                    <span>Updating transaction status...&nbsp;<i class="pi pi-spin pi-spinner" style="fontSize: 1rem"></i></span>
                </div>
                <div v-else class="status_wrapper">
                    <span>Transaction status: <span :class="`label ${getLabelColor}` ">{{ calculatePKOINDealStatus }}</span></span>&nbsp;
                    <i @click="getTransactionStaus({currency: getPurchasedCurrencyCode, address: getWalletAddress})" class="pi pi-refresh refrash-icon"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import qrcode from 'qrcode'

import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import TableCell from '@/components/UI/TableCell'
import TransactionCard from '@/components/UI/TransactionCard.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
    name: 'PaymentBlock',
    components: {
        Button,
        ProgressSpinner,
        TableCell,
        PageFooter,
        TransactionCard
    },

    computed: {
        ...mapGetters([
            'status',
            'is_loading',
            'wallet_address',
            'get_purchased_currency_code',
            'current_history_statuses'
        ]),

        getPurchasedCurrencyCode(){
            return this.get_purchased_currency_code || localStorage.getItem('purchased_currency')
        },

        getTransactionHistory() {
            return localStorage.getItem('transaction_history')
        },

        getWalletAddress() {
            return this.wallet_address
        },

        getUserWalletAddress() {
            return localStorage.getItem('user_wallet_address')
        },

        getSentAmount() {
            return localStorage.getItem('paid_amount')
        },

        getAwaitingAmount() {
            return localStorage.getItem('await_pkoin_amount')
        },

        getCurrencyCode() {
            return localStorage.getItem('purchased_currency')
        },

        calculatePKOINDealStatus() {
            if(this.current_transaction?.status === 'AWAITINGFUNDS') return 'AWAITING FUNDS'
            if(this.current_transaction?.status === 'EXPIREDAWAITINGFUNDS') return 'EXPIRED'
            if(this.current_transaction?.status === 'POCSENT') return 'COMPLETED'
            if(this.current_transaction?.status === 'MANUAL') return 'PENDING'
            if(this.current_transaction?.status === 'CONFIRMATIONS0') return 'AWAITING CONFIRMATIONS'
            if(this.current_transaction?.status === 'CONFIRMATIONS1') return '1 CONFIRMATION'
            if(this.current_transaction?.status === 'CONFIRMATIONS2') return '2 CONFIRMATIONS'
            if(this.current_transaction?.status === 'CONFIRMATIONS3') return '3 CONFIRMATIONS'
        },

        getLabelColor() {
            if(this.calculatePKOINDealStatus === 'AWAITING FUNDS') return 'await'
            if(this.calculatePKOINDealStatus === 'EXPIRED') return 'expired'
            if(this.calculatePKOINDealStatus === 'COMPLETED') return 'completed'
            if(this.calculatePKOINDealStatus === 'PENDING') return 'pending'
            if(this.calculatePKOINDealStatus === 'CONFIRMATIONS0') return 'сonfirm'
            if(this.calculatePKOINDealStatus === 'CONFIRMATIONS1') return 'сonfirm'
            if(this.calculatePKOINDealStatus === 'CONFIRMATIONS2') return 'сonfirm'
            if(this.calculatePKOINDealStatus === 'CONFIRMATIONS3') return 'сonfirm'
        },

        getWindowWidth() {
            return window.innerWidth
        },

        getCurrentTransactionStatus() {
            return this.current_history_statuses
        }
    },

    methods: {
        ...mapActions([
            'getPKOINDealStatus',
            'setDefaultWalletAddress',
            'updateHistoryTransactionStatuses'
            
        ]),

        showClipboardNotification() {
            this.$toast.add({severity:'success', summary: '', detail:'Wallet address successfully copied to clipboard', life: 3000})
        },

        createQRCode() {
            const canvas = document.getElementById('qr')

            qrcode.toCanvas(canvas, this.getWalletAddress, error => {
                if(error) console.error('Failed to create a QR-code:', error.message)
            })
        },

        async longPolling() {
            await this.updateTransaction()

            if(this.current_transaction?.status !== 'POCSENT') {

            this.longPollingTimeOut = setTimeout(() => {
                    this.longPolling()
                }, 60_000)
            }
        },

        prepareRequestArray() {
            const address = localStorage.getItem('wallet_address')
            const currency = localStorage.getItem('purchased_currency')

            return [{"Address":address,"Currency":currency}]
        },

        async updateTransaction() {
            await this.updateHistoryTransactionStatuses(JSON.stringify(this.prepareRequestArray()))

            this.current_transaction = this.getCurrentTransactionStatus[0]
        },

        async getTransactionStaus(data) {
            try {
                await this.updateTransaction()
                this.$toast.add({severity:'success', summary: '', detail:'Transaction status updated', life: 3500})
            } catch (error) {
                this.$toast.add({severity:'error', summary: '', detail:'Failed to update transaction status', life: 3500})
            }
        }
    },

    watch: {
        getWalletAddress(newVal) {
            this.createQRCode()
        },

        wallet_address(newVal) {
            this.updateTransaction()
        }
    },

    data() {
        return {
            transaction_is_updating: false,
            longPollingTimeOut: null,
            current_transaction: ''
        }
    },

    created() {
        this.longPolling()
    },

    mounted() {
        
        setTimeout(() => {
            this.setDefaultWalletAddress()
            this.createQRCode()
        }, 500)
        
        if(this.getWindowWidth <= 420) this.$refs.qrwrapper.style.display = 'none'
    },

    beforeDestroy() {
        clearTimeout(this.longPollingTimeOut)
    }
}
</script>

<style lang="sass" scoped>
.transaction_block
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    color: $font-gray

    .transaction_section
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        width: 100%
        background: white
        border-radius: 5px
        margin-bottom: $r
        padding: $r $r * 2

    .header
        font-weight: bold

    .payment_small-header
        font-size: .8em
        color: $main-blue
        margin-top: 5px

    .purchase_address
        width: 100%
        font-size: 1.3em
        text-decoration: underline dotted
        cursor: pointer

    .payment_data
        display: flex
        flex-direction: column

    .spending_values
        display: flex
        margin-top: 1em

    .spend
        margin-right: 2em

    .wallet_wrapper
        display: flex
        flex-direction: column
        margin-top: 1em

    .label
        color: $main-blue
        font-weight: bold

    #qr
        width: 250px !important
        height: 250px !important

    .qr-wrapper
        width: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center

    .transaction_content_wrapper
        width: 49%

    .spending_params
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center

    .copy
        cursor: pointer
        margin-left: $r

    .refrash-icon
        cursor: pointer

    .spinner 
        width: 10px
        height: 10px

    .await
        color: $main-blue

    .expired
        color: red

    .completed
        color: green
        
    .pending
        color: orange

    .сonfirm
        color: blue

    .clock
        animation: rotating 2s linear infinite

    @keyframes rotating
        from
            transform: rotate(0deg)
        to
            transform: rotate(360deg)

@media only screen and (max-width: 420px)
    .copy
        display: none

    .transaction_block
        .purchase_address
            font-size: 14px

@media only screen and (max-width: 320px)
    .transaction_block
        .purchase_address
            font-size: 12px

    .header
        font-size: 14px

    .qr-wallet
        text-align: center

    .status_wrapper
        font-size: 11px
</style>