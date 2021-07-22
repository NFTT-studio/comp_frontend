import React from "react";
import {Typography, GridList, GridListTile, GridListTileBar} from "@material-ui/core";

class MyToken extends React.Component {

    handleClick=(e)=>{
        if(this.props.onTokenClick) {
            this.props.onTokenClick(this.props.tokens[e.target.dataset.index]);
        }
    }

     render(){
        return (

            <GridList cellHeight={300} cols={4}>
                {
                    this.props.tokens.map((token,index)=>(
                        <GridListTile cols={1} key={token.gene}>
                            <img src={token.originalimage+"/thumb"} alt={token.name} onClick={this.handleClick} data-index={index} style={{cursor:"pointer"}} />
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