import {AppBar, Button, Grid, Hidden, Toolbar, Typography} from "@material-ui/core";
import React from "react";
import {withStyles,Avatar,Breadcrumbs,Link} from "@material-ui/core";
import image from '../../assets/img/favicon.jpg';
// import {Link} from "react-router-dom";
const useStyles =  theme=>({
    banner:{
        height: "452px"
    },
    bannerText:{
        display:"flex",
        flexDirection:"column-reverse",
    },
    facebook: {color:"white",marginTop: "10px",textDecoration:"none"}

});
class Header extends React.Component{

    _handleConnectClick=(e)=>{
        if(this.props.onConnect){
            this.props.onConnect()
        }
    }

    render() {
        return (
            <React.Fragment>
            <AppBar position={"fixed"} >
                <Toolbar >
                    <Grid container>
                        <Grid item md={4} xs={12} style={{display:"flex",justifyContent:"center",justifyItems:"center",alignItems:"center" }}>
                            <Avatar alt="Remy Sharp" src={image} /> &nbsp;&nbsp;
                            <Typography variant="h6" noWrap style={{flexGrow:1}}>
                                Chinese Opera Mask Plus
                            </Typography>
                        </Grid>
                        <Hidden smDown>
                            <Grid item md={4} xs={4} style={{display:"flex",justifyContent:"center",justifyItems:"center",alignItems:"center" }}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" href="/" >
                                    Home
                                </Link>
                                <Link color={"inherit"} href="/#/facebook" >
                                   Facebook
                                </Link>

                                <Link color={"inherit"} href="https://opensea.io/collection/chinese-opera-mask-plus" target={"_blank"}>
                                   Buy
                                </Link>
                                <Link color={"inherit"} href="https://t.me/COMPOfficial" target={"_blank"}>
                                    Telegram
                                </Link>

                            </Breadcrumbs>

                        </Grid>

                        <Grid item md={4} xs={4} style={{display:"flex",justifyContent:"center",justifyItems:"center",alignItems:"center" }}>
                            {this.props.account&&
                            <Typography variant="subtitle1" noWrap style={{minWidth:"460"}} >
                                Address: {this.props.account}
                            </Typography>
                            }
                            {!this.props.account &&
                            <Button variant="contained" color={"secondary"} onClick={this._handleConnectClick}>Connect Wallet</Button>
                            }
                        </Grid>
                        </Hidden>
                    </Grid>
                </Toolbar>
            </AppBar>
            </React.Fragment>
        );
    }

}

export default withStyles(useStyles)(Header);