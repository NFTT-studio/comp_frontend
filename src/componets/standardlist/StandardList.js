import {
    AppBar,
    Button,
    Container,
    Grid,
    Toolbar,
    Typography,
    Divider,
    GridListTile,
    GridListTileBar, GridList
} from "@material-ui/core";
import React from "react";
import DataApi from "../../DataApi";

const style_root={
    // backgroundColor:,
    paddingTop: "80px",

    // margin:"20px"
};
const style_flex_center={
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
};

class StandardList extends React.Component{
    constructor() {
        super();

        this.state = {
            standardList: [],
        }

    }
    componentDidMount= async ()=> {

        let standardArray = await  DataApi.getAllStandard();
        if(standardArray["code"]===0){
             this.setState({standardList: standardArray["data"]});
        }

    }

    render(){
        return (
            <div  style={style_root}>
            <AppBar position={"fixed"} >
                <Toolbar >
                    <Typography variant="h6" noWrap style={{flexGrow:1}}>
                        Chinese Opera Mask Plus
                    </Typography>

                </Toolbar>
            </AppBar>
                <Container maxWidth="lg" >
                    <Grid container>
                        {
                            this.state.standardList.map((v,index)=>(

                                <Grid item container xs={12} style={{margin:"10px 0px"}}>

                                    <Grid item xs={12} >
                                        {v.name}
                                        <Divider style={{margin: "10px 0px"}}/>
                                    </Grid>

                                    <Grid item xs={8}><img src={v.image} style={{backgroundColor:"gold"}} width={250}/> </Grid>
                                    <Grid item xs={4}>
                                        <GridList cellHeight={150} cols={3}>
                                            {
                                                v.latestMint.map((token,index)=>(
                                                    <GridListTile cols={1} key={token.gene}>
                                                        <img src={token.image} alt={token.name} />
                                                    </GridListTile>
                                                ))
                                            }
                                            {
                                                v.latestMint.length===0&&
                                                <Typography style={{color:"gray"}}>No one mint</Typography>
                                            }
                                        </GridList>
                                    </Grid>
                                </Grid>


                                )
                            )
                        }


                    </Grid>
                </Container>
            </div>
        )
    }
}

export  default StandardList;