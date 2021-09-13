<template>
<!-- Это страница истории покупок /payment-->
    <div class="paymant-wrapper">

        <transition name="fade">
                <div v-if="history_is_ready" class="content-wrapper">

                    <h1 class="transactions-header">Transactions history</h1>

                    <div v-if="!statuses" class="loading">
                        Loading data... <i class="pi pi-spin pi-spinner" style="fontSize: 1rem; color: white"></i>
                    </div>

                    <div v-if="statuses && transaction_history_not_empty" class="cards-wrapper">
                        <div v-if="true" @click="sortTransactions" class="sort-btn">
                            <!-- <i class="pi pi-chevron-up sort"></i> -->
                            <!-- <span class="sort-label">Show 'awaiting funds' first</span> -->
                        </div>
                        <TableCell
                            v-for="item in statuses"
                            :key="item.id"
                            :params="item" 
                        />
                    </div>
                </div>
        </transition>
        <PageFooter @historyDelete="handleDeleteEmit" class="footer" color="white" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import TableCell from '@/components/UI/TableCell'
import TransactionCard from '@/components/UI/TransactionCard.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
    name: 'PaymentModal',
    components: {
        Button,
        ProgressSpinner,
        TableCell,
        PageFooter,
        TransactionCard,
        PageFooter
    },

    computed: {
        ...mapGetters([
            'status',
            'is_loading',
            'transaction_history',
            'current_history_statuses'
        ]),

        getTransactionHistory() {
            return this.transaction_history
        },

        getWalletAddress() {
            return localStorage.getItem('wallet_address')
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
            if(this.status?.status === 'AWAITINGFUNDS') return 'AWAITING FUNDS'
            if(this.status?.status === 'EXPIREDAWAITINGFUNDS') return 'EXPIRED'
            if(this.status?.status === 'POCSENT') return 'COMPLETED'
            if(this.status?.status === 'MANUAL') return 'PENDING'
            if(this.status?.status === 'CONFIRMATIONS0') return 'AWAITING CONFIRMATIONS'
            if(this.status?.status === 'CONFIRMATIONS1') return '1 CONFIRMATION'
            if(this.status?.status === 'CONFIRMATIONS2') return '2 CONFIRMATIONS'
            if(this.status?.status === 'CONFIRMATIONS3') return '3 CONFIRMATIONS'
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

        getHistoryStatuses() {
            return this.current_history_statuses
        },

        isMobileDevice() {
            return window.innerWidth <= 768
        },

        isTransactionHistoryEmpty() {
            if(!this.transaction_history) {
                localStorage.setItem('transaction_history', JSON.stringify({}))
            }

            return !(!!Object.keys(this.transaction_history))
        }
    },

    methods: {
        ...mapActions([
            'getPKOINDealStatus',
            'getTransactionsHistoryList',
            'updateHistoryTransactionStatuses'
        ]),

        createUpdatedHistoryList() {
            const updated_statuses = this.getHistoryStatuses ?? []
            const purchase_history = this.getTransactionHistory

            updated_statuses.forEach(item => {

                const wallet = item.address

                purchase_history[wallet].minutesLeft = item.minutesLeft
                purchase_history[wallet].status = item.status
            })

            return purchase_history
        },

        showClipboardNotification() {
            this.$toast.add({severity:'success', summary: '', detail:'Wallet address has successfully copied to clipboard', life: 3000})
        },

        showDataUpdateMessage() {
            this.$toast.add({severity:'success', summary: '', detail:'Transaction data has successfully updated', life: 3000})
        },

        //раз в минуту делает запрос на обновление статусов сделок, если они есть
        async longPolling() {
            if(!this.isTransactionHistoryEmpty) {
                this.updateAllTransactions()
    
                this.long_polling_timeout = setTimeout(() => {
                    this.longPolling()
                }, 60000)
            }
        },

        prepareRequestList(list) {
            const arr = Object.values(list)
            const actual_transactions = arr.filter(item => item.status !== 'EXPIREDAWAITINGFUNDS' && item.status !== 'POCSENT')

            return actual_transactions.map(item => {
                return {
                    Address: item.payment_address,
                    Currency: item.сurrency
                }
            })
        },

        handleDeleteEmit() {
            this.transaction_history_not_empty = false
        },

        async updateAllTransactions() {
            await this.getTransactionsHistoryList()

            const history = this.prepareRequestList(this.getTransactionHistory)

            if(history.length > 0) {
                await this.updateHistoryTransactionStatuses(JSON.stringify(history))
            }
            
            setTimeout(() => {
                this.statuses = Object.values(this.createUpdatedHistoryList())
                this.sortTransactions()
            }, 1000)

        },

        //Сортирует карточки в истории транзакций по времени (свежие наверх), помещая незакрытые сделки поверх всех остальных
        sortTransactions() {
            const awaiting_transactions = this.statuses.filter(item => item.status === "AWAITINGFUNDS")
            const other_statuses = this.statuses.filter(item => item.status !== "AWAITINGFUNDS")

            awaiting_transactions.sort((a, b) => b.date - a.date)
            other_statuses.sort((a, b) => b.date - a.date)

            this.statuses = [...awaiting_transactions, ...other_statuses]
        }
    },

    async created() {
        await this.updateAllTransactions()
        this.longPolling()

        setTimeout(() => {
            this.history_is_ready = true
        }, 400)
    },

    mounted() {

    },

    beforeDestroy() {
        clearTimeout(this.long_polling_timeout)
    },

    data() {
        return {
            statuses: null,
            history_is_ready: false,
            transaction_history_not_empty: true,
            long_polling_timeout: null
        }
    },

    watch: {
    }

}
</script>

<style lang="sass" scoped>
.content-wrapper
    width: 100%
    max-height: 60%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    overflow-y: auto

.paymant-wrapper
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 100vh
    background: url('../assets/images/history-background.jpg')
    background-position: center
    background-repeat: no-repeat
    background-size: cover

.transactions-header
    color: white

.cards-wrapper
    width: 45%
    display: flex
    flex-direction: column
    overflow-y: auto
    scrollbar-width: thin

.loading
    font-size: 1.4em
    color: white
    margin-bottom: 1em

.sort-btn
    padding: .3em 0
    margin-bottom: .3em
    color: white
    cursor: pointer
    text-decoration: underline dotted

.sort-label
    margin-left: .5em

@media only screen and (max-width: 2240px)
    .cards-wrapper
        width: 50%

@media only screen and (max-width: 2070px)
    .cards-wrapper
        width: 55%

@media only screen and (max-width: 1732px)
    .cards-wrapper
        width: 60%

@media only screen and (max-width: 1588px)
    .cards-wrapper
        width: 65%

@media only screen and (max-width: 1465px)
    .cards-wrapper
        width: 75%

@media only screen and (max-width: 1270px)
    .cards-wrapper
        width: 90%

@media only screen and (max-width: 1080px)
    .cards-wrapper
        width: 95%

@media only screen and (max-width: 768px)
    .content-wrapper
        max-height: 95%

@media only screen and (max-width: 520px)
    .purchase_wallet
        padding: 5px 0
</style>