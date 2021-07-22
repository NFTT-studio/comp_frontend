import {AppBar, Toolbar, Typography, withStyles} from "@material-ui/core";
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
                        COMP©2021 CopyRight
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}
export default withStyles(useStyles)( Footer);