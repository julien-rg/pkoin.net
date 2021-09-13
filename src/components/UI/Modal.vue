<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: 'Modal'
}
</script>

<style lang="sass" scoped>
.modal
    // width: 650px
    display: flex
    flex-direction: column
    box-shadow: $shadow
    border-radius: 5px
    padding: $r $r * 2
</style>