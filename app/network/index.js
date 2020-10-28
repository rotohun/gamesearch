import Axios from 'axios';


class GameTimeNetwork {
    constructor() {
        const config = {

        }
        this.network = Axios.create({
            baseURL: 'https://mobile-staging.gametime.co/v1/search',
            timeout: 1000 
        })
    }
}