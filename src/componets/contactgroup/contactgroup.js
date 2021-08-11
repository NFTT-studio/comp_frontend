import {Box, Hidden} from "@material-ui/core";
import React from "react";
import wechatgroup from "../../assets/img/wechat-comp-group.png"
import telegramengroup from "../../assets/img/telegram-en.png"
import telegramchgroup from "../../assets/img/telegram-ch.png"

import {withStyles} from "@material-ui/core";

const useStyles = theme =>({

    img:{
        margin: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // marginBottom:
    },
    section_title:{
        marginBottom:theme.spacing(1),
        marginTop: theme.spacing(5)
    },
});

class Contactgroup extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>

            <Box style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:this.props.h5?"column":"row"}}>
                <Box m={5}>
                <img alt={"https://t.me/NFTmart"} className={classes.img} width={150} src={telegramengroup}/>
                <br/>
                https://t.me/NFTmart(EN)
                </Box>
                <Hidden smDown>
                <Box m={5}>
                <img alt={"https://t.me/NFTMartio"} className={classes.img} width={150} src={telegramchgroup}/>
                <br/>
                https://t.me/NFTMartio(CN)
                </Box>
                </Hidden>
                <Box m={5} textAlign={"center"}>
                <img alt={"wechat"} className={classes.img} width={150} src={wechatgroup}/>
                    <br/>
                wechat group
                </Box>
            </Box>
            </React.Fragment>
        )
    }
}
export default withStyles(useStyles)( Contactgroup);