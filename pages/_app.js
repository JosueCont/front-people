import "antd/dist/antd.css";
import "../styles/globals.css";
import "../styles/vars.css";
import "../styles/person.css";
import "../styles/sizeScreen.css";
import "../styles/calendar.css";
import { Provider } from "react-redux";
import { langMessages } from "../lang/messages";
import { IntlProvider } from "react-intl";
import React from "react";
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
