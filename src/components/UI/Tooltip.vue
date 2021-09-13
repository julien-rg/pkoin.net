<template>
    <div @mouseover="showTooltip" 
         @mouseleave="hideTooltip" 
         class="tooltip"
    >
        <i class="far fa-question-circle"></i>
        <div :class="`${is_displayed ? 'tooltip-text displayed' : 'tooltip-text'}`">{{ text }}</div>
    </div>
</template>

<script>

export default {
    name: 'Tooltip',
    props: ['text'],

    methods: {
        showTooltip() {
            this.is_displayed = true
        },

        hideTooltip() {
            this.is_displayed = false
        }
    },

    data() {
        return {
            is_displayed: false
        }
    }
}
</script>

<style lang="sass" scoped>
.tooltip
    position: relative
    width: 15px
    height: 15px
    cursor: pointer

.tooltip-text
    width: max-content
    max-width: 200px
    display: none
    position: absolute
    top: -20px
    left: 20px
    box-shadow: $shadow
    padding: $r * .5 $r
    font-size: 12px
    border-radius: 5px
    text-align: left
    z-index: 1000000
    background: white

.displayed
    display: block
</style>