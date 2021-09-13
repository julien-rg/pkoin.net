<template>
	<div>
        <DataTable :value="data" stripedRows responsiveLayout="scroll">
            <Column headerStyle="width: 80px" field="pkoin_amount" header="Purchased"></Column>
            <Column headerStyle="width: 355px" field="user_аddress" header="Your PKOIN wallet address"></Column>
            <Column headerStyle="width: 355px" field="payment_address" header="Purchase address"></Column>
            <Column headerStyle="width: 150px" field="status" header="Status"></Column>
        </DataTable>
	</div>
    <!-- <Modal>
<DataTable :value="data">
    <template class="header" #header>
        <div class="table-header">
            Transactions
            <Button icon="pi pi-refresh" />
        </div>
    </template>
    <Column headerStyle="width: 50px" field="pkoin_amount" header="PKOIN pkoin_amount"></Column>
    <Column headerStyle="width: 120px" bodyStyle="word-break: break-word" field="user_аddress" header="Your PKOIN Wallet user_аddress"></Column>
    <Column headerStyle="width: 120px" field="payment_address" header="payment_address user_аddress"></Column>
    <Column headerStyle="width: 100px" field="status" header="Transaction status">
        <template #body="slotProps">
            <Tag v-if="true" class="p-mr-2" severity="info" value="AWAITING FUNDS" />
            <Tag v-if="false" class="p-mr-2" severity="success" :value="slotProps.data.status" />
            <Tag v-if="false" severity="danger" value="EXPIRED" />
            <Tag v-if="false" class="p-mr-2" severity="warning" value="PENDING" />
        </template>
    </Column>
    <Column headerStyle="width: 100px" header="Update Status">
        <template #body>
            <Button icon="pi pi-refresh" class="p-button-rounded p-button-text" />
        </template>
    </Column>
    <template #footer>
        Transactions in list: 5
    </template>
</DataTable>
    </Modal> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Modal from '@/components/UI/Modal'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
    name: 'TransactionsHistory',
    components: {
        Modal,
        DataTable,
        Column,
        ColumnGroup,
        Button,
        Tag
    },

    computed: {
        ...mapGetters([
            'transaction_history'
        ])
    },

    methods: {
        ...mapActions([
            'getTransactionsHistory'
        ]),

        async updateStatus() {

        },

        async updateTableInfo() {

        }
    },

    created() {
        this.getTransactionsHistory()
        this.data = this.transaction_history

        // console.log('@@@', this.transaction_history)
        // console.log('@@@', this.products.data)
    },

    data() {
        return {
            data: this.transaction_history

            // products: {
            //     data: this.transaction_history
            // }
        }
    }
}
</script>

<style lang="sass" scoped>
.table-header
    display: flex
    align-items: center
    justify-content: space-between


.product-image
    width: 100px
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)

::v-deep .p-datatable-header
    padding: $r $r * 2

::v-deep .p-datatable .p-datatable-tbody > tr > td
    padding: $r $r * 2
</style>