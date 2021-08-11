import React from "react";
import DataApi from "../../DataApi";
import {GridList, GridListTile, GridListTileBar,  IconButton} from "@material-ui/core";
import {ShareOutlined } from "@material-ui/icons";

class RecentlyToken extends React.Component {


    constructor() {
        super();
        this.state = {
            tokens:[]
        };
    }
    componentDidMount = async () =>{

        let tokens = await DataApi.pageTokens(0);
        if(tokens&& tokens.code==="0"){
            this.setState({tokens: tokens.data.slice(0,this.props.h5?4:12)});
        }

    }

    handleClick=(e)=>{
        if(this.props.onTokenClick) {
            this.props.onTokenClick(this.state.tokens[e.target.dataset.index]);
        }
    }

    render() {
        return (

            <GridList cellHeight={this.props.h5?120:150} cols={this.props.h5?3:9}>
                {

                    this.state.tokens.map((token,index)=>(

                        <GridListTile cols={index<(this.props.h5?1:3)?3:1} key={token.gene} rows={index<(this.props.h5?1:3)?3:1}>
                            <img src={token.originalimage+ (index<3?"/thumb":"/thumb2")} onClick={this.handleClick} data-index={index} alt={token.name}
                                 style={{cursor: "pointer"}}/>
                            {index<(this.props.h5?1:3)&&
                                <GridListTileBar
                                    title={token.name}
                                    actionIcon={
                                        <React.Fragment>
                                            <a rel="noreferrer" href={"https://opensea.io/assets/0xaba31c041e916e4141036f080b554d40cdb2bcd0/"+ token.tokenId } target={"_blank"}>
                                                <IconButton>
                                                    <ShareOutlined/>
                                                </IconButton>
                                            </a>
                                        </React.Fragment>
                                    }
                                />
                            }
                        </GridListTile>
                    ))
                }
            </GridList>


        );
    }

}

export default RecentlyToken;