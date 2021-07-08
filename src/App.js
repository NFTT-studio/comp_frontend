import './App.css';
import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import CompContractUtil from "./CompContract";
import {
  Container,
  AppBar,
  Toolbar,
  Grid,
  TextField,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog, Chip,

} from '@material-ui/core';
import DataApi from "./DataApi";
import RecentlyToken from "./RecentlyToken";
import MyToken from "./MyToken";
import Timer from "./componets/timer/Timer";
import MaskCard from "./componets/maskcard/MaskCard";
import About from "./componets/about/About";



const style_root={
  // backgroundColor:,
  paddingTop: "80px",

  // margin:"20px"
};
const style_flex_center={
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
}
const section_title={
  marginBottom:"10px",
  marginTop: "40px"
}

class App extends React.Component{
  //global provider
  provider
  compContractUtil

  constructor() {
    super();
    this.state = {
      currentAccount:"",
      currentMint:[],
      chainId:"0x3",
      luckyNumber:null,
      pendding:false,
      newToken:null,
      penddingTx: localStorage.getItem("penddingTx"),
      openLuckyAdvice:false,
      cooltime:0,
      isInstallMetaMask:true,
      alertMessage:""
    };
  }
  _isMainChain=()=>{
     return this.state.chainId === "0x3";
   }

  async componentDidMount(){

    this.provider = await detectEthereumProvider();

    if (this.provider) {

      this.provider.on('chainChanged', this.handleChainChanged);
      this.provider.on('accountsChanged',this.handleAccountsChanged);
      this.provider.on('connect',this.handleConnect);
      this.provider.on('disconnect',this.handleDisconnect);

      this.compContractUtil = new CompContractUtil(this.provider);

      if(!this.state.currentAccount){
        this.setState({chainId:  await this.provider.request({ method: 'eth_chainId' })});
        await this.requestAccount();


        if(null !== this.state.penddingTx && null !== this.state.currentAccount && this._isMainChain()){

          this._checkTx();

          //clear
          let tx = await this.compContractUtil.getTransaction(this.state.penddingTx);
          if(null !== tx && tx.blockNumber >0){
            this.setState({penddingTx:null});
            localStorage.removeItem("penddingTx");
          }
        }
      }

    } else {
      this.setState({isInstallMetaMask:false})
      console.log('Please install MetaMask!');
    }

  }
  _handleConnectClick=async ()=>{
    if(!this.provider){
      this.setState({alertMessage:"Please Install MetaMask First"});
      return;
    }
    if(!this._isMainChain()){
      this.setState({alertMessage:"Please Select Ropsten Test Network First"})
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
    this.setState({chainId:_chainId});
  }

   handleAccountsChanged=async (accounts)=>{

    if(accounts[0] && accounts[0] !== this.state.currentAccount) {
      this.setState(
          {currentAccount : accounts[0]});

      if(!this._isMainChain()){

        return;
      }
      let [addressTokens,cooltime] = await Promise.all([ DataApi.fetchAddressTokens(accounts[0]),

        this.compContractUtil.cooltimeLeft(accounts[0])]);
      console.log(cooltime)
      this.setState({
          // {currentAccount : accounts[0],
                  currentMint: addressTokens.code!=="0"?[]:addressTokens.data,
            cooltime:cooltime
                });
      console.log(accounts[0]);

    }else {
      this.setState({currentAccount: "",currentMint:[]});
    }
  }
  handleMint=async ()=>{
    if(!this.provider){
      this.setState({alertMessage:"Please Install MetaMask First"});
      return;
    }
    if(!this._isMainChain()){
      this.setState({alertMessage:"Please Select Ropsten Test Network First"})
      return ;
    }

    if("" === this.state.currentAccount){
      this.requestAccount();
      return;
    }
    try {
      if(null === this.state.luckyNumber){
        this.setState({openLuckyAdvice:true});
        return;
      }
      this.setState({pendding:true});
      let tx = await this.compContractUtil.mint(this.state.luckyNumber);
      console.log(tx.hash);
      this.setState({penddingTx:tx.hash,pendding:false});
      // tx.gt
      localStorage.setItem("penddingTx",tx.hash);
      await this._checkTx();


    }catch(err){
      this.setState({pendding:false});
      console.error(err);
    }
  }

  _checkTx= async ()=>{

    let filter = this.compContractUtil.contract.filters.Transfer(null,this.state.currentAccount);

    this.compContractUtil.contract.once(filter,async (from,to,id)=>{
      console.log(to);
      let metadata = await this.compContractUtil.tokenMetadata(
          await this.compContractUtil.metadataURI(id)
      );
      console.log(metadata);
      this.setState({newToken: metadata,penddingTx:null});
      localStorage.removeItem("penddingTx");

      console.log(metadata);
    })

  }

  _handleLuckyNumberChange=(e)=>{

    this.setState({luckyNumber:e.target.value});

  }
  _handleClearTx=()=>{
    localStorage.removeItem("penddingTx")
    this.setState({penddingTx:null});
  }

  render() {
    // let classes = useStyles();
    return (
          <div  style={style_root}>
          <AppBar position={"fixed"} >
            <Toolbar >
              <Typography variant="h6" noWrap style={{flexGrow:1}}>
                Chinese Opera Mask Plus
              </Typography>

              {this.state.currentAccount&&
                <Typography variant="subtitle1" noWrap>
                 Address: {this.state.currentAccount}
                </Typography>
              }
              {!this.state.currentAccount &&
                <Button variant="contained" color={"secondary"} onClick={this._handleConnectClick}>Connect</Button>
              }
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" >
            <Grid container >
              {!this.state.isInstallMetaMask &&
              <Grid container style={style_flex_center}>
                <a href={"https://metamask.io/download.html"} rel={"noreferrer"} target="_blank"
                   style={{textDecoration: "none"}}>
                  <Button
                      // style={{padding: "40px", fontSize: "x-large", marginBottom: "40px"}}
                      variant="contained"
                      size={"large"}
                      color="secondary"
                  >Please click and install MetaMask!  https://metamask.io/download.html</Button>
                </a>
              </Grid>
              }
              {this.state.chainId!=="0x3" &&
              <Grid container style={style_flex_center}>
                  <Chip
                      style={{padding: "40px", fontSize: "x-large", marginBottom: "40px"}}
                      // label="Please select Ethereum Main Network (Mainnet)"
                      label="Please select Ropsten Test Network"
                      color="secondary"
                  />
              </Grid>
              }


            <Grid item xs={12}>
              <Typography variant="h4" style={section_title}>
                New mint
              </Typography>
              <RecentlyToken />
            </Grid>

            <Grid container style={{minHeight:"250px" ,padding:"40px", display:"flex",flexDirection:"row" ,marginTop:"20px"}}>

            <Grid item xs={12} style={{width:"300px",justifyContent:"center",alignItems:"center",flexDirection:"column",display:"flex"}}>

              {null === this.state.newToken &&
                  <Grid container>
                    {this.state.cooltime>0 &&
                      <Grid item xs={12} >
                        <Typography style={{textAlign:"center",color:"gray"}}>
                          You Mint Cooltime Left
                        </Typography>
                        <Timer seconds={this.state.cooltime} />
                      </Grid>
                    }
                    {this.state.cooltime === 0 && <Grid item xs={12} style={{
                      width: "300px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexGrow: 1,
                      display: "flex"
                    }}>
                      <TextField
                          onChange={this._handleLuckyNumberChange}
                          style={{width: "280px", textAlign: "center"}}
                          id="outlined-number"
                          label="Some magical things will happen"
                          type="number"
                          placeholder={"Enter your lucky number"}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                      />
                      <Button variant="contained" color="secondary" onClick={this.handleMint} style={{margin: "20px"}}
                              size={"large"}>Mint Free</Button>

                    </Grid>
                    }
                    {null !==this.state.penddingTx&&
                      <Grid time xs={12} style={{
                        margin: "10px",
                        justifyContent: "center",
                        alignItems: "center",

                        flexGrow: 1,
                        display: "flex",

                      }}> <CircularProgress color="secondary" size={20}/>
                      <Typography noWrap style={{marginLeft:"25px",color:"gray"}}>
                        TX detail:
                      </Typography>
                      <a style={{ color:"grey",margin:"15px"}} href={"https://etherscan.io/tx/"+this.state.penddingTx} rel="noreferrer" target={"_blank"}>{this.state.penddingTx}</a>
                        <Button size={"small"} variant={"outlined"}  onClick={this._handleClearTx}>clear</Button>
                      </Grid>
                    }
                    <Grid item xs={12} style={{justifyContent: "center", alignItems: "center", display: "flex",flexDirection:"column"}}>
                      <Typography style={{width:"680px",margin:"10px",color:"gray"}}>
                        1. Hold m <a target={"_blank"}  href={"https://etherscan.io/token/0xd81b71cbb89b2800cdb000aa277dc1491dc923c3"}>NMT</a> and get COMP NFT (m = The number of all minted NFTs )
                      </Typography>
                      <Typography style={{width:"680px",color:"gray"}}>
                        2. Free claim once every 4*n hours (n = The number of NFT minted at the current address)
                      </Typography>
                    </Grid>
                  </Grid>
              }

            {null !== this.state.newToken &&
                <Grid style={{justifyContent:"center",alignItems:"center",flexDirection:"column",display:"flex"}}>
                  <Typography color={"secondary"}  variant={"h3"} style={{margin:"20px"}}>
                    Congratulations on mint success!
                  </Typography>
                <MaskCard token={this.state.newToken}/>
                </Grid>
            }
          </Grid>
          </Grid>

              {this.state.currentMint.length > 0 &&
              <Grid item xs={12}>
                <Typography variant="h4" style={section_title}>
                  My Mint
                </Typography>
                <MyToken tokens={this.state.currentMint}/>
              </Grid>
              }

              <Grid item xs={12} >
                <Typography variant="h4" style={section_title}>
                  About
                </Typography>
                <About />
              </Grid>

        </Grid>
        </Container>
            <Backdrop  style={{
              zIndex: 1000000,
              color: '#fff',
            }} open={this.state.pendding} onClick={ this._handlePenddingClose }>
              <CircularProgress color="inherit" />
            </Backdrop>

            <AppBar position={"static"} style={{backgroundColor:"black",marginTop:"60px"}}>
              <Toolbar >
                <Typography variant="subtitle2" noWrap style={{flexGrow:1,margin:"50px"}} align={"center"} >
                  COMP©2021 CopyRight
                </Typography>
              </Toolbar>
            </AppBar>

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
            <Dialog
                open={this.state.openLuckyAdvice}
                onClose={() => this.setState({openLuckyAdvice: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Magic comes"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Don't forget to enter your lucky number
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="secondary" autoFocus onClick={() => this.setState({openLuckyAdvice: false})}>
                  OK
                </Button>
              </DialogActions>
            </Dialog>


          </div>

    );
  }
  _handlePenddingClose=()=>{
    this.setState({pendding:false})
  }
}

export default App;
