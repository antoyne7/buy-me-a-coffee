import Toasts from '../components/toast'
import styles from '../styles/Home.module.scss'

import useToasts from '../hooks/use-toasts'
import PageHead from '../components/head'

type TransactionParam = {
  to: string,
  from: string,
  value: string, // unit: wei https://eth-converter.com/
  chainId: string
}

const PUBLIC_ADDRESS = '0xAF39A39b9248d07bef05bf2B1F861C17258e5354'

const currencyParams = {
  eth: {
    value: '10000000000000',
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [],
  },
  matic: {
    value: '3000000000000000',
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
  }
}

function Home() {
  const { toasts, addToast, removeToast } = useToasts()

  async function requestWalletAccount(ethereum: any): Promise<string> {
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
    return account
  }

  async function switchEthereumChain(ethereum: any, currency: 'eth' | 'matic') {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currencyParams[currency].chainId }], // chainId must be in hexadecimal numbers
    });
  }

  async function addEthereumChain(ethereum: any, currency: 'eth' | 'matic') {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: currencyParams[currency].chainId,
        chainName: currencyParams[currency].chainName,
        nativeCurrency: currencyParams[currency].nativeCurrency,
        rpcUrls: currencyParams[currency].rpcUrls,
      }],
    });
  }

  async function sendTransaction(ethereum: any, transactionParameters: TransactionParam) {
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })
  }

  async function sendCoffee(currency: 'eth' | 'matic') {
    const { ethereum } = window
    if (!ethereum || !ethereum.isMetaMask) {
      addToast({ message: 'You need a Metamask wallet to send crypto', type: 'error' })
      return
    }

    const account = await requestWalletAccount(ethereum)

    try {
      await switchEthereumChain(ethereum, currency)
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await addEthereumChain(ethereum, currency)
        } catch (addError) {
          addToast({ message: 'Something went wrong :( Check console for more infos', type: 'error' })
          return
        }
      }
      if (switchError.code === 4001) {
        addToast({ message: 'You should allow network change', type: 'error' })
        return
      }
    }

    const transactionParameters: TransactionParam = {
      to: PUBLIC_ADDRESS,
      from: account,
      value: currencyParams[currency].value,
      chainId: currencyParams[currency].chainId
    };

    try {
      await sendTransaction(ethereum, transactionParameters)
      addToast({ message: 'Transaction successful ! Thank you !', type: 'success' })
    } catch (error) {
      addToast({ message: 'Something went wrong :( Check console for more infos', type: 'error' })
    }
  }

  return (
    <div className={styles.mainContainer}>
      <PageHead />

      <Toasts toasts={toasts} onExpire={removeToast} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy me a Coffee
        </h1>

        <button className={styles.button} onClick={() => sendCoffee('matic')}>
          Send MATIC coffee
        </button>
        <button className={styles.button} onClick={() => sendCoffee('eth')}>
          Send ETH coffee
        </button>
      </main>
    </div>
  )
}

export default Home
