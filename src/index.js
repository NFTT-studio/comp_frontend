import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme =createMuiTheme( {
    typography: {
        fontFamily: 'TTHoves',
    },
    palette: {
        type: 'dark',
        primary: {
            main:"#000000"
        },
        secondary:{
            main:"#3D00FF"
        },
        warning:{
            main:"#F14E1D"
        }
    },
});

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
      <App />
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
