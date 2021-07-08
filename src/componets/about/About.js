import React from "react";
import {Typography} from "@material-ui/core";

class About extends React.Component{
   render() {
       return (
           <div style={{color:"gray",fontWeight:"bolder"}}>
               <Typography gutterBottom={true} variant="body1">
               Chinese Opera Mask+ is an NFT collection created based on Chinese opera makeup and stored on the Ethereum blockchain.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               Chinese opera makeup is unique to traditional Chinese opera, which is different from the makeup and modeling art of any drama in other countries. Each historical figure or a certain type of character in opera facial makeup has a general pattern. From the perspective of drama, it is characterized; from the perspective of fine art, it is pictorial.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               The matching of Chinese opera facial makeup and characters is also a makeup effect, with unique charm, high appreciation value and aesthetic significance. Through exaggerated strong colors and endless lines to change the original face of the actor.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               Chinese Opera Mask+ takes the Chinese opera facial makeup as its mother base, increases the randomness of the eye and makeup color changes, and creates a more varied facial makeup. Even the same facial makeup can have completely different psychological resonances due to different cultural backgrounds and life experiences of the viewers. Each Facebook NFT is a unique existence and has a great collection value.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               In order to allow the majority of Chinese opera Facebook fans to have their favorite Facebook, we will start a 60-day free collection event. A total of 10,000 Facebooks were released. All Facebook castings are randomly generated through smart contracts.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               To participate in the free claim activity, you only need to hold a certain amount of NFTMart Token in your account, and the number of positions held is related to the number of Facebook NFTs you have received.
               </Typography>
               <Typography gutterBottom={true} variant="body1">
               After NFTMart goes online, we will open a cross-chain channel, support the cross-chain of NFT minted on the Ethereum chain to NFTMart, and participate in subsequent minting activities.
                </Typography>
           </div>
       )
   }
}

export default About;