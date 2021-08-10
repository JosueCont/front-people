import "antd/dist/antd.css";
import "../styles/globals.css";
import "../styles/vars.css";
import "../styles/person.css";
// import { Provider } from "../context";
import { Provider } from "react-redux";
import { langMessages } from "../lang/messages";
import { IntlProvider } from "react-intl";
import React, { useContext, useEffect } from "react";
import { Context } from "../context";
import generateStore from "../redux/store";

const store = generateStore();
function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <IntlProvider
        locale={"es-mx"}
        defaultLocale="es-mx"
        messages={langMessages["es-mx"]}
      >
        <Component {...pageProps} />
      </IntlProvider>
    </Provider>
  );
}

export default App;
