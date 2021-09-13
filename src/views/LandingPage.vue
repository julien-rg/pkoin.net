<template>
    <div class="landing">

        <img class="landing_pic" src="@/assets/images/landing-background2.jpg" alt="background picture">

        <div class="landing-text-wrapper">
            <div class="landing-text">

                <img class="pocketnet_logo" src="@/assets/images/logobig.png" alt="Pocketnet logo">
                <h1 class="landing_header">Pocketcoin Exchange</h1>
                <h3 class="landing_subheader">Exchange most popular cryptocurrencies (BTC, ETH, USDT and 14 more) for Pocketcoin in a moment!</h3>
                
                <div class="landing_spend_wrapper">
                    <span class="landing_spend_header">I have</span>
                    <Dropdown 
                        v-model="currency" 
                        :options="currencies_list"
                        appendTo="body"
                        optionLabel="name" 
                    />
                </div>

                <Button class="calculate" @click="openPurchasePage" label="Calculate Value" />
            </div>

        </div>
        
        <PageFooter color="gray" class="footer" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'

import parameters from '@/assets/parameters.js'
import PageFooter from '@/components/PageFooter.vue'

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

export default {
    name: 'LandingPage',
    components: {
        Button,
        Dropdown,
        PageFooter
    },

    methods: {
        ...mapActions([
            'setSelectedCurrency'
        ]),

        openPurchasePage() {
            this.setSelectedCurrency(this.currency)
            this.$router.push({ path: 'exchange-form' })
        }
    },

    data() {
        return {
            currency: { name: 'Bitcoin (BTC)', code:'BTC' },
            currencies_list: null
        }
    },

    created() {
        this.currencies_list = parameters.currencies
    }
}

</script>

<style lang="sass" scoped>
.landing
    position: relative
    display: flex
    justify-content: center
    align-items: center
    color: $font-gray

    .landing-text
        position: absolute
        top: 0
        right: 0
        width: 50%
        height: 100vh
        background-color: transparent
        background: white
        padding: 12% $r 0 $r * 6

    .pocketnet_logo
        position: absolute
        top: $r * 4
        left: $r * 6.3
        width: 50px
        height: 50px
        margin-bottom: $r * 6

    .landing_header
        margin: 0
        margin-bottom: 60px
        font-size: 5.5em
        color: $header-color

    .landing_subheader
        font-size: 1.5em
        font-weight: normal
        margin-bottom: 60px

    .landing_pic
        width: 100%
        height: 100vh

    .landing_spend_wrapper
        width: 60%
        display: flex
        justify-content: flex-start
        margin-bottom: $r * 3

    ::v-deep .p-dropdown
        width: 50%
        margin-left: $r * 2
        margin-right: $r * 2

    .landing_spend_header
        font-size: 1.5em

.footer
    width: 40%
    position: absolute
    bottom: 20px
    right: 5%

.calculate
    margin-top: 20px

::v-deep .p-button
    width: 200px
    height: 45px
    background: $main-yellow
    border: 1px solid $main-yellow

::v-deep .p-button:hover
    background: $main-yellow
    border: 1px solid $main-yellow

@media only screen and (max-width: 1030px)
    .landing
        .landing_header
            font-size: 2.5em

        .landing-text
            padding: 30% 0.5em 0 3em

        .landing_spend_wrapper
            width: 100%

        .footer
            width: 45%
            right: 2%

@media only screen and (max-width: 768px)
    .landing 
        .landing-text
            width: 65%
        
        .footer
            width: 60%
            right: 3%

        ::v-deep .p-dropdown
            width: 78%

@media only screen and (max-width: 420px)
    .landing 
        .landing_pic
            width: 0
            height: 0

        .landing-text
            width: 100%

        .landing-text
            padding: 30% 1em 0 2em

        .landing_subheader
            font-size: 1.3em

        .pocketnet_logo
            left: 2em

        ::v-deep .p-dropdown
            width: 70%

@media only screen and (max-width: 360px)
    .landing 
        .landing_header
            margin-bottom: 0

        .landing_spend_header
            font-size: 1em

        .landing_spend_wrapper
            align-items: center
</style>