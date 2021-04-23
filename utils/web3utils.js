// ethjs wrap
import Eth from 'ethjs';

const web3 = (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') ?
    new Eth(window.web3.currentProvider) :
    new Eth(new Eth.HttpProvider('http://localhost:7545'));

export { web3 };