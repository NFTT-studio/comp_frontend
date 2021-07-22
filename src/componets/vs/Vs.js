import React from "react";
import Modal from "@material-ui/core/Modal"
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Avatar, Chip, Grid} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";


const style_modal={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

}
const paper={
    backgroundColor: 'white',
    // border: '2px solid ',
    borderRadius: 2,
    boxShadow: 5,
    padding: '30px 60px',
    display:'flex',
    flexDirection:'row',
}




class Vs extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            open:props.open,
            standard: props.atoken,
            target: props.btoken
        }
    }
    handleClose = ()=>{
        this.setState({open:false});
        if(this.props.onClose){
            this.props.onClose();
        }
    }
    render() {
        // this.setState({open:this.props.open});
        return (
            <Modal
                style={style_modal}
                // aria-labelledby="spring-modal-title"
                // aria-describedby="spring-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.open}>
                    <Grid style={paper}>
                        <Card style={{width:"345px"} }>

                            <CardActionArea>
                                <CardMedia
                                    style={{height:"345px",backgroundColor:"gold"}}
                                    image={this.props.atoken.originalimage+"/thumb"}
                                    title={this.props.atoken.name}

                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {this.props.atoken.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p" >
                                        <Chip
                                            variant="outlined"
                                            size="medium"
                                            avatar={<Avatar>E</Avatar>}
                                            label={this.props.atoken.eye}
                                            color={"primary"}
                                            style={{margin:"10px 10px 0px 0px"}}
                                        />
                                        {
                                            this.props.atoken.maskup.map((value,index)=>(

                                                <Chip key={index}
                                                      variant="outlined"
                                                      size="medium"
                                                      avatar={<Avatar>M{index+1}</Avatar>}
                                                      label={value}
                                                      color={"primary"}
                                                      style={{margin:"10px 10px 0px 0px"}}
                                                />

                                            ))
                                        }
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Grid style={{fontWeight:"bolder",fontSize:20, margin:"30px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>VS</Grid>
                        <Card style={{maxWidth:"345px"}}>

                            <CardActionArea>
                                <CardMedia
                                    style={{height:"345px",backgroundColor:"gold"}}
                                    image={this.props.btoken.originalimage+"/thumb"}
                                    title={this.props.btoken.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {this.props.btoken.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <Chip
                                            variant="outlined"
                                            size="medium"
                                            avatar={<Avatar>E</Avatar>}
                                            label={this.props.btoken.eye}
                                            color={  this.props.atoken.eye === this.props.btoken.eye? "primary":"default"}
                                            style={{margin:"10px 10px 0px 0px"}}
                                        />
                                        {
                                            this.props.btoken.maskup.map((value,index)=>(

                                                <Chip key={index}
                                                      variant="outlined"
                                                      size="medium"
                                                      avatar={<Avatar>M{index+1}</Avatar>}
                                                      label={value}
                                                      color={this.props.atoken.maskup[index] === this.props.btoken.maskup[index]? "primary":"default"}
                                                      style={{margin:"10px 10px 0px 0px"}}
                                                />

                                            ))
                                        }
                                    </Typography>

                                </CardContent>
                            </CardActionArea>
                        </Card>

                    </Grid>

                </Fade>
            </Modal>
        );
    }
}

export default Vs