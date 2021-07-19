import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import React from "react";


class Header extends React.Component{
    constructor(props) {
        super(props);
    }
    _handleConnectClick=(e)=>{
        if(this.props.onConnect){
            this.props.onConnect()
        }
    }

    render() {
        return (
            <AppBar position={"fixed"} >
                <Toolbar >
                    <Typography variant="h6" noWrap style={{flexGrow:1}}>
                        Chinese Opera Mask Plus
                    </Typography>
                    {this.props.account&&
                    <Typography variant="subtitle1" noWrap>
                        Address: {this.props.account}
                    </Typography>
                    }
                    {!this.props.account &&
                    <Button variant="contained" color={"secondary"} onClick={this._handleConnectClick}>Connect</Button>
                    }
                </Toolbar>
            </AppBar>
        );
    }

}

export default Header;