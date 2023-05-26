import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {
    Typography
} from "antd";
import { connect } from "react-redux";
import {withAuthSync} from "../../libs/auth";
import moment from 'moment'
import {
    ContentVertical,
    ContentCards,
    CardInfo
} from '../../components/dashboard/Styled';
import ButtonChangeLang from "../../components/ButtonChangeLang/ButtonChangeLang";
import WidgetTotal from "../../components/dashboard/WidgetTotal";
import WidgetGender from "../../components/dashboard/WidgetGender";
import WidgetBirthday from "../../components/dashboard/WidgetBirthday";
import WidgetGeneration from "../../components/dashboard/WidgetGeneration";
import WidgetAnniversary from "../../components/dashboard/WidgetAnniversary";

moment.locale("es-Mx");

const Dashboard = ({
    currentNode
}) => {

    return (
        <>

            <MainLayout currentKey={["dashboard"]}>
                <ContentVertical>
                    <div>
                        <Typography.Title style={{marginBottom:0}} level={1}>
                            {currentNode && currentNode.name}
                        </Typography.Title>
                        <p style={{marginBottom: 0}}>{moment().format('LLL')}</p>
                        {/*<ButtonChangeLang/>*/}
                    </div>
                    <ContentCards>
                        <CardInfo gap={24}>
                            <WidgetTotal/>
                            <WidgetGender/>
                        </CardInfo>
                        <WidgetAnniversary/>
                        <WidgetGeneration/>
                        <WidgetBirthday/>
                    </ContentCards>
                </ContentVertical>
            </MainLayout>
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore?.current_node
    }
}

export default connect(mapState)(withAuthSync(Dashboard));