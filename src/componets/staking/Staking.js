import React from "react";
import {
    Button, Grid, DialogActions, Dialog, DialogTitle, DialogContent,
    List, ListItem, ListItemAvatar, ListItemText, Checkbox, Avatar,
    ListItemSecondaryAction, Slide, DialogContentText, CircularProgress, Hidden
} from "@material-ui/core";
import CompStakingContractUtil from "../../CompStakingContract";
import detectEthereumProvider from "@metamask/detect-provider";

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
                        stakingTx:localStorage.getItem("stakingTx"),
                        approveTx:localStorage.getItem("approveTx"),
                        redeemTx:localStorage.getItem("redeemTx"),
                        stakedItemMap:[],
                        selectItem:{},

                        openRedeem:false
                    };
    }
    _isMainChain=()=>{
        return this.state.chainId === "0x1";
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
            this.setState ( {stakingPower:  total,stakedItemMap: map});
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
        this.setState({selectItem:selectItem});

    }
    handleStakingConfirmClose = ()=>{
        this.setState({stakingParams:null});
    }
    _handleClearApproveTx = ()=>{

        localStorage.removeItem("approveTx")
        this.setState({approveTx:null});
    }
    _handleClearStakingTx = ()=>{
        localStorage.removeItem("stakingTx")
        this.setState({stakingTx:null});
    }
    _handleClearRedeemTx = () =>{
        localStorage.removeItem("redeemTx")
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
            localStorage.setItem("approveTx",tx.hash);
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
                localStorage.removeItem("approveTx");

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
                localStorage.removeItem("stakingTx");
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
                localStorage.removeItem("redeemTx");
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
            localStorage.setItem("stakingTx", stakingTx.hash);
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
            localStorage.setItem("redeemTx", redeemTx.hash);
            this._checkRedeemTx();

            this.handleStakingConfirmClose();
        }catch(err){
            this.handleStakingConfirmClose();
            console.error(err);
        }
    }

    _showStaking = ()=>{
        if(this.props.tokens.length===0){
            this.alertMessage("Please Mint First");
            return ;
        }
        if(!this._isMainChain()){
            this.alertMessage("Please Select Ethereum Main Network First");
            return ;
        }

        this.setState({openStaking:true, selectItem:{}});
    }
    _showRedeem =() =>{
        if(!this._isMainChain()){
            this.alertMessage("Please Select Ethereum Main Network First");
            return ;
        }
        this.setState({openRedeem:true});
    }

    render(){

        return (
            <React.Fragment>
                <div elevation={3} style={{padding: "30px  0px"}}>
                    <Grid container style={{display:"flex",justifyContent:"center",alignItems:"center"}} spacing={4}>

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
                                {(this.state.availableBouns/this.state.totalPower).toFixed(1)}
                            </Grid>
                            <Grid item xs={12} style={styleStakingItem}>
                                Price
                            </Grid>
                        </Grid>
                        </Hidden>

                        <Grid item xs={12} style={styleStakingItem}>
                            <Grid>
                                My Staked Power: {this.state.stakingPower} ≈ { parseInt(this.state.stakingPower * this.state.availableBouns / this.state.totalPower)} NMT
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
                                    <Grid>Approve Tx: <a  rel="noreferrer" style={ link_text} href={"https://etherscan.io/tx/"+ this.state.approveTx} >{
                                        this.props.h5?  this.state.approveTx.substring(0,20)+"...":this.state.approveTx
                                    } </a></Grid>
                                    <br/>
                                        <Button size={"small"} variant={"outlined"}  onClick={this._handleClearApproveTx}>clear</Button>
                                </Grid>
                                }
                                {this.state.stakingTx &&
                                    <Grid item xs={12} style={center}>
                                            <CircularProgress color={"inherit"} size={20}/><br/>
                                        <Grid>Staking Tx:<a rel="noreferrer" style={ link_text} href={"https://etherscan.io/tx/"+ this.state.stakingTx} target={"_blank"}> {
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
                                        <ListItemText id={labelId} primary={value.name} />
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
                                        <ListItemText id={labelId} primary={value.name} />
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

                        <Button disabled={Object.keys(this.state.selectItem).length===0} autoFocus onClick={this.submitSelectItem} color="primary">
                           Submit
                        </Button>
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
}
export default Staking