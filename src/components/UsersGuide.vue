<template>
    <div class="guide mt-3">
        <section>
            <h5 class="mb-3 font-weight-bold">Common information</h5>
            <p class="m-0">- You can copy wallet address by clicking on it.</p>
            <p class="m-0">- Amount of PKOIN you see in the 'You get' field is an approximation. Final amount will be calculated when your funds are received, depending on the current exhange rate.</p>
        </section>

        <section class="mb-3 mt-5">
            <h5 class="mb-3 font-weight-bold">Possible transaction statuses</h5>
            <p class="mt-0 mb-2"><strong class="await">AWAITING FUNDS</strong> - we are waiting for your transaction to come.</p>
            <p class="mt-0 mb-2"><strong class="expired">EXPIRED</strong> - transaction timer has expired. The payment address is no longer valid.</p>
            <p class="mt-0 mb-2"><strong class="completed">COMPLETED</strong> - your funds were received. PKOINS are already on their way to your wallet.</p>
            <p class="mt-0 mb-2"><strong class="pending">PENDING</strong> - something has happened and your transaction must be completed manually. Please contact support.</p>
            <p class="mt-0 mb-2"><strong class="сonfirm">AWAITING CONFIRMATIONS</strong> - your transaction has appeared in a blockchain. We are waiting fot it to get confirmed.</p>
            <p class="mt-0 mb-2"><strong class="сonfirm">1-3 CONFIRMATIONS</strong> - a number of your transaction confirmations in the blockchain.</p>
        </section>
    </div>
</template>

<script>
export default {
    name: 'UsersGuide'
}
</script>

<style lang="sass" scoped>
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
</style>