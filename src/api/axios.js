import axios from 'axios'
import routes from './routes'

const instance = axios.create({
    baseURL: 'https://pkoin.net/Shifter/',
    timeout: 60000
})

export default routes(instance)
