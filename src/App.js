import './App.css';
import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import CompContractUtil from "./CompContract";
import {
  Button,
  Backdrop,
  CircularProgress,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog, Container, Grid, Toolbar, AppBar, Hidden, Typography,

} from '@material-ui/core';
import DataApi from "./DataApi";
import Vs from "./componets/vs/Vs";

import {withStyles} from "@material-ui/core";
import Footer from "./componets/footer/Footer";
import Header from "./componets/header/Header";
import {BrowserRouter as Router, Route, Switch, Redirect, HashRouter} from "react-router-dom";
import StandardList from "./componets/facebook/Facebook";
import Index from "./componets/index/Index";
import H5 from "./componets/h5/H5"
import {isMobile} from 'react-device-detect';
const useStyles = theme=>({
  root: {
    paddingTop: theme.spacing(10),
    minHeight: theme.spacing(120)
  },
  style_flex_center:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    marginTop:theme.spacing(4)
  }
});


class App extends React.Component{
  //global provider
  provider
  compContractUtil

  constructor() {

    super();
    this.state = {
      currentAccount:"",
      chainId:"0x1",
      isInstallMetaMask:true,
      alertMessage:"",
      showCp:false,
      atoken:null,
      btoken:null,
      pendding:null,
      standardList:[],
    };
  }
  _isMainChain=()=>{
     return this.state.chainId === "0x1";
   }

  async componentDidMount(){

    let standardArray = await  DataApi.getAllStandard();
    console.debug(standardArray);
    if(standardArray["code"]===0){
      this.setState({standardList: standardArray["data"]});
    }

    this.provider = await detectEthereumProvider();

    if (this.provider) {

      this.provider.on('chainChanged', this.handleChainChanged);
      this.provider.on('accountsChanged',this.handleAccountsChanged);
      this.provider.on('connect',this.handleConnect);
      this.provider.on('disconnect',this.handleDisconnect);
      this.compContractUtil = new CompContractUtil(this.provider);
      this.setState({chainId:  await this.provider.request({ method: 'eth_chainId' })});
      if(!this.state.currentAccount){
        await this.requestAccount();
      }
    } else {
      this.setState({isInstallMetaMask:false})
      console.log('Please install MetaMask!');
    }

  }
  _handleSwithChain = async() =>{

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
    } catch (switchError) {
      console.info(switchError);
    }
  }

  _handleConnectClick=async ()=>{
    if(!this.provider){
      this.setState({alertMessage:"Please Install MetaMask First"});
      return;
    }
    if(!this._isMainChain()){
      this.setState({alertMessage:"Please Select Ethereum Main Network First"})
      return ;
    }
    this.requestAccount();
  }

  requestAccount = async ()=>{
    let accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    await this.handleAccountsChanged(accounts);
  }

  handleDisconnect = (error)=>{
    console.error(error);
  }
  handleConnect=(connectInfo)=>{
    console.info(connectInfo);
  }

  handleChainChanged=(_chainId)=> {
    window.location.reload();
    // this.setState({chainId:_chainId});
  }

  handleAccountsChanged=async (accounts)=>{
    if(accounts[0]) {
      this.setState({currentAccount: accounts[0]});
    }else{
      this.setState({currentAccount: ""});
    }
  }

  _showDiff = (value)=>{
      //get gene info
      //get
    if(value){
      let mask =value.gene.split("_")[0];
      this.setState({
        atoken:this.state.standardList[mask],
        btoken:value,
        showCp:true
      });
    }

  }


  render() {
    const { classes } = this.props;

    return (
        <React.Fragment>
          <Router>
            <Header account={this.state.currentAccount} onConnect={this._handleConnectClick}/>
            <Container maxWidth="lg" className={classes.root} >
              <Grid container>
                {!this.state.isInstallMetaMask &&
                <Grid container className={classes.style_flex_center}>
                  <a href={"https://metamask.io/download.html"} rel={"noreferrer"} target="_blank"
                     style={{textDecoration: "none"}}>
                    <Button
                        variant="contained"
                        size={"large"}
                        color={"secondary"}
                    >Please click and install MetaMask!  https://metamask.io/download.html</Button>
                  </a>
                </Grid>
                }
                {this.state.chainId!=="0x1" &&
                <Grid container className={classes.style_flex_center}>
                  <Button
                      onClick={this._handleSwithChain}
                      variant={"contained"}
                      size={"large"}
                      color={"secondary"}
                  >
                    Click And Switch Ethereum Main Network
                  </Button>

                </Grid>
                }

            <Switch>
                <HashRouter>
              <Route path="/h5">
                <H5
                    onMessage={(message)=>{this.setState({alertMessage:message})}}
                    account={this.state.currentAccount}
                />
              </Route>
              <Route path="/facebook"><StandardList onTokenClick={this._showDiff}
                                                    standardList={this.state.standardList}/> </Route>
              <Route path="/"><Index
                  onMessage={(message)=>{this.setState({alertMessage:message})}}
                  account={this.state.currentAccount}
                  onTokenClick={this._showDiff}
                  onPendding={()=>{ this.setState({pendding:!this.state.pendding})  } }
                  /> </Route>
                </HashRouter>

            </Switch>
              </Grid>

            </Container>
          </Router>

          <Footer />

          <Hidden smUp>
          <AppBar position={"fixed"} style={{top: 'auto',bottom: 0}}>
            <Toolbar >
              <Grid item  xs={12} style={{display:"flex",justifyContent:"center",justifyItems:"center",alignItems:"center" }}>
                {this.state.currentAccount&&
                <Typography variant="subtitle1" noWrap style={{minWidth:"460"}} >
                  Address: {this.state.currentAccount}
                </Typography>
                }
                {!this.state.currentAccount &&
                <Button variant="contained" color={"secondary"} onClick={this._handleConnectClick}>Connect Wallet</Button>
                }
              </Grid>
            </Toolbar>
          </AppBar>
          </Hidden>

          <Backdrop  style={{
            zIndex: 1000000,
            // color: '#fff',
          }} open={this.state.pendding===true} onClick={()=> {this.setState({pendding:false})} }>
            <CircularProgress color="inherit" /> &nbsp; Please pay attention to the interaction of MetaMask
          </Backdrop>

          <Dialog
              open={this.state.alertMessage!==""}
              onClose={()=>{this.setState({alertMessage:""})}}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.state.alertMessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{this.setState({alertMessage:""})}} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>

          {this.state.showCp &&
          <Vs open={this.state.showCp} atoken={this.state.atoken} btoken={this.state.btoken} onClose={()=>{this.setState({showCp:false}) }}/>
          }
        </React.Fragment>


    );
  }

}

export default withStyles(useStyles)(App)
