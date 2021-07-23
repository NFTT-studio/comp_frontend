import React from "react";
import {Typography,Accordion,AccordionSummary,AccordionDetails} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

// const useStyles = makeStyles({
//     table: {
//         minWidth: 300,
//         maxWidth: 500
//     },
// });

// const StyledTableRow = withStyles((theme) => ({
//     root: {
//         '&:nth-of-type(odd)': {
//             backgroundColor: theme.palette.action.hover,
//         },
//     },
// }))(TableRow);

function createData(key,value) {
    return { key, value };
}

const rows = [
    createData("CryptoPunks","0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"),
    createData("Bored Ape Yacht Club","0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"),
    createData("Bored Ape Kennel Club","0xba30e5f9bb24caa003e9f2f0497ad287fdf95623"),
    createData("Art Blocks Curated","0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270"),
    createData("Cool Cats NFT","0x1a92f7381b9f03921564a437210bb9396471050c"),
    createData("Hashmasks","0xc2c747e0f7004f9e8817db2ca4997657a7746928"),
    createData("ZED RUN","0xa5f1ea7df861952863df2e8d1312f7305dabf215")
];
const dnamap=[

    createData("Eye:1","Black(#000000)"),
    createData("Eye:2","Blue(#032D92)"),
    createData("Eye:3","Purple(#7F2B90)"),
    createData("Eye:4","Red(#E90000)"),
    createData("EYE:5","Brown(#6B3A00)"),
    createData("Makeup:1","Black(#000000)"),
    createData("Makeup:2","Green(#009A40)"),
    createData("Makeup:3","Red(#EA0D06)"),
    createData("Makeup:4","Yellow(#FFF300)"),
    createData("Makeup:5","Blue(#003D9C)"),
    createData("Makeup:6","Purple(#86226D)"),
    createData("Makeup:7","Gold(#F4D359)"),
    createData("Makeup:8","Silver(#E2E2E1)"),
    createData("Makeup:9","White(#FFFFFF)"),
    createData("Makeup:10","Original(#Not fixed, from original mask definition)"),
];


class About extends React.Component{
   render() {
       // const  {classes} = this.props;
       return (
           <React.Fragment>
               <Accordion>
                   <AccordionSummary
                       aria-controls="panel1a-content"
                       id="panel1a-header"
                   >
                       <Typography >1. How about Chinese Opera Mask?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography >
                           Chinese opera masks are unique to traditional Chinese opera, and are different from the makeup and plastic art of any drama in other countries. Every historical figure or a certain type of figure has a general mask. From the perspective of drama, it is characterized; from the perspective of fine art, it is pictorial.
                            <br/><br/>
                           The matching of Chinese opera masks with characters is also a makeup effect, with unique charm, high appreciation value and aesthetic significance. By exaggerating the strong colors and endlessly changing lines to change the original face of the actor.
                       </Typography>
                   </AccordionDetails>
               </Accordion>
               <Accordion>
                   <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
                       <Typography >2. How about Chinese Opera Mask+(COMP)?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           Chinese Opera Masks+ (abbreviation:COMP) is a collection of NFT products created based on Chinese opera masks on the Ethereum blockchain. By increasing the randomness of the eye and makeup color changes, a more varied mask shape is created. Even the same mask can have different psychological feelings because of the viewer's different cultural background and life experience. Each COMP NFT is a unique existence and a collection value.
                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
                       <Typography >3. How is COMP issued?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography component={"div"}>
                           The first batch of COMP works will be distributed through Ethereum, from July 26 to September 25, lasting 60 days, with a maximum circulation of 10,000. All COMP NFTs are distributed through free extraction. After the first batch is completed, the NFT of COMP will be available only through synthesis and breed.
                            <br/><br/>
                           (1) Blind box users
                           <br/><br/>
                           Users who participate in the NFT blind box obtained by participating in the early activities of NFTMart will be directly eligible to draw COMP through the whitelist. Each whitelist has at least one chance to draw.
                           <br/><br/>
                           (2) Users who hold NMT
                           <br/><br/>
                           All users who hold NMT, if they hold the same amount of NMT as the currently issued NFT, can participate in the opportunity to mint COMP for free. If you hold it continuously, you can cast multiple times. The interval between each mint increases from 4 hours, and the interval between each mint increases by 4 hours.
                           <br/><br/>
                           The system can cast up to 40 COMP NFTs per hour. If it exceeds 40, please wait for the next hour and try again.
                           <br/><br/>
                           (3) Users who hold designated NFTs
                           <br/><br/>
                           All users who hold the following NFTs can participate in the casting of COMP NFT once.
                           <br/><br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <TableCell>Name</TableCell>
                                           <TableCell align="right">Contract</TableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       {rows.map((row) => (
                                           <TableRow key={row.key}>
                                               <TableCell component="th" scope="row">
                                                   {row.key}
                                               </TableCell>
                                               <TableCell align="right">{row.value}</TableCell>
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </TableContainer>
                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel4a-content" id="panel4a-header">
                       <Typography >4. What are the classifications of COMP, and what is the supply?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography component={"div"}>
                           The first batch of COMP NFT is derived from 100 original Chinese theater masks. Each mask will have various changes in eyes and makeup colors. COMP will have gender attributes, which will be used in the second phase of synthesis and breed. Used when new NFT.
                           <br/><br/>
                           There are 5 eye colors for COMP, and there are multiple areas for makeup colors, and each area will undergo color changes independently. There are up to 10 color changes for each area. The changes in eyes and colors are completely random, and all colors have random probability the same.
                           <br/><br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <TableCell>DNA-NAME</TableCell>
                                           <TableCell align="right"> Color </TableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       {dnamap.map((row) => (
                                           <TableRow key={row.key}>
                                               <TableCell component="th" scope="row">
                                                   {row.key}
                                               </TableCell>
                                               <TableCell align="right">{row.value}</TableCell>
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </TableContainer>

                           <br/><br/>
                           There are four genders of COMP NFT: Female, Male, Androgyny and Atoke. Control the casting probability by random numbers:
                           <br/><br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <TableCell>Gender</TableCell>
                                           <TableCell align="right"> Probability </TableCell>
                                           <TableCell align="right"> BackgroundColor </TableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                           <TableRow >
                                               <TableCell component="th" scope="row">Male</TableCell>
                                               <TableCell align="right">35%</TableCell>
                                               <TableCell align="right">#99cee8</TableCell>
                                           </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Female</TableCell>
                                           <TableCell align="right">25%</TableCell>
                                           <TableCell align="right">#f08083</TableCell>
                                       </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Atoke</TableCell>
                                           <TableCell align="right">35%</TableCell>
                                           <TableCell align="right">#797eb3</TableCell>
                                       </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Androgyny</TableCell>
                                           <TableCell align="right">5%</TableCell>
                                           <TableCell align="right">#f4a878</TableCell>
                                       </TableRow>
                                   </TableBody>
                               </Table>
                           </TableContainer>

                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel5a-content" id="panel5a-header">
                       <Typography >5. What is the use of the gender of COMP? How about breed and synthesis</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           About 1 month after the end of free minting, we will start the  synthesis and reproduction of the COMP. Through  synthesis and reproduction, users can obtain their favorite COMP.
                           <br/><br/>
                           <b>Synthesis:</b>
                           <br/>
                           The synthesis of COMP is to destroy two COMP, and then minting a new COMP. During synthesis, the DNA of the two faces will fuse. There is a certain probability of mutation, resulting in completely different new varieties.
                           <br/><br/>
                           Breed:
                           <br/>
                           The breed of COMP is that a new COMP can be mint when two COMPs are not consumed.
                           <br/><br/>
                           The gender of COMP affects the reproductive ability of COMP. There are four genders: Female, Male, Androgyny and Atoke.
                           <br/><br/>
                           The rules for whether different sexes can breed are as follows:
                           <br/><br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <TableCell></TableCell>
                                           <TableCell align="right">Female</TableCell>
                                           <TableCell align="right">Male</TableCell>
                                           <TableCell align="right">Androgyny</TableCell>
                                           <TableCell align="right">Atoke</TableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Female</TableCell>
                                           <TableCell align="right">x</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">x</TableCell>
                                       </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Male</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">x</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">x</TableCell>
                                       </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Androgyny</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">o</TableCell>
                                           <TableCell align="right">x</TableCell>
                                       </TableRow>
                                       <TableRow >
                                           <TableCell component="th" scope="row">Atoke</TableCell>
                                           <TableCell align="right">x</TableCell>
                                           <TableCell align="right">x</TableCell>
                                           <TableCell align="right">x</TableCell>
                                           <TableCell align="right">x</TableCell>
                                       </TableRow>
                                   </TableBody>
                               </Table>
                           </TableContainer>
                           <br/>
                           o: can breed；x: can't breed
                       </Typography>
                   </AccordionDetails>
               </Accordion>
               <Accordion>
                   <AccordionSummary aria-controls="panel5a-content" id="panel6a-header">
                       <Typography >6. What wallets can be used for minting COMP?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           Ethereum wallets that support tradable on the chain can be used to extract COMP, such as the commonly used MetaMask.
                       </Typography>
                   </AccordionDetails>
               </Accordion>
               <Accordion>
                   <AccordionSummary aria-controls="panel7a-content" id="panel7a-header">
                       <Typography >7.How to sell COMP NFT?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           The  COMP NFT can be sold at <a href={"https://opensea.io/"}  style={{color:"white"}}  target={"_blank"}>https://opensea.io/</a>.
                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel8a-content" id="panel8a-header">
                       <Typography >8. How many digits can be entered for the lucky number?</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           It can be entered arbitrarily, and 4 digits or less are recommended, otherwise it may affect the transaction fee on the chain.
                       </Typography>
                   </AccordionDetails>
               </Accordion>

          </React.Fragment>
       )
   }
}

export default About;