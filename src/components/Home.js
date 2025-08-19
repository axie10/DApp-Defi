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
      // const accounts = await window.ethereum
      //   .request({ method: "eth_requestAccounts" })
      //   .then((result) => {
      //     console.log("result", result);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
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
      // console.log("abi", abi);
      const address = jamTokenData.address;
      // console.log("address:", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ jamTokenContract: contract });

      // const contractAddress = contract.options.address;
      // console.log("contractAddress", contractAddress);
      // const balance = await contract.methods
      //   .balanceOf(this.state.account)
      //   .call();
      // console.log("balance", balance);
      // const totalSupply = await contract.methods.totalSupply().call();
      // console.log("totalSupply", totalSupply);
      const jamTokenBalance = await contract.methods.balanceOf(this.state.account).call();
      this.setState({ jamTokenBalance }); 
    } else {
      window.alert(
        "¡El Smart Contract de JamToken no se ha desplegado en la red!"
      );
    }

    // Carga de StellartToken
    const stellartTokenData = StellartToken.networks[networkId];
    // console.log("StellartTokenData:", stellartTokenData);

    if (stellartTokenData) {
      const abi = StellartToken.abi;
      // console.log("abi", abi);
      const address = stellartTokenData.address;
      // console.log("address:", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ stellartTokenContract: contract });

      // const contractAddress = contract.options.address;
      // console.log("contractAddress", contractAddress);
      // const balance = await contract.methods
      //   .balanceOf(this.state.account)
      //   .call();
      // console.log("balance", balance);
      // const totalSupply = await contract.methods.totalSupply().call();
      // console.log("totalSupply", totalSupply);
      const stellartTokenBalance = await contract.methods.balanceOf(this.state.account).call();
      this.setState({ stellartTokenBalance });
    } else {
      window.alert(
        "¡El Smart Contract de StellartToken no se ha desplegado en la red!"
      );
    }

    // Cargar TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    console.log("TokenFarmData:", tokenFarmData);

    if (tokenFarmData) {
      const abi = TokenFarm.abi;
      // console.log("abi", abi);
      const address = tokenFarmData.address;
      // console.log("address:", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ tokenFarmContract: contract });

      // const contractAddress = contract.options.address;
      // console.log("contractAddress", contractAddress);
      // const stakingBalance = await contract.methods
      //   .stakingBalance(this.state.account)
      //   .call();
      // console.log("stakingBalance", stakingBalance);
      // const JamToken = await contract.methods.jamToken().call();
      // console.log("JamToken", JamToken);
    } else {
      window.alert(
        "¡El Smart Contract de TokenFarm no se ha desplegado en la red!"
      );
    }
    this.setState({ loading: false });
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.jamTokenContract.methods
      .approve(this.state.tokenFarmContract.options.address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transactionHash", hash);
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      loading: true,
      jamTokenContract: {},
      jamTokenBalance: 0,
      stellartTokenContract: {},
      stellartTokenBalance: 0,
      tokenFarmContract: {},
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
                    width="30%"
                    height="30%"
                  />
                </a>
                <h2>
                  DApp (Github: <a href="https://github.com/axie10">Axie10</a>)
                </h2>
                <h2>DApp (Balance)</h2>
                <p><span style={{ fontWeight: "bold" }}>Account:</span>{" "} {this.state.account}</p>
                <p>
                  <span style={{ fontWeight: "bold" }}>JamToken Contract:</span>{" "}
                  {this.state.jamTokenContract.options?.address}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>JamToken Balance:</span>{" "}
                  {this.state.jamTokenBalance}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    StellartToken Contract:
                  </span>{" "}
                  {this.state.stellartTokenContract.options?.address}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>StellartToken Balance:</span>{" "}
                  {this.state.stellartTokenBalance}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    TokenFarm Contract:
                  </span>{" "}
                  {this.state.tokenFarmContract.options?.address}
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
