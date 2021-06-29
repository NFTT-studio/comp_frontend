import logo from './logo.svg';
import './App.css';
import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import CompContractUtil from "./CompContract";

class App extends React.Component{
  //global provider
  provider
  compContractUtil

  constructor() {
    super();

    this.state = {
      currentAccount:"",
      chainId:""
    };
  }

  async componentDidMount(){

    this.provider = await detectEthereumProvider();

    if (this.provider) {

      this.provider.on('chainChanged', this.handleChainChanged);
      this.provider.on('accountsChanged',this.handleAccountsChanged);
      this.provider.on('connect',this.handleConnect);
      this.provider.on('disconnect',this.handleDisconnect);

      this.compContractUtil = new CompContractUtil(this.provider,"0x35eaa50ef3c1541b842d67be181dda506b8a9cdb");

      if(!this.state.currentAccount){

        let accounts = await this.provider.request({ method: 'eth_requestAccounts' });
        this.handleAccountsChanged(accounts);

      }

    } else {
      console.log('Please install MetaMask!');
    }

  }

  handleDisconnect = (error)=>{
    console.error(error);
  }

  handleConnect=(connectInfo)=>{

    console.info(connectInfo);

  }

  handleChainChanged=(_chainId)=> {
    this.setState({chainId:_chainId});
  }

   handleAccountsChanged=async (accounts)=>{
     this.setState({currentAccount : accounts[0]});

  }

  handleMint=async ()=>{
    try {
      let tx = await this.compContractUtil.mint("baby",(data)=>{
          console.log("mint callback")
          console.log(data);
      });
      // tx.gt
      let filter = this.compContractUtil.contract.filters.TransferSingle(null,null,this.state.currentAccount);

      this.compContractUtil.contract.once(filter,(operator,from,to,id,value)=>{

      })
      // this.compContractUtil.listentx(tx.hash,(transaction)=>{
      //   console.log(transaction);
      // });

    }catch(err){
      console.info("i");
      console.error(err);
      console.info("baby");
    }
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React {this.state.currentAccount}
            </a>
            <div>
              <button onClick={this.handleMint}> mint </button>
            </div>
          </header>
        </div>
    );
  }
}

export default App;
