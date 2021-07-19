import React from "react"
import { Chip,Avatar ,} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class MaskCard extends React.Component{

    render() {

        return (

        <Card style={{maxWidth:"345px"}}>

            <CardActionArea>
                <CardMedia
                    style={{height:"345px"}}
                    image={this.props.token.iimage}
                    title={this.props.token.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.token.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Chip
                            variant="outlined"
                            size="medium"
                            avatar={<Avatar>E</Avatar>}
                            label={this.props.token.eye}
                            color={"primary"}
                            style={{margin:"10px 10px 0px 0px"}}
                        />
                        {
                            this.props.token.maskup.map((value,index)=>(

                                <Chip key={index}
                                    variant="outlined"
                                    size="medium"
                                    avatar={<Avatar>M{index+1}</Avatar>}
                                    label={value}
                                    color={"secondary"}
                                      style={{margin:"10px 10px 0px 0px"}}
                                />

                            ))
                        }
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Card>
        )
    }
}
export default MaskCard