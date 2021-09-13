<template>

    <!-- Это карточка с 1 транзакцией в истории транзакций -->
    
    <div class="card">
        <div class="time">
            <span class="purchase_date">{{ calculateDateString(params.date) }}</span>
        </div>
        <div class="currency_spend">
            <div class="currency_wrapper">
                <span>{{ params.currency_sent }} {{ params.сurrency }}</span>
                <img class="coin_logo" :src="getCurrencyIcon(params.сurrency)" alt="coin_logo">
            </div>
            <i class="pi pi-arrow-right arrow"></i>
            <span class="pkoin">{{ params.pkoin_amount }}&nbsp;PKOIN</span>
        </div>

            <div v-if="isAvailableToCopy" class="purchase_wallet"
                ><span
                    v-clipboard:copy="params.payment_address"
                    v-clipboard:success="showClipboardNotification"
                >{{ params.payment_address  }}</span>
                <div class="cell_icons">
                    <i @click="showQRModal" class="fas fa-qrcode"></i>
                    <i class="pi pi-copy copy"
                        v-clipboard:copy="params.payment_address"
                        v-clipboard:success="showClipboardNotification"
                    ></i>
                </div>
            </div>

            <div v-else class="purchase_wallet"
                ><span
                    @click="showUnableToCopyToast"
                >{{ params.payment_address  }}</span>
                <div class="cell_icons">
                    <i @click="showUnableToCopyToast" class="fas fa-qrcode"></i>
                    <i class="pi pi-copy copy"
                        @click="showUnableToCopyToast"
                    ></i>
                </div>
            </div>

        <div class="amount_purchased">
            <div class="mins"> {{ calculateTimerStatus(params.minutesLeft) }}</div>
            <div :class="`transaction_status ${getLabelColor(params.status)}`">{{ calculatePKOINDealStatus(params.status) }}</div>
        </div>

        <Dialog header="QR code" :visible.sync="display_qr" >
            <canvas id="qr"></canvas>
        </Dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import qrcode from 'qrcode'
import parameters from '@/assets/parameters.js'

import Dialog from 'primevue/dialog'

export default {
    name: 'TableCell',
    
    components: {
        Dialog
    },

    props: {
        params: Object
    },

    computed: {
        ...mapGetters([
            'wallet_address'
        ]),

        getWalletAddress() {
            return this.wallet_address
        },

        isAvailableToCopy() {
            if(this.params.status === 'EXPIREDAWAITINGFUNDS') return false
            if(this.params.status === 'POCSENT') return false

            return true
        }
    },

    methods: {
        ...mapActions([
            'getPKOINDealStatus'
        ]),

        getCurrencyIcon(name) {
            const arr = parameters.coin_logos.filter(item => item.name === name)

            return arr[0].link
        },

        createQRCode() {
            const canvas = document.getElementById('qr')

            qrcode.toCanvas(canvas, this.params.payment_address, error => {
                if(error) console.error('Failed to create a QR-code:', error.message)
            })
        },

        showQRModal() {
            this.display_qr = !this.display_qr

            setTimeout(() => {
                this.createQRCode()
            })
        },

        showClipboardNotification() {
            this.$toast.add({severity:'success', summary: '', detail:'Wallet address successfully copied to clipboard', life: 3000})
        },

        showUnableToCopyToast() {
            this.$toast.add({severity:'warn', summary: '', detail:'Address is already used. Create a new deal', life: 4000})
        },

        calculatePKOINDealStatus(status) {
            if(status === 'AWAITINGFUNDS') return 'AWAITING FUNDS'
            if(status === 'EXPIREDAWAITINGFUNDS') return 'EXPIRED'
            if(status === 'POCSENT') return 'COMPLETED'
            if(status === 'MANUAL') return 'PENDING'
            if(status === 'CONFIRMATIONS0') return 'AWAITING CONFIRMATIONS'
            if(status === 'CONFIRMATIONS1') return '1 CONFIRMATION'
            if(status === 'CONFIRMATIONS2') return '2 CONFIRMATIONS'
            if(status === 'CONFIRMATIONS3') return '3 CONFIRMATIONS'
        },
        
        getLabelColor(status) {
            if(status === 'AWAITINGFUNDS') return 'await'
            if(status === 'EXPIREDAWAITINGFUNDS') return 'expired'
            if(status === 'POCSENT') return 'completed'
            if(status === 'MANUAL') return 'pending'
            if(status === 'CONFIRMATIONS0') return 'сonfirm'
            if(status === 'CONFIRMATIONS1') return 'сonfirm'
            if(status === 'CONFIRMATIONS2') return 'сonfirm'
            if(status === 'CONFIRMATIONS3') return 'сonfirm'
        },

        calculateTimerStatus(timer) {
            if(timer === 0) return '< 1 min. left'
            if(timer > 0) return `${timer} min. left`
            if(timer === null) return ''
        },

        calculateDateString(time_stamp) {
            if(!time_stamp) return ''

            const full_date = new Date(time_stamp).toLocaleString()
            const date = full_date.split(',')[0]
            const full_time = full_date.split(',')[1].split(':')

            const short_time = `${full_time[0]}:${full_time[1]}`

            const date_list = date.split('.')

            return `${date}, ${short_time}`
        },

    },

    data() {
        return {
            display_qr: false
        }
    }
}
</script>

<style lang="sass" scoped>
span
    text-align: center

.card
    display: grid
    grid-template-columns: 10% 24% 43% 24%
    background: white
    padding: $r $r * 3
    border-radius: 3px
    margin-bottom: .5em

.currency_spend
    display: flex
    justify-content: space-between
    align-items: center

.amount_purchased
    display: flex
    justify-content: space-between

.purchase_wallet
    display: flex
    justify-content: center
    align-items: center
    text-decoration: underline dotted
    cursor: pointer
    word-break: break-all

.transaction_status
    display: flex
    justify-content: center
    align-items: center
    font-weight: bold
    font-size: 1em
    text-align: center
    padding-left: 10px

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

.purchase_date
    font-weight: bold
    padding-right: 1em

.time
    display: flex
    justify-content: center
    align-items: center

.arrow
    margin: 0 .5em

.mins
    display: flex
    justify-content: center
    align-items: center
    text-align: center
    padding-left: 10px

.copy
    margin-left: .5em
    text-decoration: none !important

.cell_icons
    display: flex
    justify-content: center
    align-items: center
    padding-left: 1em

#qr
    width: 250px !important
    height: 250px !important

.coin_logo
    width: 20px
    height: 20px
    margin: 0 10px

.currency_wrapper
    display: flex
    justify-content: center
    align-items: center

@media only screen and (max-width: 1000px)
    .card
        font-size: 13px

@media only screen and (max-width: 810px)
    .card
        font-size: 12px

@media only screen and (max-width: 768px)
    .card
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center

    .arrow
        margin: 0 2em

    .purchase_wallet
        padding: .4em 0
        font-size: 1.3em

    .transaction_status
        margin-left: 1em

    .currency_spend
        padding: 5px 0 0 0

@media only screen and (max-width: 414px)
    .card
        font-size: 14px

    .purchase_wallet
        font-size: .9em
        padding: 5px 0

    .purchase_date
        padding-bottom: 5px

@media only screen and (max-width: 411px)
    .purchase_wallet
        font-size: .9em

@media only screen and (max-width: 375px)
    .purchase_wallet
        font-size: .9em

@media only screen and (max-width: 375px)
    .purchase_wallet
        font-size: .8em

@media only screen and (max-width: 280px)
    .transactions-header
        text-align: center
        
    .currency_spend
        font-size: .8em

    .purchase_wallet
        font-size: .7em

    .amount_purchased
        font-size: .8em
</style>