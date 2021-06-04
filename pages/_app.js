import "antd/dist/antd.css";
import "../styles/globals.css";
import "../styles/vars.css";
import "../styles/person.css";
import { Provider } from "../context";
import {langMessages} from "../lang/messages";
import {IntlProvider} from "react-intl";
import React, {useContext, useEffect} from "react";
import { Context } from "../context";


function App({ Component, pageProps }) {

  return (
    <Provider>
        <IntlProvider locale={'es-mx'} defaultLocale="es-mx" messages={langMessages['es-mx']}>
            <Component {...pageProps} />
        </IntlProvider>
    </Provider>
)
}

export default App;
