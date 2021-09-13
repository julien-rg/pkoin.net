<template>
    <div class="transaction_card">
        <div class="wallets_addresses">

            <div class="purchase">
                <span class="label">Purchase wallet address</span>
                <span v-if="params.payment_address" class="purchase_wallet">{{ params.payment_address }}</span>
                <span v-else class="purchase_wallet">N/A</span>
            </div>

        </div>

        <div class="purchased_amount">

            <div class="label-wrapper">
                <span class="label">Purchased PKOIN</span>
            </div>
            <div class="pkoin_value">
                {{ params.pkoin_amount }}
            </div>

        </div>

        <i class="pi pi-arrow-right arrow"></i>

        <div class="spent_amount">

            <div class="label-wrapper">
                <span class="label">{{ params.сurrency }} spent</span>
            </div>

            <div class="spent_value">
                {{ params.currency_sent }}
            </div>

        </div>

        <div class="status">
            <span class="status_label">AWAITING FUNDS</span>
            <i class="pi pi-refresh refrash-icon"></i>
        </div>
    </div>
</template>

<script>

export default {
    name: 'TableCell',
    props: {
        params: Object
    },

    methods: {
        updateTransactionStatus() {

        }
    }
}
</script>

<style lang="sass" scoped>
.transaction_card
    display: flex
    justify-content: space-between
    align-items: center
    box-shadow: $shadow
    margin-bottom: 5px
    border-radius: 5px
    background: #fafafa

.purchase_wallet
    font-size: 0.9em

.purchased_amount
    width: 115px
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    padding: 0.5em 0em 0.5em 1em

    .pkoin_value
        display: flex
        width: 100%
        height: 100%
        font-size: 1.7em
        font-weight: bold

.wallets_addresses
    width: 300px
    display: flex
    flex-direction: column
    padding: 0.5em 1em
    

    .pkoin
        display: flex
        flex-direction: column
        margin-bottom: 7px

    .purchase
        display: flex
        flex-direction: column

.label
    font-size: 0.7em
    color: $main-blue

.spent_amount
    width: 150px
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    padding: 0.5em 1em

.status
    width: 190px
    display: flex
    justify-content: center
    align-items: center
    padding: 0.5em 1em

    .status_label
        font-size: .9em
        padding: 3px 5px
        background: $main-blue
        color: white
        font-weight: bold
        border-radius: 3px

    .refrash-icon
        margin-left: 10px
        cursor: pointer

.label-wrapper
    display: flex
    justify-content: center
    align-items: flex-start

.spent_value
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    font-size: 1.7em
    font-weight: bold

.arrow
    margin-top: 20px
</style>