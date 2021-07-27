import React from "react";
import {Typography,Accordion,AccordionSummary,AccordionDetails} from "@material-ui/core";
import { withStyles  } from '@material-ui/core';
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

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(key,value) {
    return { key, value };
}

const rows = [
    createData("CryptoPunks","0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"),
    createData("Hashmasks","0xc2c747e0f7004f9e8817db2ca4997657a7746928"),
    createData("CryptoKitties","0x07c0ca4600dec713a40a7cc5f98bec70770f14c8")
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
                       <Typography ><b>1. What is the Chinese Opera Mask?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography >
                           The Chinese opera is one of the oldest known dramatic art forms worldwide. Most audience or spectators are more fascinated with the Opera masks in every opera performance.
                           <br/><br/>
                           However, these masks are more than seemingly added decorations. Chinese opera masks are significant in the way that they represent the performers’ or characters’ personalities, intense moods, and status quo even. Expressive meanings through facial designs, each character has a unique mask shape.
                           <br/><br/>
                           Chinese opera mask is basically among the main methods, which performers use as makeup. Since opera masks are used in representing various human emotions, the change of color and facial expressions make each mask to be uniqueness.
                       </Typography>
                   </AccordionDetails>
               </Accordion>
               <Accordion>
                   <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
                       <Typography ><b>2. What is Chinese Opera Mask+(COMP)?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           Chinese Opera Masks+ (abbreviation: COMP) is a collection of NFTs based on the Ethereum blockchain, which is created from traditional Chinese opera art. The randomness change of the facial design, eyes, and colors created varied mask NFTs.
                           <br/><br/>
                           The masks instantly conveyed the emotion of characters and different intended meanings. Even the same mask can have different feelings because of the viewer's different cultural background and life experience. Each COMP NFT is a unique artwork and has a specific collection value.
                           <br/><br/>
                           Contract address:  <a style={{color:"white"}} rel="noreferrer" target={"_blank"} href={"https://etherscan.io/token/0xaba31c041e916e4141036f080b554d40cdb2bcd0"} > https://etherscan.io/token/0xaba31c041e916e4141036f080b554d40cdb2bcd0</a>
                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
                       <Typography ><b>3. How is COMP issued?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography component={"div"}>
                           From July 26 to September 25, we will launch the first batch of COMP artworks on Ethereum. It will be lasting for 60 days, with a maximum circulation of 10,000 unique COMP NFTs. All COMP NFTs are free to claim during the time. At the same time, users can claim 5-20 NMT tokens airdrop. After the first batch is completed, the NFT of COMP will be available only through synthesis and breed.
                           <br/><br/>
                           (1) Blind box users
                           <br/><br/>
                           Users who participate in the early activities of NFTMart can obtain the COMP NFT blind box, which means can be directly eligible to draw COMP through the whitelist. Each whitelist has at least one chance to claim.
                           <br/><br/>
                           (2) Users who hold NMT
                           <br/><br/>
                           Users who hold NMT and if the amount of NMT is more than the minted NFTs have an opportunity to mint COMP for free.
                           <br/><br/>
                           If you hold NMT continuously, you can mint COMP multiple times. The interval between each minting increases from 4 hours, and each minting increases by 4 hours.
                           <br/><br/>
                           The system can mint up to 200 COMP NFTs per hour. If it exceeds 200, please wait for the next hour and try again.
                           <br/><br/>
                           (3) Users who hold designated NFTs
                           <br/><br/>
                           users who hold the following NFTs can participate in the casting of COMP NFT one time.
                           <br/><br/>

                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <StyledTableCell>Name</StyledTableCell>
                                           <StyledTableCell align="right">Contract</StyledTableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       {rows.map((row) => (
                                           <StyledTableRow key={row.key}>
                                               <StyledTableCell component="th" scope="row">
                                                   {row.key}
                                               </StyledTableCell>
                                               <StyledTableCell align="right">{row.value}</StyledTableCell>
                                           </StyledTableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </TableContainer>
                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel4a-content" id="panel4a-header">
                       <Typography ><b>4. What are the types of COMP and what is the supply?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography component={"div"}>
                           The first batch of COMP NFT is derived from 100 original Chinese Opera masks. Each mask will have various changes in eyes and colors. COMP will have gender attributes, which will be used in the second phase of synthesis and breed.
                           <br/><br/>
                           Among the supply of COMP, there is a total of 5 eye colors. The different mask has different facial designs, and each area of the mask will undergo color changes independently. There are up to 10 color changes for each area. The changes in eyes and colors are completely random, and the random probability of color is the same.
                           <br/><br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <StyledTableCell>DNA-NAME</StyledTableCell>
                                           <StyledTableCell align="right"> Color </StyledTableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       {dnamap.map((row) => (
                                           <StyledTableRow key={row.key}>
                                               <StyledTableCell component="th" scope="row">
                                                   {row.key}
                                               </StyledTableCell>
                                               <StyledTableCell align="right">{row.value}</StyledTableCell>
                                           </StyledTableRow>
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
                                           <StyledTableCell>Gender</StyledTableCell>
                                           <StyledTableCell align="right"> Probability </StyledTableCell>
                                           <StyledTableCell align="right"> BackgroundColor </StyledTableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                           <StyledTableRow >
                                               <StyledTableCell component="th" scope="row">Male</StyledTableCell>
                                               <StyledTableCell align="right">35%</StyledTableCell>
                                               <StyledTableCell align="right">#99cee8</StyledTableCell>
                                           </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Female</StyledTableCell>
                                           <StyledTableCell align="right">25%</StyledTableCell>
                                           <StyledTableCell align="right">#f08083</StyledTableCell>
                                       </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Atoke</StyledTableCell>
                                           <StyledTableCell align="right">35%</StyledTableCell>
                                           <StyledTableCell align="right">#797eb3</StyledTableCell>
                                       </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Androgyny</StyledTableCell>
                                           <StyledTableCell align="right">5%</StyledTableCell>
                                           <StyledTableCell align="right">#f4a878</StyledTableCell>
                                       </StyledTableRow>
                                   </TableBody>
                               </Table>
                           </TableContainer>

                       </Typography>
                   </AccordionDetails>
               </Accordion>

               <Accordion>
                   <AccordionSummary aria-controls="panel5a-content" id="panel5a-header">
                       <Typography ><b>5. What is the gender of COMP ? How about breed and synthesis?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography component={"div"}>
                           About 1 month after the end of free minting, we will start the synthesis and breed of the COMP. Users can obtain their favorite COMP through synthesis and breed, You own the lifecycle of the COMP.
                           <br/><br/>
                           <b>Synthesis</b>
                           <br/>
                           The synthesis of COMP is through burning two COMP NFTs to minting a new COMP NFT. During the synthesis, the DNA of the two faces will fuse. There is a certain probability of mutation, which will be resulting in rare and new varieties.
                           <br/><br/>
                           <b>Breed</b>
                           <br/>
                           The breed of COMP is that a new COMP can be mint but the original COMPs will not consume.
                           <br/><br/>
                           The gender of COMP affects the reproductive ability of COMP.
                           <br/><br/>
                           There are four genders: Female, Male, Androgyny, and Atoke.
                           <br/><br/>
                           The rules for whether different sexes can breed are as follows:
                           <br/>
                           <TableContainer component={Paper}>
                               <Table  aria-label="customized table">
                                   <TableHead>
                                       <TableRow>
                                           <StyledTableCell></StyledTableCell>
                                           <StyledTableCell align="right">Female</StyledTableCell>
                                           <StyledTableCell align="right">Male</StyledTableCell>
                                           <StyledTableCell align="right">Androgyny</StyledTableCell>
                                           <StyledTableCell align="right">Atoke</StyledTableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Female</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                       </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Male</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                       </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Androgyny</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">o</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                       </StyledTableRow>
                                       <StyledTableRow >
                                           <StyledTableCell component="th" scope="row">Atoke</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                           <StyledTableCell align="right">x</StyledTableCell>
                                       </StyledTableRow>
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
                       <Typography ><b>6. Which wallets can be used for minting COMP?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           Ethereum wallets that support tradable on the chain can be used to extract COMP, such as MetaMask.
                       </Typography>
                   </AccordionDetails>
               </Accordion>
               <Accordion>
                   <AccordionSummary aria-controls="panel7a-content" id="panel7a-header">
                       <Typography ><b>7. How to sell COMP NFT?</b></Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                       <Typography>
                           The  COMP NFT can be sold at <a href={"https://opensea.io/"} rel="noreferrer" style={{color:"white"}}  target={"_blank"}>https://opensea.io/</a>.
                       </Typography>
                   </AccordionDetails>
               </Accordion>

          </React.Fragment>
       )
   }
}

export default About;