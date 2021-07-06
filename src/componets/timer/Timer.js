import React from "react";
import {Grid} from "@material-ui/core";

// const root
let styleTimeItem = {
    textAlign:"center",
    margin:"15px",
    fontSize: "20px",
    fontWeight: "bloder",
    width: "140px"

}
let styleTimeNumber = {
    margin:"15px",
    fontSize: "80px"
}
class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds:  props.seconds
        }
    }
    _timer
    handlerTimer=()=>{
        let newSeconds = this.state.seconds-1;
        if(newSeconds === 0){
            // window.opener.location.href=window.opener.location.href;
            window.location.reload();
        }
        this.setState({seconds:newSeconds>0?newSeconds:0 });
    }
    componentDidMount() {
        this._timer = setInterval(this.handlerTimer,1000)
    }
    componentWillUnmount() {
        clearInterval(this._timer);
    }

    render(){

        let d = parseInt( this.state.seconds/(3600*24));
        let h = parseInt( this.state.seconds%(3600*24)/(60*60));
        let m = parseInt(  this.state.seconds%(60*60)/60);
        let s =  this.state.seconds%60;

        return (
             <Grid container style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                 {d>0&&
                     <Grid item style={styleTimeItem}>
                         <Grid item xs={12} style={styleTimeNumber}>{d}</Grid>
                         <Grid item xs={12}>DAY</Grid>
                     </Grid>
                 }
                 {h>0&&
                     <Grid item style={styleTimeItem}>
                         <Grid item xs={12} style={styleTimeNumber}>{h}</Grid>
                         <Grid item xs={12}>HOURS</Grid>
                     </Grid>
                 }
                 <Grid  item style={styleTimeItem}>
                    <Grid item xs={12} style={styleTimeNumber}>{m}</Grid>
                    <Grid item xs={12}>MINUTES</Grid>
                 </Grid>
                 <Grid style={styleTimeItem}>
                    <Grid item style={styleTimeNumber} xs={12}>{s}</Grid>
                    <Grid item xs={12}>SECONDS</Grid>
                 </Grid>

             </Grid>
        );
    }
}
export default Timer