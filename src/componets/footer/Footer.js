import {AppBar, Link, Toolbar, Typography, withStyles} from "@material-ui/core";
import React from "react";

const useStyles = theme=>({
    root:{
        // backgroundColor:"black",
        marginTop:theme.spacing(8)
    }
});

class Footer extends React.Component{
    render() {
        const classes = this.props.classes;
        return (
            <AppBar position={"static"}  className={classes.root} >
                <Toolbar >
                    <Typography variant="subtitle2" noWrap style={{flexGrow:1,margin:"50px"}} align={"center"} >
                        COMP©2021 CopyRight  &nbsp;&nbsp;  Power by <Link href={"https://www.nftmart.io"} color={"inherit"} target={"_blank"}>NFTMart.io</Link>
                        &nbsp;&nbsp; <Link href={"https://etherscan.io/address/0xaba31c041e916e4141036f080b554d40cdb2bcd0#code"} color={"inherit"} target={"_blank"}>Contract Source Code</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}
export default withStyles(useStyles)( Footer);