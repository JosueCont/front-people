import "antd/dist/antd.css";
import "../styles/globals.css";
import "../styles/vars.css";
import "../styles/person.css";
import "../styles/sizeScreen.css";
import "../styles/calendar.css";
import "../styles/payroll.css";
import "../styles/assessments.css";
import { Provider } from "react-redux";
import { langMessages } from "../lang/messages";
import { IntlProvider } from "react-intl";
import React from "react";
// import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import generateStore from "../redux/store";

// Sentry.init({
//     dsn: "https://77f01f611a4844f6bb16e2fa9369c2bc@sentry.hiumanlab.com/7",
//     integrations: [new BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
// });

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
