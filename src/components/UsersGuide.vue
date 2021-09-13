<template>
    <div class="guide">
        <section>
            <h4>Common information</h4>
            <p>You can copy wallet address by clicking on it.</p>
            <p>Amount of PKOIN you see in the 'You get' field is an approximation. Final amount will be calculated when your funds are received, depending on the current exhange rate.</p>
        </section>

        <section>
            <h4>Possible transaction statuses:</h4>
            <p><span class="await bold">AWAITING FUNDS</span> - we are waiting for your transaction to come.</p>
            <p><span class="expired bold">EXPIRED</span> - transaction timer has expired. The payment address is no longer valid.</p>
            <p><span class="completed bold">COMPLETED</span> - your funds were received. PKOINS are already on their way to your wallet.</p>
            <p><span class="pending bold">PENDING</span> - something has happened and your transaction must be completed manually. Please contact support.</p>
            <p><span class="сonfirm bold">AWAITING CONFIRMATIONS</span> - your transaction has appeared in a blockchain. We are waiting fot it to get confirmed.</p>
            <p><span class="сonfirm bold">1-3 CONFIRMATIONS</span> - a number of your transaction confirmations in the blockchain.</p>
        </section>
    </div>
</template>

<script>
export default {
    name: 'UsersGuide'
}
</script>

<style lang="sass" scoped>
section
    line-height: .5em
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
</style>