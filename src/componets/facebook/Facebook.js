import {
    Grid,
    Typography,
    Divider,
    GridListTile,
     GridList
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
                            this.props.standardList.map((v,index)=>(
                                <Grid item  xs={12} style={{margin:"10px 0px"}}>
                                    <Grid item xs={12} >
                                        {v.name}
                                        <Divider style={{margin: "10px 0px"}}/>
                                    </Grid>
                                    <Grid item  container xs={12} >
                                        <Grid item xs={5}><img src={v.image}  width={320}/> </Grid>
                                        <Grid item xs={7}>
                                            <GridList cellHeight={240} cols={6} className={classes.facelist}>
                                                {
                                                    v.latestMint.map((token,index)=>(
                                                    <GridListTile cols={1} key={token.gene}>
                                                        <img src={token.image} alt={token.name} />
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