import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		currency_rates: null,
		pkoin_deal_status: null,
		is_loading: false, //для дли спиннера загрузки. Если тут true, где-то на кнопке крутится спиннер
		transaction_history: null,
		selected_currency: { name: 'Bitcoin (BTC)', code:'BTC' },
		wallet_address: null,
		purschase_error_status: null, //тут статус ошибок, присылаемых сервером. Например, если номер PKOIN-кошелька невалидный
		purchased_currency_code: null,
		current_history_statuses: null
	},

	mutations: {
		SET_CURRENCY_RATES(state, rates) {
			state.currency_rates = rates
		},

		SET_WALLET_ADDRESS(state, address) {
			state.wallet_address = address
		},

		SET_PKOIN_DEAL_STATUS(state, status) {
			state.pkoin_deal_status = status
		},

		SET_LOADING_STATUS(state, status) {
			state.is_loading = status
		},

		SET_TRANSACTION_HISTORY(state, data) {
			state.transaction_history = data
		},

		SET_SELECTED_CURRENCY(state, currency) {
			state.selected_currency = currency
		},

		SET_PURCHASE_ERROR_STATUS(state, status) {
			state.purschase_error_status = status
		},

		SET_PURCHASE_CURRENCY_CODE(state, code) {
			state.purchased_currency_code = code
		},

		SET_CURRENT_HISROTY_STATUSES(state, data) {
			state.current_history_statuses = data
		}
	},

	actions: {
		async setSelectedCurrency({ commit }, currency) {
			commit('SET_SELECTED_CURRENCY', currency)
		},

		async getTransactionsHistoryList({ commit }) {
			const history = JSON.parse(localStorage.getItem('transaction_history'))
			commit('SET_TRANSACTION_HISTORY', history)
		},

		async getCurrencyRates({ commit }) {
			try {
				const response = await api.getCurrencyRates()
				commit('SET_CURRENCY_RATES', response.data)
				
			} catch(error) {
				console.error('Failed to get currency rates: ', error)
			}
		},

		async buyPKOIN({ commit }, data) {
			try {
				commit('SET_PURCHASE_ERROR_STATUS', null)

				const response = await api.buyPKOIN(data.currency, data.address, data.email)

				localStorage.setItem('purchased_currency', data.currency)
				localStorage.setItem('wallet_address', response.data)
				
				commit('SET_PURCHASE_CURRENCY_CODE', data.currency)
				commit('SET_WALLET_ADDRESS', response.data)
				
			} catch (error) {
				commit('SET_PURCHASE_ERROR_STATUS', error.response.data)
				console.error('Failed to buy PKOIN: ', error.response.data)
			}
		},

		/*
			--fix
			По-моему getPKOINDealStatus уже нигде не используется. Если да, можно выпилить аккуратно.
			Вместо него запросы делаются через updateHistoryTransactionStatuses
		*/
		async getPKOINDealStatus({ commit }, data) {

			try {
				commit('SET_LOADING_STATUS', true)
				const response = await api.getPOCDealStatus(data.currency, data.address)
				commit('SET_PKOIN_DEAL_STATUS', response.data[0])

			} catch (error) {
				console.error('Failed to get PKOIN deal status: ', error)

			} finally {
				setTimeout(() => {
					commit('SET_LOADING_STATUS', false)
				}, 1000)
			}
		},

		async updateHistoryTransactionStatuses({ commit }, data) {
			try {
				commit('SET_LOADING_STATUS', true)
				const response = await api.updateHistoryStatuses(data)

				const localStorageHistory = JSON.parse(localStorage.getItem('transaction_history'))

				response.data.forEach(item => {
					if (item)
						localStorageHistory[item.address].status = item.status
				})

				localStorage.setItem('transaction_history', JSON.stringify(localStorageHistory))

				commit('SET_CURRENT_HISROTY_STATUSES', response.data)
			} catch (error) {
				console.error('Failed update history statuses: ', error)
			} finally {
				setTimeout(() => {
					commit('SET_LOADING_STATUS', false)
				}, 1000)
			}
		},

		setDefaultWalletAddress({ commit }) {
			const address = localStorage.getItem('wallet_address')
			const code = localStorage.getItem('purchased_currency')

			commit('SET_WALLET_ADDRESS', address)
			commit('SET_PURCHASE_CURRENCY_CODE', code)
		}
	},

	getters: {
		rates: ({currency_rates}) => currency_rates,
		status: ({pkoin_deal_status}) => pkoin_deal_status || true,
		is_loading: ({is_loading}) => is_loading,
		transaction_history: ({transaction_history}) => transaction_history,
		selected_currency: ({selected_currency}) => selected_currency,
		wallet_address: ({wallet_address}) => wallet_address,
		get_purschase_error_status: ({purschase_error_status}) => purschase_error_status,
		get_purchased_currency_code: ({purchased_currency_code}) => purchased_currency_code,
		current_history_statuses: ({current_history_statuses}) => current_history_statuses
	}
})
