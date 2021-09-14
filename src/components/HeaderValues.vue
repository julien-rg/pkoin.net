<template>
    <transition name="fade" appear>

        <div class="header">
            <div class="header_item_wrapper" v-for="(logo, i) in logos" :key="i">
                <img class="logo" :src="logo.link" alt="coin_logo">
                <span class="header_item">{{ logo.name }}</span>
            </div>
        </div>

    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import parameters from '@/assets/parameters.js'

export default {
    name: 'HeaderValues',
    props: {
        color: String
    },

    computed: {
        ...mapGetters([
            'rates'
        ]),

        changeColor() {
            if(this.color === 'gray') return 'header_link_gray'
            if(this.color === 'white') return 'header_link_white'
        }
    },

    methods: {
        ...mapActions([
            'getCurrencyRates',
        ])
    },

    mounted() {
        setTimeout(() => this.header_is_ready = true, 600)
    },

    data() {
        return {
            pkoin_data: null,
            exchange_rates: null,
            header_is_ready: false,
            logos: parameters.coin_logos
        }
    },

    async created() {
        await this.getCurrencyRates()
        this.pkoin_data = this.rates.find(item => item.currency === 'PKOIN')
        this.exchange_rates = this.rates.filter(item => item.currency !== 'PKOIN')
    }
}
</script>

<style lang="sass" scoped>
.header
    width: 100%
    display: flex
    justify-content: space-between
    padding: 0 $r * 20
    flex-wrap: wrap

.header_item_wrapper
    display: flex
    flex-direction: column
    align-items: center
    padding: $r
    transition: transform .2s ease-in-out
    user-select: none

.header_item_wrapper:hover
    transform: scale(2)

.header_item
    font-size: 0.7em
    text-decoration: none

.header_link_gray
    color: $font-gray

.header_link_white
    color: white

.logo
    width: 20px
    height: 20px
    margin-bottom: 5px

@media only screen and (max-width: 1024px)
    .header
        padding: 0 $r * 5
</style>