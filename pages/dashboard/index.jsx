import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {
    Space,
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
import { useRouter } from "next/router";
import { SettingOutlined } from "@ant-design/icons";

moment.locale("es-Mx");

const Dashboard = ({
    currentNode
}) => {

    const router = useRouter()

    return (
        <>

            <MainLayout currentKey={["dashboard"]}>
                <ContentVertical>
                    <div>
                        <Typography.Title style={{marginBottom:0}} level={1}>
                            <Space size={10}>
                                <>{currentNode && currentNode.name}</>
                                <SettingOutlined style={{ cursor:'pointer' }} onClick={()=> router.push(`/business/companies/${currentNode.id}`) } />
                            </Space>
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