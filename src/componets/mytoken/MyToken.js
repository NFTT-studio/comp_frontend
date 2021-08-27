import React from "react";
import {Typography, ImageList,  ImageListItem, ImageListItemBar, IconButton, Hidden} from "@material-ui/core";

import {ShareOutlined, Twitter} from "@material-ui/icons";


class MyToken extends React.Component {

    handleClick=(e)=>{
        if(this.props.onTokenClick) {
            this.props.onTokenClick(this.props.tokens[e.target.dataset.index]);
        }
    }

     render(){
        return (

            <React.Fragment>
            <ImageList rowHeight={this.props.h5?200:300} cols={this.props.h5?2:4}>
                {
                    this.props.tokens.map((token,index)=>(
                        <ImageListItem cols={1} key={token.gene}>
                            <img src={token.originalimage+"/thumb"} alt={token.name} onClick={this.handleClick} data-index={index} style={{cursor:"pointer"}} />
                            <Hidden smUp>
                            <ImageListItemBar
                                title={token.name}
                                />
                            </Hidden>
                            <Hidden smDown>
                            <ImageListItemBar
                                title={token.name}
                                actionIcon={
                                    <React.Fragment>
                                        <a rel="noreferrer" target={"_blank"} href={"https://twitter.com/intent/tweet?text="
                                            +encodeURIComponent("Check out this account on OpenSea")
                                            +"&url="
                                            +encodeURIComponent("https://opensea.io/assets/0xaba31c041e916e4141036f080b554d40cdb2bcd0/"+token.tokenId)
                                            +"&via=NFTmartio"}>
                                        <IconButton>
                                            <Twitter/>
                                        </IconButton>
                                        </a>
                                        <a rel="noreferrer" href={"https://opensea.io/assets/0xaba31c041e916e4141036f080b554d40cdb2bcd0/"+ token.tokenId } target={"_blank"}>
                                        <IconButton>
                                            <ShareOutlined/>
                                        </IconButton>
                                        </a>
                                    </React.Fragment>


                                }
                            />
                            </Hidden>
                        </ImageListItem>

                    ))
                }
                {
                    this.props.tokens.length===0&&
                        <Typography style={{color:"gray"}}>My wallet is empty</Typography>
                }
            </ImageList>

            </React.Fragment>
        );
    }

}

export default MyToken;