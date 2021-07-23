import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json';
import { Progress, Box, useToast, Button } from "@chakra-ui/react"

export const App = () => {

  const [account, setAccount] = useState('')
  const [contract, setContract] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0)
  const [colors, setColors] = useState([])
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  useEffect(async () => {
    await loadWeb3()
    await loadBlockchainData()
  }, [])



  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  const loadBlockchainData = async () => {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if (networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract)
      const totalSupply = await contract.methods.totalSupply().call()
      setTotalSupply(totalSupply)
      // Load Colors

      contract.methods.getColorsByOwner(accounts[0]).call().then((result) => {
        setColors(result)
      })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  const loadColorData = () => {
    setLoading(true);
    contract.methods.getColorsByOwner(account).call().then((result) => {
      setColors(result)
      toast({
        title: `Load success !`,
        position: 'top-right',
        isClosable: true,
      })
      setLoading(false);
    })
  }

  const mint = (color) => {
    contract.methods.mint(color).send({ from: account })
      .once('receipt', (receipt) => {
        setColors((oldValue) => {
          return [...oldValue, color]
        })
        loadColorData();
        toast({
          title: `Tạo color thành công`,
          position: 'top-right',
          isClosable: true,
        })
      })
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Crypto Colors
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              {loading && <Progress size="xs" isIndeterminate />}
              <h1>Color</h1>
              <form onSubmit={(event) => {
                event.preventDefault()
                mint(color)
              }}
                style={{ width: '400px' }}
              >
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='e.g. #FFFFFF'
                  onChange={(e) => setColor(e.target.value)}
                />
                <div style={{ display: 'flex' }}>
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                  <Button
                    isLoading={loading}
                    loadingText="Submitting"
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => { loadColorData() }}
                  >
                    Reload color
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
        <hr />
        <div className="row text-center">
          {colors.map((color, key) => {
            return (
              <Box key={key} w="200px" h="300px" p={0} m={2} bg={'#' + color} color="white">
                {color}
              </Box>
            )
          })}
        </div>
      </div>
    </div>
  );

}

export default App;
