import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {
	ChakraProvider
} from "@chakra-ui/react"
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( 
  <ChakraProvider >
		<App />
	</ChakraProvider>, document.getElementById('root'));

	// If you want your app to work offline and load faster, you can change
	// unregister() to register() below. Note this comes with some pitfalls.
	// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();