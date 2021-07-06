import React from "react";
import {Typography, GridList, GridListTile, GridListTileBar} from "@material-ui/core";

class MyToken extends React.Component {


     render(){
         console.info(this.props.tokens.length)
        return (

            <GridList cellHeight={200} cols={5}>
                {
                    this.props.tokens.map((token,index)=>(
                        <GridListTile cols={1} key={token.gene}>
                            <img src={token.image} alt={token.name} />
                            <GridListTileBar
                                title={token.name}
                                titlePosition="top"
                                actionPosition="left"
                            />
                        </GridListTile>
                    ))
                }
                {
                    this.props.tokens.length===0&&
                        <Typography style={{color:"gray"}}>My wallet is empty</Typography>
                }
            </GridList>


        );
    }

}

export default MyToken;