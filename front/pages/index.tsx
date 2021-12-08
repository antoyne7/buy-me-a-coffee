import type { NextPage } from 'next'

import Toasts from '../components/toast'
import styles from '../styles/Home.module.scss'

import useToasts from '../hooks/use-toasts'
import PageHead from '../components/head'

const PUBLIC_ADDRESS = '0xAF39A39b9248d07bef05bf2B1F861C17258e5354'

const currencyParams = {
  eth: {
    value: '10000000000000', // unit: wei https://eth-converter.com/
    chainId: '0x1'
  },
  matic: {
    value: '3000000000000000', // unit: wei https://eth-converter.com/
    chainId: '0x89'
  }
}

const Home: NextPage = () => {
  const { toasts, addToast } = useToasts()

  async function sendCoffee(currency: 'eth' | 'matic') {
    if (typeof window.ethereum === 'undefined') {
      addToast({ message: 'You need a Metamask wallet to send crypto', type: 'error' })
      return
    }

    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currencyParams[currency].chainId }], // chainId must be in hexadecimal numbers
    });

    const transactionParameters = {
      to: PUBLIC_ADDRESS,
      from: account,
      value: currencyParams[currency].value, // unit: wei https://eth-converter.com/
      chainId: currencyParams[currency].chainId
    };

    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })
      .then(() => {
        addToast({ message: 'Transaction successful ! Thank you !', type: 'success' })
      })
      .catch((err: any) => {
        console.log('err: ', { err })
        if (err.reason) {
          addToast({ message: err.reason, type: 'error' })
          return
        }
        addToast({ message: 'Something went wrong :( Check console for more infos', type: 'error' })
      });
  }

  return (
    <div className={styles.mainContainer}>
      <PageHead />

      <Toasts toasts={toasts} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy me a Coffee
        </h1>

        <button className={styles.button} onClick={() => sendCoffee('eth')}>
          Send ETH coffee
        </button>
        <button className={styles.button} onClick={() => sendCoffee('matic')}>
          Send MATIC coffee
        </button>
      </main>
    </div>
  )
}

export default Home
