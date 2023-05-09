import React, { useLayoutEffect, useState } from "react";
import { Typography } from "antd";
import {connect} from "react-redux";
import {injectIntl, FormattedMessage} from "react-intl";
import {changeLanguage} from "../../redux/UserDuck";
import {
    TranslationOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const ButtonChangeLang = ({colorText='#000',changeLanguage,lang }) => {

    const change=()=>{
        const l = lang==='es-mx'?'en-us':'es-mx';
        changeLanguage(l)
        location.reload()
    }

    return (
        <Text underline
              style={{cursor:'pointer',color:colorText}}
              onClick={change} >
            <TranslationOutlined /> <FormattedMessage id="config.changeLang"/>
        </Text>
    )
}


const mapState = (state) => {
    return {
        lang: state.userStore.lang
    };
};

export default injectIntl(connect(mapState, {
    changeLanguage
})(ButtonChangeLang));