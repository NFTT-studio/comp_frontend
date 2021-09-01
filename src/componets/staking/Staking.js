import React from "react";
import {
    Button, Grid, DialogActions, Dialog, DialogTitle, DialogContent,
    List, ListItem, ListItemAvatar, ListItemText, Checkbox, Avatar,
    ListItemSecondaryAction, Slide, DialogContentText, CircularProgress, Hidden
} from "@material-ui/core";
import CompStakingContractUtil from "../../CompStakingContract";
import detectEthereumProvider from "@metamask/detect-provider";
import Alert from "@material-ui/lab/Alert";

let styleStakingItem = {
    textAlign:"center",
    margin:"15px",
    fontSize: "18px",
    fontWeight: "bloder",

    // width: "140px"

}
let link_text = {
    textDecoration:"none",
        color:"white"
}

let styleStakingNumber = {
    // margin:"15px",
    textAlign:"center",
    fontSize: "50px"
}

let center= {display:"flex",flexDirection:"column", alignItems:"center",justifyContent:"center"}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Staking extends React.Component {
    compStakingContractUtil
    constructor(props) {
        super(props);
        this.state = {
                        totalPower: 0,
                        availableBouns:0,
                        stakingPower:0,
                        openStaking: false,
                        stakingParams:null,
                        approveDialogOpen:false,
                        stakingTx: this._localGet("stakingTx"), // localStorage.getItem("stakingTx"),
                        approveTx: this._localGet("approveTx"),//localStorage.getItem("approveTx"),
                        redeemTx: this._localGet("redeemTx"), //localStorage.getItem("redeemTx"),
                        stakedItemMap:[],
                        selectItem:{},
                        openRedeem:false,
                        nmtbalance:0,
                        tmpStakingNMT:0
                    };
    }
    _isMainChain=()=>{
        return this.state.chainId === "0x1";
    }
    _localSave=(key,value)=>{
        localStorage.setItem(this.props.account + "_" + key,value);
    }
    _localGet=(key)=>{
        return localStorage.getItem(this.props.account + "_" + key);
    }
    _localRemove=(key)=>{
        return localStorage.removeItem(this.props.account + "_" + key);
    }

    componentDidMount =async ()=> {

        this.provider = await detectEthereumProvider();

        if (this.provider) {
            this.compStakingContractUtil = new CompStakingContractUtil(this.provider);

            this.setState({chainId:  await this.provider.request({ method: 'eth_chainId' })})
           // this.setState({chainId:  } );
            if(this._isMainChain()) {
                this._checkApproveTx();
                this._checkStakingTx();
                this._checkRedeemTx();
                // check tx approve
                let [totalPower,availableBouns] = await this.compStakingContractUtil.poolInfo();

                this.setState({totalPower,availableBouns} );
            }
        }


    }
    alertMessage(message) {
        if (this.props.onMessage) {
            this.props.onMessage(message);
        }
    }
    handleCloseStakingDialog=()=>{
        this.setState({openStaking:false})
    }

    submitSelectItem = async ()=>{

        // console.info(this.state.selectItem);
        if(this.state.selectItem.length===0){
            this.alertMessage("Please select at least one comp for staking");
            return;
        }
        var tokenIds = [];
        for(var key in this.state.selectItem){
            tokenIds.push(this.state.selectItem[key].tokenId);
        }
        var stakingParams = await this.compStakingContractUtil.stakingParams(tokenIds);
        var isAllowance = await this.compStakingContractUtil.isNMTAllowanceEnough( this.props.account,   stakingParams.amount );
        if(isAllowance){
            //check NMT balance
           if(await this.compStakingContractUtil.isNMTBalanceEnough(this.props.account,   stakingParams.amount)) {
               this.setState({stakingParams});
           }else{
               this.alertMessage("Not enough NMT,please buy it first");
           }
        }else{
            this.setState({approveDialogOpen:true})

        }

        this.handleCloseStakingDialog();

    }

    componentDidUpdate=async(prevProps, prevState, snapshot)=> {

        if((prevProps.tokens.length !==  this.props.tokens.length)  || (prevProps.account !== this.props.account)){
            let map = {};
            let total=0;
            for(var i=0; i<this.props.tokens.length;i++){
                let power = parseInt((await this.compStakingContractUtil.compStakingInfo(this.props.tokens[i].tokenId)).toString());
                 total+= power;
                 if(power >0) {
                     map[i] = power;
                 }
            }
            this.setState ( {stakingPower:  total,
                stakedItemMap: map,
                stakingTx: this._localGet("stakingTx"),
                approveTx: this._localGet("approveTx"),
                redeemTx: this._localGet("redeemTx")
            });
        }
    }
    selectComp = (e,index)=>{
        const key = ""+index;
        let selectItem = this.state.selectItem;

        if(selectItem.hasOwnProperty(key)){
            delete selectItem[key];
        }else{
            selectItem[""+index] = this.props.tokens[index];
        }
        //todo

        this.setState({selectItem:selectItem,tmpStakingNMT:  this._stakingNMT()});

    }
    handleStakingConfirmClose = ()=>{
        this.setState({stakingParams:null});
    }
    _handleClearApproveTx = ()=>{

        this._localRemove("approveTx")
        this.setState({approveTx:null});
    }
    _handleClearStakingTx = ()=>{
        this._localRemove("stakingTx");
        this.setState({stakingTx:null});
    }
    _handleClearRedeemTx = () =>{
        this._localRemove("redeemTx")
        this.setState({redeemTx:null});
    }
    handleApproveDialogClose = ()=>{
        this.setState({approveDialogOpen:false});
    }
    handleCloseRedeemDialog=()=>{
        this.setState({openRedeem:false});
    }

    handleApprove = async ()=>{

        try{
            var tx = await this.compStakingContractUtil.NMTapproveAll();
            this.setState({approveTx:tx.hash,approveDialogOpen:false});
        // tx.gt
            this._localSave("approveTx",tx.hash);
            this._checkApproveTx();

        }catch(err){
            this.handleStakingConfirmClose();
            console.error(err);
        }
    }

    _checkApproveTx = ()=>{
        if(this.state.approveTx!==null) {
            this.compStakingContractUtil.provider.waitForTransaction(this.state.approveTx, 1).then((txr) => {
                if (txr.status === 0) {
                    this.alertMessage("Transaction Error, Please Check it")
                }
                this.setState({approveTx: null});
                this._localRemove("approveTx");

            });
        }
    }

    _checkStakingTx = ()=>{
        if(this.state.stakingTx!==null) {
            this.compStakingContractUtil.provider.waitForTransaction(this.state.stakingTx, 1).then((txr) => {
                if (txr.status === 0) {
                    this.alertMessage("Transaction Error, Please Check it")
                }
                this.setState({stakingTx: null});
                this._localRemove("stakingTx");
                window.location.reload();
            });
        }
    }
    _checkRedeemTx = ()=>{
        if(this.state.redeemTx!==null) {
            this.compStakingContractUtil.provider.waitForTransaction(this.state.redeemTx, 1).then((txr) => {
                if (txr.status === 0) {
                    this.alertMessage("Transaction Error, Please Check it")
                }
                this.setState({redeemTx: null});
                this._localRemove("redeemTx");
                window.location.reload();
            });
        }
    }
    handleStaking = async ()=>{

        try {
            var tokenIds = [];
            for (var key in this.state.selectItem) {
                tokenIds.push(this.state.selectItem[key].tokenId);
            }
            var stakingTx = await this.compStakingContractUtil.staking(tokenIds);

            this.setState({stakingTx: stakingTx.hash, stakingParams: null});
            // tx.gt
            this._localSave("stakingTx", stakingTx.hash);
            this._checkStakingTx();

            this.handleStakingConfirmClose();

        }catch(err){
            this.handleStakingConfirmClose();
            console.error(err);
        }

    }
    _handleRedeem = async (tokenId)=> {

        try {
            var redeemTx = await this.compStakingContractUtil.redeem(tokenId);
            this.setState({redeemTx: redeemTx.hash, openRedeem: false});
            // tx.gt
            this._localSave("redeemTx", redeemTx.hash);
            this._checkRedeemTx();

            this.handleStakingConfirmClose();
        }catch(err){
            this.handleStakingConfirmClose();
            console.error(err);
        }
    }

    _showStaking = async ()=>{
        if(this.props.tokens.length===0){
            this.alertMessage("Please Mint First");
            return ;
        }
        if(!this._isMainChain()){
            this.alertMessage("Please Select Ethereum Main Network First");
            return ;
        }

        this.setState({openStaking:true,
            nmtbalance:await this.compStakingContractUtil.NMTBalance(this.props.account),
            selectItem:{}});
    }
    _showRedeem =() =>{
        if(!this._isMainChain()){
            this.alertMessage("Please Select Ethereum Main Network First");
            return ;
        }
        this.setState({openRedeem:true});
    }
    _stakingNMT=()=>{
        let stakingNMT = 0;
        Object.keys(this.state.selectItem).forEach(
        (key)=>{
                stakingNMT+=
                Math.ceil(this.calcPower( this.state.selectItem[key].gene)* (this.state.availableBouns/this.state.totalPower))
            }
        );
        return stakingNMT;
    }

    render(){

        return (
            <React.Fragment>
                <div elevation={3} style={{padding: "30px  0px"}}>
                    <Grid container style={{display:"flex",justifyContent:"center",alignItems:"center"}} spacing={4}>
                        <Grid item xs={12} style={{display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
                            <Alert severity="info">
                                After COMP#2888, <b>28880NMT</b> will be injected into the bonus pool and the price will rise to <b>{this.state.totalPower>0? ( (parseInt(this.state.availableBouns)+28880) / this.state.totalPower).toFixed(1):0 }</b></Alert>
                            <Alert severity="warning" style={{margin:"10px"}}>When selling Staking COMP, pay attention to setting a suitable price</Alert>
                        </Grid>
                        <Grid item >
                            <Grid item xs={12} style={styleStakingNumber}>
                                {parseInt( this.state.availableBouns)}
                            </Grid>
                            <Grid item xs={12} style={styleStakingItem}>
                                Bonus(NMT)
                            </Grid>
                        </Grid>
                        <Grid item >
                            <Grid item xs={12} style={styleStakingNumber}>
                                {this.state.totalPower}
                            </Grid>
                            <Grid item xs={12} style={styleStakingItem}>
                                Total Power
                            </Grid>
                        </Grid>
                        <Hidden mdDown>
                        <Grid item >

                            <Grid item xs={12} style={styleStakingNumber}>
                                {this.state.totalPower>0?(this.state.availableBouns/this.state.totalPower).toFixed(1):0}
                            </Grid>
                            <Grid item xs={12} style={styleStakingItem}>
                                Price
                            </Grid>
                        </Grid>
                        </Hidden>

                        <Grid item xs={12} style={styleStakingItem}>
                            <Grid>
                                My Staked Power: {this.state.stakingPower} ≈ {this.state.totalPower>0?  parseInt(this.state.stakingPower * this.state.availableBouns / this.state.totalPower):0} NMT
                            </Grid>
                        </Grid>
                        {/*<Grid container>*/}
                        <Grid item  xs={12} style={{display:"flex",alignItems:"center" ,justifyContent:"center"}} >
                            <Button disabled={this.state.approveTx!==null || this.state.stakingTx!==null || this.state.redeemTx!==null }   variant="contained" color="secondary" onClick={this._showStaking} style={{margin: "20px"}}
                                    size={"large"}>Staking</Button>
                            <Button disabled={this.state.stakingPower===0 || this.state.approveTx!==null || this.state.stakingTx!==null || this.state.redeemTx!==null} variant="contained" color="secondary" onClick={this._showRedeem}  style={{margin: "20px"}}
                                    size={"large"}>Redeem(1%Fee)</Button>
                        </Grid>
                        {/*</Grid>*/}
                        <Grid container>
                                {this.state.approveTx &&
                                <Grid item xs={12} style={center}>
                                        <CircularProgress color={"inherit"} size={20}/>
                                        <br/>
                                    <Grid>Approve Tx: <a target={"_blank"} rel="noreferrer" style={ link_text} href={"https://etherscan.io/tx/"+ this.state.approveTx} >{
                                        this.props.h5?  this.state.approveTx.substring(0,20)+"...":this.state.approveTx
                                    } </a></Grid>
                                    <br/>
                                        <Button size={"small"} variant={"outlined"}  onClick={this._handleClearApproveTx}>clear</Button>
                                </Grid>
                                }
                                {this.state.stakingTx &&
                                    <Grid item xs={12} style={center}>
                                            <CircularProgress color={"inherit"} size={20}/><br/>
                                        <Grid>Staking Tx:<a  rel="noreferrer" style={ link_text} href={"https://etherscan.io/tx/"+ this.state.stakingTx} target={"_blank"}> {
                                            this.props.h5?  this.state.stakingTx.substring(0,20)+"...":this.state.stakingTx
                                            }</a></Grid>
                                        <br/>
                                            <Button size={"small"} variant={"outlined"}  onClick={this._handleClearStakingTx}>clear</Button>
                                </Grid>
                                }
                            {this.state.redeemTx &&
                            <Grid container  style={center} >
                                <CircularProgress color={"inherit"} size={20}/><br/>
                                <Grid>Redeem Tx: <a rel="noreferrer" style={ link_text} href={"https://etherscan.io/tx/"+ this.state.redeemTx} target={"_blank"}> {
                                    this.props.h5?  this.state.redeemTx.substring(0,20)+"...":this.state.redeemTx
                                }</a></Grid><br/>
                                <Button size={"small"} variant={"outlined"}  onClick={this._handleClearRedeemTx}>clear</Button>
                            </Grid>
                            }
                        </Grid>
                    </Grid>
                </div>

                <Dialog onClose={this.handleCloseRedeemDialog} aria-labelledby="customized-dialog-title" open={this.state.openRedeem}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleCloseRedeemDialog}>
                        Redeem List
                    </DialogTitle>
                    <DialogContent dividers>
                        <List dense>
                            {Object.keys(this.state.stakedItemMap).map((key,index) => {
                                const labelId = `checkbox-list-secondary-label-${index}`;
                                const value = this.props.tokens[key];
                                if(value==null){
                                    return "";
                                }
                                return (
                                    <ListItem key={index} button onClick={ ()=>{this._handleRedeem(value.tokenId)} }>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={value.name}
                                                src={value.originalimage+"/thumb2"}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={ value.name
                                        +" (p:"+ this.calcPower( value.gene) +" n:"
                                        + Math.ceil(this.calcPower( value.gene)* (this.state.availableBouns/this.state.totalPower))
                                        +")" } />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </DialogContent>
                </Dialog>

                <Dialog onClose={this.handleCloseStakingDialog} aria-labelledby="customized-dialog-title" open={this.state.openStaking}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleCloseStakingDialog}>
                        Staked List
                    </DialogTitle>
                    <DialogContent dividers>
                        <List dense>

                            { this.props.tokens.map((value,index) => {
                                const labelId = `checkbox-list-secondary-label-${index}`;
                                return (
                                    <ListItem key={index} button>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={value.name}
                                                src={value.originalimage+"/thumb2"}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={ value.name
                                                +" (p:"+ this.calcPower( value.gene) +" n:"
                                                + Math.ceil(this.calcPower( value.gene)* (this.state.availableBouns/this.state.totalPower))
                                            +")" } />
                                        {/*<ListItemText id={labelId} primary={value.name} />*/}
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={(ev)=>this.selectComp(ev,index)}
                                                checked={this.state.stakedItemMap[index] > 0 || this.state.selectItem[index] !=null }
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                disabled={this.state.stakedItemMap[index] > 0}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={true}>Staking(NMT): {this.state.tmpStakingNMT}</Button>
                        <Button disabled={true}>Balance(NMT): {this.state.nmtbalance}</Button>
                        {this.state.tmpStakingNMT <= this.state.nmtbalance ?

                            <Button disabled={Object.keys(this.state.selectItem).length === 0} autoFocus
                                    onClick={this.submitSelectItem} color="primary">
                                Submit
                            </Button>
                            :
                            <a rel="noreferrer" style={{color:"white"}} target={'_blank'} href="https://app.uniswap.org/#/swap?outputCurrency=0xd81b71cbb89b2800cdb000aa277dc1491dc923c3&use=V2">
                                <Button disabled={true}>
                                Buy NMT
                                </Button>
                            </a>

                        }
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.stakingParams!==null}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleStakingConfirmClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Staking Info Confirm</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            You will stake about {this.state.stakingParams && Math.ceil( this.state.stakingParams.amount) } NMT  with {this.state.stakingParams && this.state.stakingParams.power} power. Please confirm that the NMT balance is sufficient
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleStakingConfirmClose} color="primary">
                            Reject
                        </Button>
                        <Button onClick={this.handleStaking} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.approveDialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleApproveDialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Approve Confirm</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Please approve CompStaking contract transfer NMT.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleApproveDialogClose} color="primary">
                            Reject
                        </Button>
                        <Button onClick={this.handleApprove} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>



            </React.Fragment>
        );
    }
    calcPower=(genestr)=>{
        const geneArray = genestr.split("_");
        let power = 0;
        for(let i=1;i<geneArray.length-1;i++){

            if(this.standTemplates[geneArray[0]][i-1] !== parseInt(geneArray[i])){
                power+=1;
            }
        }
        let sexNum = parseInt( geneArray[geneArray.length-1])
        if(sexNum === 0){
            power=power+5;
        }else if(sexNum===3){
            power=power+1;
        }else{
            power=power+3;
        }
        return power*10;
    }
    standTemplates=
    [
        [5,9,10,10,1,7,3,0,0],
    [5,9,10,3,10,1,0,0,0],
    [5,9,10,3,10,1,0,0,0],
    [5,8,5,10,3,4,1,0,0],
    [5,9,10,3,1,0,0,0,0],
    [5,9,3,10,1,4,0,0,0],
    [5,9,10,10,1,0,0,0,0],
    [5,8,5,10,1,3,0,0,0],
    [5,9,3,10,2,1,0,0,0],
    [5,9,3,10,5,1,0,0,0],
    [5,9,10,3,10,1,2,0,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,3,10,1,10,0,0,0],
    [5,9,10,10,1,10,10,5,0],
    [5,9,10,10,4,2,1,3,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,3,10,7,1,0,0,0],
    [5,9,10,10,1,0,0,0,0],
    [5,9,10,10,6,1,0,0,0],
    [5,9,10,3,9,1,0,0,0],
    [5,9,10,10,1,3,7,0,0],
    [5,9,10,3,1,0,0,0,0],
    [5,9,10,3,1,4,0,0,0],
    [5,9,10,1,10,3,7,5,0],
    [5,9,3,10,10,1,0,0,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,10,4,3,10,9,1,0],
    [5,9,1,3,0,0,0,0,0],
    [5,9,10,3,5,1,0,0,0],
    [5,9,2,3,10,1,0,0,0],
    [5,9,10,3,1,0,0,0,0],
    [5,9,1,2,7,3,0,0,0],
    [5,9,10,1,10,3,0,0,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,10,3,4,1,0,0,0],
    [5,9,10,10,3,4,1,10,0],
    [5,9,3,10,1,0,0,0,0],
    [5,9,10,10,10,1,3,0,0],
    [5,9,10,7,1,10,0,0,0],
    [5,9,10,1,10,10,0,0,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,10,1,0,0,0,0,0],
    [5,9,10,10,3,4,1,0,0],
    [5,9,10,10,10,3,1,0,0],
    [5,9,10,1,0,0,0,0,0],
    [5,9,10,1,7,3,0,0,0],
    [5,9,3,10,7,1,0,0,0],
    [5,9,1,3,7,0,0,0,0],
    [5,9,4,3,1,6,0,0,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,10,1,3,10,7,0,0],
    [5,9,2,1,3,7,0,0,0],
    [5,9,10,7,10,1,3,0,0],
    [5,8,10,10,1,10,0,0,0],
    [5,9,10,10,7,3,1,2,0],
    [5,9,10,7,1,3,10,0,0],
    [5,9,10,1,10,3,7,10,0],
    [5,9,1,10,10,2,10,0,0],
    [5,9,10,10,1,0,0,0,0],
    [5,9,10,10,3,5,1,0,0],
    [5,9,10,10,1,10,10,10,0],
    [5,9,10,10,3,1,10,0,0],
    [5,9,10,1,10,6,0,0,0],
    [5,9,2,10,10,1,3,0,0],
    [5,9,10,10,1,0,0,0,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,10,10,3,2,1,0,0],
    [5,9,10,10,1,0,0,0,0],
    [1,9,10,10,1,0,0,0,0],
    [5,9,10,2,4,3,1,10,0],
    [5,9,10,1,3,7,0,0,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,10,10,2,1,3,4,0],
    [5,9,10,10,3,10,1,0,0],
    [5,9,10,10,10,3,1,0,0],
    [5,9,10,1,10,0,0,0,0],
    [5,9,10,10,1,10,3,0,0],
    [5,9,10,10,10,3,1,4,0],
    [5,9,10,3,1,0,0,0,0],
    [5,9,10,1,3,10,0,0,0],
    [5,9,10,3,10,10,1,0,0],
    [5,9,10,10,3,1,4,10,10],
    [5,9,10,10,4,10,10,1,0],
    [5,9,4,10,3,10,1,2,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,10,1,3,0,0,0,0],
    [5,9,7,1,5,10,3,0,0],
    [5,9,10,10,3,4,1,0,0],
    [5,9,4,10,3,1,10,0,0],
    [5,9,10,1,3,10,0,0,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,10,4,10,1,3,0,0],
    [5,9,10,10,3,1,0,0,0],
    [5,9,10,3,1,5,9,0,0],
    [1,9,10,1,3,9,0,0,0],
    [5,9,10,2,10,3,10,1,0],
    [5,9,10,3,4,1,10,0,0],
    [5,9,1,10,10,3,0,0,0],
    [5,9,3,10,1,10,0,0,0],
    [5,9,10,10,7,1,3,0,0]
    ];
}
export default Staking