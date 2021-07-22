import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import CompContractUtil from "../../CompContract";
import {
    Grid,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from '@material-ui/core';
import DataApi from "./../../DataApi";
import RecentlyToken from "../recentlytoken/RecentlyToken";
import MyToken from '../mytoken/MyToken'
import Timer from "../timer/Timer";
import MaskCard from "../maskcard/MaskCard";
import About from "../about/About";

import {withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = theme=>({
    section_title:{
        marginBottom:theme.spacing(1),
        marginTop: theme.spacing(5)
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

class Index extends React.Component{
    //global provider
    provider
    compContractUtil

    constructor(props) {
        super(props);
        this.state = {
            currentMint:[],
            luckyNumber:null,
            newToken:null,
            penddingTx: localStorage.getItem("penddingTx"),
            cooltime:0,
            account:props.account,
            totalToken:''
        };
    }
    _isMainChain=()=>{
        return this.props.chainId === "0x4";
    }
    componentDidMount=async ()=>{

        this.provider = await detectEthereumProvider();
        if (this.provider) {
            this.compContractUtil = new CompContractUtil(this.provider);
            // this.provider.on('chainChanged', this.handleChainChanged);
            this.provider.on('accountsChanged',this.handleAccountsChanged);
            await  this.requestAccount();

            if(this.state.account && this._isMainChain()){
                await this._loadUserInfo();
                if(null !== this.state.penddingTx && this._isMainChain()){
                    let tx = await this.compContractUtil.getTransaction(this.state.penddingTx);
                    if(null !== tx && tx.blockNumber >0){
                        this.setState({penddingTx:null});
                        localStorage.removeItem("penddingTx");
                    }else{
                        this._checkTx();
                    }
                }
            }
        }
    }

    requestAccount = async ()=>{
        let accounts = await this.provider.request({ method: 'eth_requestAccounts' });
        await this.handleAccountsChanged(accounts);
    }

    _loadUserInfo= async ()=>{
        let [addressTokens,cooltime,totalToken] = await Promise.all(
            [
            DataApi.fetchAddressTokens(this.state.account),
            this.compContractUtil.cooltimeLeft(this.state.account),
            this.compContractUtil.totalToken(),
            ]
        );
        console.info(totalToken)
        this.setState({
            currentMint: addressTokens.code!=="0"?[]:addressTokens.data,
            cooltime:cooltime,
            totalToken:totalToken
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
            this.alertMessage("Please Select Rinkeby Test Network First");
            return ;
        }

        if("" === this.state.currentAccount){
            this.requestAccount();
            return;
        }
        try {
            if(null === this.state.luckyNumber){
                this.alertMessage("Don't forget to enter your lucky number");
                return;
            }

            this.togglePenddingView();
            let tx = await this.compContractUtil.mint(this.state.luckyNumber);
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
                            <Grid item xs={6} className={classes.facebook}>
                                <Link to={"/facebook"} className={classes.link_text}>Facebook</Link>
                            </Grid>
                            </Grid>
                            <Grid>
                            <RecentlyToken  onTokenClick={this.props.onTokenClick}/>
                            </Grid>
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
                                            style={{width: "280px", textAlign: "center",color:"white"}}
                                            id="outlined-number"
                                            label="Some magical things will happen"
                                            // type="number"
                                            color={"secondary"}
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

                                    }}> <CircularProgress color={"#000"} size={20}/>
                                        <Typography noWrap style={{marginLeft:"25px",color:"gray"}}>
                                            TX detail:
                                        </Typography>
                                        <a style={{ color:"grey",margin:"15px",textDecoration:"none" }} href={"https://etherscan.io/tx/"+this.state.penddingTx} rel="noreferrer" target={"_blank"}>{this.state.penddingTx}</a>
                                        <Button size={"small"} variant={"outlined"}  onClick={this._handleClearTx}>clear</Button>
                                    </Grid>
                                    }
                                    <Grid item xs={12} style={{justifyContent: "center", alignItems: "center", display: "flex",flexDirection:"column",marginTop:"10px"}}>
                                        <Typography style={{width:"680px",margin:"10px"}}>
                                            1. Hold <a target={"_blank"} rel={"noreferrer"} style={{color:"white", margin:"0px",fontSize:"20px" }} href={"https://etherscan.io/token/0xd81b71cbb89b2800cdb000aa277dc1491dc923c3"}> {this.state.totalToken} NMT </a> and get COMP NFT
                                        </Typography>
                                        <Typography style={{width:"680px"}}>
                                            2. Free claim once every 4*n hours (n = The number of NFT minted at the current address)
                                        </Typography>
                                    </Grid>
                                </Grid>
                                }
                                {null !== this.state.newToken &&
                                <Grid style={{justifyContent:"center",alignItems:"center",flexDirection:"column",display:"flex"}}>
                                    <Typography color={"error"}  variant={"h3"} style={{margin:"15px"}}>
                                        Congratulations on mint success!
                                    </Typography>
                                    <MaskCard token={this.state.newToken} onTokenClick={ this.props.onTokenClick }/>
                                </Grid>
                                }
                            </Grid>
                        </Grid>

                        {this.state.currentMint.length > 0 &&
                        <Grid item xs={12}>
                            <Typography variant="h4" className={classes.section_title}>
                                My Wallet
                            </Typography>
                            <MyToken tokens={this.state.currentMint} onTokenClick={ this.props.onTokenClick }/>
                        </Grid>
                        }

                        <Grid item xs={12} >
                            <Typography variant="h4" className={classes.section_title}>
                                About
                            </Typography>
                            <About />
                        </Grid>
            </React.Fragment>

        );
    }
}

export default withStyles(useStyles)( Index );
