import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import CompContractUtil from "../../CompContract";
import {
    Grid,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    CircularProgress
} from '@material-ui/core';
import DataApi from "./../../DataApi";
import RecentlyToken from "../recentlytoken/RecentlyToken";
import MyToken from '../mytoken/MyToken'
import Timer from "../timer/Timer";
import MaskCard from "../maskcard/MaskCard";
import About from "../about/About";

import {withStyles} from "@material-ui/core";
import Contactgroup from "../contactgroup/contactgroup";
import Staking from "../staking/Staking";

const useStyles = theme=>({
    section_title:{
        marginBottom:theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    facebook:{
        justifyContent:"flex-end",
        display:"flex",
        alignItems:"flex-end" ,
        padding:theme.spacing(2),
        fontSize:theme.spacing(2.5),
        fontWeight:"bolder"
    },
    link_text: {
        textDecoration:"none",
        color:"white"
    }

});

class H5 extends React.Component{
    //global provider
    provider
    compContractUtil
    airdropamount = 100
    nmtContrctAddress="0xd81b71cBb89B2800CDb000AA277Dc1491dc923C3"
    constructor(props) {
        super(props);

        this.state = {
            currentMint:[],
            airdropConditions:this.nmtContrctAddress,
            newToken:null,
            penddingTx: localStorage.getItem("penddingTx"),
            cooltime:0,
            account:props.account,
            // totalToken:'',
            chainId:'',
        };
    }
    _isMainChain=()=>{
         return this.state.chainId === "0x1";
    }
    componentDidMount=async ()=>{

        this.provider = await detectEthereumProvider();

        if (this.provider) {
            this.compContractUtil = new CompContractUtil(this.provider);

            // this.provider.on('chainChanged', this.handleChainChanged);
            this.provider.on('accountsChanged',this.handleAccountsChanged);

            this.setState({chainId:  await this.provider.request({ method: 'eth_chainId' })});

            await  this.requestAccount();

            if(this._isMainChain()){

                if(this.state.account ){
                    await this._loadUserInfo();
                    if(null !== this.state.penddingTx && this._isMainChain()){
                        let tx = await this.compContractUtil.getTransaction(this.state.penddingTx);
                        if(null !== tx && tx.blockNumber >0 && tx.status>0){
                            this.setState({penddingTx:null});
                            localStorage.removeItem("penddingTx");
                        }else{
                            this._checkTx();
                        }
                    }
                }

            }


        }
    }
    handleChainChanged=(_chainId)=> {
        this.setState({chainId:_chainId});
    }
    requestAccount = async ()=>{
        let accounts = await this.provider.request({ method: 'eth_requestAccounts' });

        this.handleAccountsChanged(accounts);
    }

    _loadUserInfo= async ()=>{

        let [addressTokens,cooltime] = await Promise.all(
            [
            DataApi.fetchAddressTokens(this.state.account),
            this.compContractUtil.cooltimeLeft(this.state.account),
            ]
        );
        this.setState({
            currentMint: addressTokens.code!=="0"?[]:addressTokens.data,
            cooltime:cooltime

        });
    }
    handleAccountsChanged=async (accounts)=>{

        if(accounts[0] && accounts[0] !== this.state.account) {
            this.setState({account : accounts[0]});
            if(!this._isMainChain()){
                return;
            }
            await this._loadUserInfo();
        }else {
            this.setState({account: "",currentMint:[]});
        }
    }

    alertMessage(message) {
        if (this.props.onMessage) {
            this.props.onMessage(message);
        }
    }
    togglePenddingView(){
        if(this.props.onPendding){
            this.props.onPendding()
        }
    }

    handleMint=async ()=>{
        if(!this.provider){
            this.alertMessage("Please Install MetaMask First");
            return;
        }

        if(!this._isMainChain()){
            this.alertMessage("Please Select Ethereum Main Network First");
            return ;
        }

        if("" === this.state.account){
            this.requestAccount();
            return;
        }
        try {
                if(this.state.airdropConditions === ""){
                    const isOnWhitelist = await this.compContractUtil.isOnAirdropWhitelist(this.state.account);
                    if(!isOnWhitelist){
                        this.alertMessage("The current address is not in the whitelist");
                        return;
                    }
                }else{
                    const erc721balance = await this.compContractUtil.balanceOf(this.state.account ,this.state.airdropConditions);

                    if(erc721balance.toString() === "0"){
                        this.alertMessage("There are no related assets at the current address");
                        return;
                    }
                }
            this.togglePenddingView();
            let tx = await this.compContractUtil.mint(Date.now()+"",this.state.airdropConditions?this.state.airdropConditions:this.nmtContrctAddress);
            this.setState({penddingTx:tx.hash,pendding:false});
            // tx.gt
            localStorage.setItem("penddingTx",tx.hash);
            await this._checkTx();

            this.togglePenddingView();

        }catch(err){
            this.togglePenddingView();
            console.error(err);
        }
    }

    _checkTx= async ()=>{

        let filter = this.compContractUtil.contract.filters.Transfer(null,this.state.account);
        this.compContractUtil.contract.once(filter,async (from,to,id)=>{
            let metadata = await this.compContractUtil.tokenMetadata(
                await this.compContractUtil.metadataURI(id)
            );
            this.setState({newToken: metadata,penddingTx:null});
            localStorage.removeItem("penddingTx");

        });
        this.compContractUtil.provider.waitForTransaction(this.state.penddingTx,1).then((txr)=>{

            if(txr.status ===0 ){
                this.alertMessage("Transaction Error, Please Check it")
            }
            this.setState({penddingTx:null});
            localStorage.removeItem("penddingTx");

        });

    }

    _handleAirdropConditionsChange=(e)=>{
        this.setState({airdropConditions:e.target.value});
    }
    _handleClearTx=()=>{
        localStorage.removeItem("penddingTx")
        this.setState({penddingTx:null});
    }

    render(){
        const { classes } = this.props;
        return (
            <React.Fragment>
                        <Grid item xs={12}>
                            <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="h4" className={classes.section_title}>
                                New mint
                            </Typography>
                            </Grid>

                            </Grid>
                            <Grid style={{minHeight:"360px"}}>
                            <RecentlyToken h5={true}/>
                            </Grid>
                        </Grid>

                        <Grid container style={{minHeight:"250px" ,padding:"10px", display:"flex",flexDirection:"row" ,marginTop:"20px"}}>
                            <Grid item xs={12} style={{width:"300px",justifyContent:"center",alignItems:"center",flexDirection:"column",display:"flex"}}>
                                {null === this.state.newToken &&
                                <Grid container>
                                    {this.state.cooltime>0 &&
                                    <Grid item xs={12} >
                                        <Typography style={{textAlign:"center",color:"gray"}}>
                                            You Mint Cooltime Left
                                        </Typography>
                                        <Timer h5={true} seconds={this.state.cooltime} />
                                    </Grid>
                                    }
                                    {this.state.cooltime === 0 && <Grid item xs={12} style={{
                                        width: "300px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection:"column" ,
                                        display: "flex"
                                    }}>

                                        <FormControl variant="filled" >
                                            <InputLabel htmlFor="filled-age-native-simple">Airdrop conditions</InputLabel>
                                            <Select
                                                native
                                                onChange={this._handleAirdropConditionsChange}
                                                value={this.state.airdropConditions}
                                                inputProps={{
                                                    name: 'conditions',
                                                    id: 'filled-conditions-native-simple',
                                                }}
                                            >
                                                    <option value={this.nmtContrctAddress}>I Hold 1 NMT</option>
                                                    <option value={"0x69af81e73a73b40adf4f3d4223cd9b1ece623074"}>I Hold 1 MASK</option>

                                                    <option value={"0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d"}>I Hold 1 FIS</option>
                                                    <option value={"0x6c5bA91642F10282b576d91922Ae6448C9d52f4E"}>I Hold 1 PHA</option>
                                                    <option value={"0xe63d6b308bce0f6193aec6b7e6eba005f41e36ab"}>I Hold 1 STN</option>
                                                    <option value={"0x04abeda201850ac0124161f037efd70c74ddc74c"}>I Hold 1 NEST</option>
                                                    <option value={"0x1a23a6BfBAdB59fa563008c0fB7cf96dfCF34Ea1"}>I Hold 1 CoFi</option>

                                                    <option value={"0x9469d013805bffb7d3debe5e7839237e535ec483"}>I Hold 1 RING</option>
                                                    <option value={"0x6a6c2adA3Ce053561C2FbC3eE211F23d9b8C520a"}>I Hold 1 TON</option>
                                                    <option value={"0xb59490ab09a0f526cc7305822ac65f2ab12f9723"}>I Hold 1 LIT</option>


                                                    <option value={""}>I'm On The Whitelist</option>
                                                    <option value={"0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"}>I Hold ENS</option>
                                                    <option value={"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"}>I Hold CryptoPunks</option>
                                                    <option value={"0xc2c747e0f7004f9e8817db2ca4997657a7746928"}>I Hold Hashmasks</option>
                                                    <option value={"0x06012c8cf97bead5deae237070f9587f8e7a266d"}>I Hold CryptoKitties</option>
                                            </Select>
                                        </FormControl>
<br/>
                                        <Button variant="contained" color="secondary" onClick={this.handleMint} style={{margin: "20px"}}
                                                size={"large"}>Mint Free</Button>

                                    </Grid>
                                    }
                                    {null !==this.state.penddingTx&&
                                    <Grid item xs={12} style={{
                                        margin: "10px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        display: "flex",

                                    }}> <CircularProgress color={"inherit"} size={20}/>
                                        <a style={{ color:"white",margin:"15px",textDecoration:"none" }} href={"https://etherscan.io/tx/"+this.state.penddingTx} rel="noreferrer" target={"_blank"}>
                                        <Typography noWrap style={{color:"gray"}}>
                                            TX detail:{this.state.penddingTx.substring(0,20)+"..."}
                                        </Typography>
                                        </a>
                                        <Button size={"small"} variant={"outlined"}  onClick={this._handleClearTx}>clear</Button>
                                    </Grid>
                                    }
                                    <Grid item xs={12} style={{justifyContent: "center", alignItems: "center", display: "flex",flexDirection:"column",marginTop:"10px"}}>

                                        <Typography >
                                            Free claim once every 4*nCOMPs hours
                                        </Typography>

                                        <Typography style={{ marginTop:"25px" }}>
                                        <a rel="noreferrer" style={{color:"white"}} target={'_blank'} href="https://app.uniswap.org/#/swap?outputCurrency=0xd81b71cbb89b2800cdb000aa277dc1491dc923c3&use=V2">Click And Buy NMT</a>
                                        </Typography>

                                    </Grid>
                                </Grid>
                                }
                                {null !== this.state.newToken &&
                                <Grid style={{justifyContent:"center",alignItems:"center",flexDirection:"column",display:"flex"}}>
                                    <Typography color={"error"}  variant={"h3"} style={{margin:"15px"}}>
                                        Mint success!
                                    </Typography>
                                    <MaskCard token={this.state.newToken} onTokenClick={ this.props.onTokenClick }/>
                                </Grid>
                                }
                            </Grid>
                        </Grid>
                {(new URLSearchParams(window.location.search)).get("debug") === "true" &&
                <Grid item xs={12}>
                    <Typography variant="h4" className={classes.section_title}>
                        Staking
                    </Typography>
                    <Staking h5={true} account={this.state.account}
                             tokens={this.state.currentMint}
                             onMessage={this.props.onMessage}
                             chainId={this.state.chainId}
                    />
                </Grid>
                }
                        {this.state.currentMint.length > 0 &&
                        <Grid item xs={12}>
                            <Typography variant="h4" className={classes.section_title}>
                                My Wallet
                            </Typography>
                            <MyToken h5={true} tokens={this.state.currentMint} onTokenClick={ this.props.onTokenClick }/>
                        </Grid>
                        }
                        <Grid item xs={12} >
                            <Typography variant="h4" className={classes.section_title}>
                                Q&A
                            </Typography>
                            <About />
                        </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" className={classes.section_title}>
                        Discussion group
                    </Typography>
                    <Contactgroup h5={true}/>
                </Grid>
            </React.Fragment>

        );
    }
}

export default withStyles(useStyles)(H5);
