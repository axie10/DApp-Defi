import React, { Component } from "react";

import JamToken from "../abis/JamToken.json";
import StellartToken from "../abis/StellartToken.json";
import TokenFarm from "../abis/TokenFarm.json";

import Web3 from "web3";
import logo from "../logo.png";

import Navigation from "./Navbar";
import MyCarousel from "./Carousel";

class App extends Component {
  // Funcion que se ejecuta una vez el componente es montado
  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3();
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData();
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {

      // Cargar Web3
      window.web3 = new Web3(window.ethereum);

      // Eventos de metamask
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
      });

      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Chain changed:", chainId);
      });

      // Solicitar cuentas
      const accounts = await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log("result", result);
        })
        .catch((error) => {
          console.log(error);
        });

      console.log("Accounts ethereum: ", accounts);

    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      const accounts = await window.web3.eth.getAccounts();
      console.log("Accounts web3: ", accounts);
    } else {
      window.alert("¡Deberías considerar usar Metamask!");
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts[0]);
    this.setState({ account: accounts[0] });
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId();
    console.log("networkid:", networkId);

    // Cargar JamToken
    const jamTokenData = JamToken.networks[networkId];
    console.log("JamTokenData:", jamTokenData);

    if (jamTokenData) {
      const abi = JamToken.abi;
      console.log("abi", abi);
      const address = jamTokenData.address;
      console.log("address:", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ jamTokenContract: contract });
      setTimeout(() => {
        console.log("JamToken contract:", this.state.jamTokenContract);
        console.log("JamToken address:", this.state.jamTokenContract.methods.totalSupply().call());
      }, 1000);
    } else {
      // window.alert('¡El Smart Contract de JamToken no se ha desplegado en la red!')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      loading: true,
      jamTokenContract: {},
    };
  }

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/axie10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={logo}
                    className="App-logo"
                    alt=""
                    width="100%"
                    height="80%"
                  />
                </a>
                <h1>
                  DApp (Github: <a href="https://github.com/axie10">Axie10</a>)
                </h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
