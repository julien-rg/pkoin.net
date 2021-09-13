<template>
    <div class="footer">

        <span @click="displayModal" :class="`footer_link ${changeColor}`">Contact Support</span>
        <span @click="displayPutchaseGuide" :class="`footer_link ${changeColor}`">User's guide</span>
        <span v-if="setButtonVisibility" @click="navigateToPaymentForm" :class="`footer_link ${changeColor}`">Back to payment form</span>
        <span v-if="setButtonVisibility" @click="displayDeletionModal" :class="`footer_link ${changeColor}`">Clear transaction history</span>
        <span v-else @click="navigateToHistory" :class="`footer_link ${changeColor}`">Purchase history</span>

        <Dialog header="Header" :visible.sync="display" >
            <template #header>
                <h3>Support Ticket</h3>
            </template>

            <SupportModal @closeModal="displayModal" />

        </Dialog>

        <Dialog header="Clear history" :visible.sync="display_delete_confirmation" >
            <span>Are you sure you want to clear the transaction history? This action cannot be undone.</span>

            <div class="delete-btns">
                <Button @click.native="clearTransactionHistory" label="Yes" class="p-button-outlined yes" />
                <Button @click="displayDeletionModal" label="No" class="p-button-outlined p-button-danger" />
            </div>
        </Dialog>

        <Dialog header="User's guide:" :visible.sync="display_purchase_guide" >
        <section>
            <h4>Common information</h4>
            <p>- You can copy wallet address by clicking on it.</p>
            <p>- Amount of PKOIN you see in the 'You get' field is an approximation. Final amount will be calculated when your funds are received, depending on the current exhange rate.</p>
            <br>
            <br>

            <h4>Possible transaction statuses:</h4>
            <p><span class="await bold">AWAITING FUNDS</span> - we are waiting for your transaction to come.</p>
            <p><span class="expired bold">EXPIRED</span> - transaction timer has expired. The payment address is no longer valid.</p>
            <p><span class="completed bold">COMPLETED</span> - your funds were received. PKOINS are already on their way to your wallet.</p>
            <p><span class="pending bold">PENDING</span> - something has happened and your transaction must be completed manually. Please contact support.</p>
            <p><span class="сonfirm bold">AWAITING CONFIRMATIONS</span> - your transaction has appeared in a blockchain. We are waiting fot it to get confirmed.</p>
            <p><span class="сonfirm bold">1-3 CONFIRMATIONS</span> - a number of your transaction confirmations in the blockchain.</p>
        </section>
            <!-- <UsersGuide /> -->
        </Dialog>
    </div>
</template>

<script>
import Dialog from 'primevue/dialog'
import SupportModal from '@/components/SupportModal.vue'
import UsersGuide from '@/components/UsersGuide.vue'
import Button from 'primevue/button'

export default {
    name: 'PageFooter',
    props: {
        color: String
    },
    components: {
        Dialog,
        SupportModal,
        Button,
        UsersGuide
    },

    computed: {
        changeColor() {
            if(this.color === 'gray') return 'footer_link_gray'
            if(this.color === 'white') return 'footer_link_white'
        },

        includeNoEmptyFields() {
            return this.ticket_data.address && this.ticket_data.subject && this.ticket_data.text && this.ticket_data.email
        },

        setButtonVisibility() {
            if(this.$route.path === '/payment') return true

            return false
        },

        isTransactionHistoryEmpty() {
            return Object.keys(localStorage.getItem('transaction_history'))
        }
    },

    methods: {
        displayDeletionModal() {
            this.display_delete_confirmation = !this.display_delete_confirmation
        },

        displayPutchaseGuide() {
            this.display_purchase_guide = !this.display_purchase_guide
        },

        displayModal() {
            this.display = !this.display
        },

        navigateToHistory() {
            this.$router.push('payment')
            localStorage.removeItem('new_transaction')
        },

        navigateToPaymentForm() {
            this.$router.push('/')
        },

        clearTransactionHistory() {
            localStorage.setItem('transaction_history', JSON.stringify({}))
            this.$emit('historyDelete')
            this.displayDeletionModal()
        },
    },

    data() {
        return {
            display: false,
            display_delete_confirmation: false,
            ticket_data: null,
            ticket_validation_results: null,
            display_purchase_guide: false
        }
    }
}
</script>
s
<style lang="sass" scoped>
.footer
    display: flex
    justify-content: flex-end
    font-weight: bold

.footer_link
    font-size: 0.9em
    color: $font-gray
    text-decoration: none
    cursor: pointer
    margin: 0 $r * 2

.footer_link_gray
    color: $font-gray

.footer_link_white
    color: white

.delete-btns
    padding: 1em 1em 1em 0

.yes
    margin-right: 1em

::v-deep .p-dialog .p-dialog-header
    padding: $r $r * 2.2
    background: white
    color: gray

::v-deep .p-dialog .p-dialog-header h3
    margin: 0

::v-deep .p-dialog .p-dialog-content
    padding-bottom: $r * 2

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

.bold
    font-weight: bold

section
    line-height: .5

@media screen and (max-width: 768px)
    .footer
        display: flex
        flex-wrap: wrap
        line-height: 3
</style>