import React from "react";
import DataApi from "../../DataApi";
import {GridList, GridListTile,GridListTileBar} from "@material-ui/core";

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
            this.setState({tokens: tokens.data.slice(0,12)});
        }

    }

    handleClick=(e)=>{
        if(this.props.onTokenClick) {
            this.props.onTokenClick(this.state.tokens[e.target.dataset.index]);
        }
    }

    render() {
        return (

            <GridList cellHeight={150} cols={9}>
                {

                    this.state.tokens.map((token,index)=>(

                        <GridListTile cols={index<3?3:1} key={token.gene} rows={index<3?3:1}>
                            <img src={token.originalimage+ (index<3?"/thumb":"/thumb2")} onClick={this.handleClick} data-index={index} alt={token.name}
                                 style={{cursor: "pointer"}}/>
                            {index<3&&
                                <GridListTileBar
                                    title={token.name}
                                    // subtitle={<span>gene: {token.gene}</span>}

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