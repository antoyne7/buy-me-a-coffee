import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json'
import Token from '../../artifacts/contracts/Token.sol/Token.json'

import Head from 'next/head'
import Card from '../components/card';

import styles from '../styles/Home.module.scss'

const GREETER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

const Home: NextPage = () => {
  const [greetingValue, setGreetingValue] = useState('')
  const [tokenPersonnalAmount, setTokenPersonnalAmount] = useState('')
  const [tokenToAddress, setTokenToAddress] = useState('')
  const [tokenToAmount, setTokenToAmount] = useState(0)

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return
    getTokenBalance()
  }, [])

  async function requestAccount() {
    return await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greetingValue) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greetingValue)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function getTokenBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, provider)
      try {
        const balance = await contract.balanceOf(account)
        console.log('account: %s,\nbalance: %s', account, balance.toString())
        setTokenPersonnalAmount(balance.toString())
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function sendToken() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer)
    try {
      const transaction = await contract.transfer(tokenToAddress, tokenToAmount)
      transaction.wait()
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  return (
    <div className={styles.mainContainer}>
      <PageHead />

      <main className={styles.main}>

        <h1 className={styles.title}>
          Buy me a Coffee
        </h1>

        <Card>
          <div>
            <button onClick={fetchGreeting}>fetch greetings</button>
          </div>
          <div>
            <button onClick={setGreeting}>set greeting</button>
            <input type="text" onChange={(e) => setGreetingValue(e.target.value)} value={greetingValue} placeholder="your greetings" />
          </div>
          <br />
          <br />
          <div>
            <button onClick={getTokenBalance}>refresh token balance</button>
            your balance: {tokenPersonnalAmount}
          </div>
          <div>
            <input type="text" onChange={(e) => setTokenToAddress(e.target.value)} value={tokenToAddress} placeholder="receiver address" />
            <input type="text" onChange={(e) => setTokenToAmount(parseFloat(e.target.value))} value={tokenToAmount} placeholder="0.000" />
            <button onClick={sendToken}>send</button>
          </div>
        </Card>

      </main>
    </div>
  )
}

export default Home


const PageHead = () => {
  return <Head>
    <title>Buy me a coffee</title>
    <meta name="description" content="Buy me a coffee app with metamask connection" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
}
