<template>
<div id="app">
	<Toast position="top-left" />
	<router-view></router-view>
	<!-- <PageFooter class="footer" color="white" /> -->
</div>
</template>

<script>
import Vue from 'vue'
import Toast from 'primevue/toast'
import PageFooter from '@/components/PageFooter.vue'
Vue.component('Toast', Toast)

export default {
	components: {
		PageFooter
	}
}
</script>


<style lang="sass">
body
	margin: 0
	overflow: hidden

#app 
	height: 100vh
	font-family: $Segoe
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale
	color: #2c3e50
	padding: 0

.fade-enter-active, .fade-leave-active
    transition: opacity 2s

.fade-enter, .fade-leave-to
    opacity: 0

</style>
