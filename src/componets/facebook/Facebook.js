import {
    Grid,
    Typography,
    Divider,
    GridListTile,
    GridList, GridListTileBar
} from "@material-ui/core";
import React from "react";

import {withStyles} from "@material-ui/core";

const useStyles = theme=>({
    title:{
        display:"flex",
        justifyContent:"center",
        margin:theme.spacing(5)
    },
    facelist:{
        padding:theme.spacing(5)
    }

})

class Facebook extends React.Component{
    handleClick=(e)=>{
        if(this.props.onTokenClick) {
            // let index0=
            this.props.onTokenClick(this.props.standardList[e.target.dataset.index0].latestMint[e.target.dataset.index1]);
        }
    }
    render(){
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Grid item xs={12}  className={classes.title}>
                    <Typography variant="h3" >
                        Facebook
                    </Typography>
                </Grid>
                {
                            this.props.standardList.map((v,index0)=>(
                                <Grid item  xs={12} style={{margin:"10px 0px"}}>
                                    <Grid item xs={12} >
                                        <Typography variant={"h6"}>
                                        {v.name}
                                        </Typography>
                                        <Divider style={{margin: "10px 0px"}}/>
                                    </Grid>
                                    <Grid item  container xs={12} >
                                        <Grid item xs={5}> <img  alt={v.name} src={v.originalimage+"/thumb"}  width={320}/> </Grid>
                                        <Grid item xs={7}>
                                            <GridList cellHeight={240} cols={6} className={classes.facelist}>
                                                {
                                                    v.latestMint.map((token,index1)=>(
                                                    <GridListTile cols={1} key={token.gene}>
                                                        <img src={token.originalimage+"/thumb2"} alt={token.name} onClick={this.handleClick} data-index0={index0} data-index1={index1}
                                                        style={{cursor: "pointer"}}/>
                                                        <GridListTileBar
                                                            title={"#"+token.tokenId}
                                                            // subtitle={<span>gene: {token.gene}</span>}
                                                        />
                                                    </GridListTile>
                                                    ))
                                                }
                                                {
                                                v.latestMint.length===0&&
                                                <Typography style={{color:"gray"}}>Not Mint Yet</Typography>
                                                }
                                        </GridList>
                                    </Grid>
                                    </Grid>
                                </Grid>
                                )
                            )
                }
            </React.Fragment>
        )
    }
}

export  default withStyles(useStyles)( Facebook);