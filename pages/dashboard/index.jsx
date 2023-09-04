import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {
    Space,
    Typography
} from "antd";
import { connect } from "react-redux";
import { withAuthSync } from "../../libs/auth";
import moment from 'moment'
import {
    ContentVertical,
    ContentCards,
    CardInfo
} from '../../components/dashboard/Styled';
import ButtonChangeLang from "../../components/ButtonChangeLang/ButtonChangeLang";
import WidgetTotal from "../../components/dashboard/WidgetTotal";
import WidgetImss from '../../components/dashboard/WidgetImss'
import WidgetContracts from '../../components/dashboard/WidgetContracts'
import WidgetGender from "../../components/dashboard/WidgetGender";
import WidgetBirthday from "../../components/dashboard/WidgetBirthday";
import WidgetGeneration from "../../components/dashboard/WidgetGeneration";
import WidgetAnniversary from "../../components/dashboard/WidgetAnniversary";
import WidgetPayRollCalendar from "../../components/dashboard/WidgetPayRollCalendar";
import { useRouter } from "next/router";
import { SettingOutlined } from "@ant-design/icons";
import WidgetPatronalRegistration from "../../components/dashboard/WidgetPatronalRegistration";
import { css } from '@emotion/core';

moment.locale("es-Mx");

const Dashboard = ({
    currentNode,
    config
}) => {

    const router = useRouter()

    return (
        <>

            <MainLayout currentKey={["dashboard"]}>
                <ContentVertical>
                    <Space size={[8, 0]}>
                        {currentNode?.image && (
                            <img alt='logo' width={80} src={currentNode.image} />
                        )}
                        {/* <Typography.Title style={{ marginBottom: 0 }} level={1}>
                            <Space direction={'vertical'} size={10}>
                                {
                                    currentNode && currentNode.image &&
                                    <img alt={'logo'} width={150} src={currentNode.image} />
                                }

                                <span style={{ fontSize: 20, color: '#1890ff', cursor: 'pointer' }} onClick={() => router.push(`/business/companies/${currentNode.id}`)}> {currentNode && currentNode.name}</span>
                            </Space>
                        </Typography.Title> */}

                        {/*<ButtonChangeLang/>*/}
                        {/* <p style={{ marginBottom: 0 }}>{moment().format('LLL')}</p> */}
                        <Space direction='vertical' size={0}>
                            <Typography.Title
                                level={3}
                                style={{
                                    marginBottom: 0,
                                    cursor: 'pointer'
                                }}
                                onClick={() => router.push(`/business/companies/${currentNode.id}`)}
                            >
                                {currentNode && currentNode.name}
                            </Typography.Title>
                            <Typography.Text>
                                {moment().format('LLL')}
                            </Typography.Text>
                        </Space>
                    </Space>
                    <ContentCards>
                        <CardInfo gap={24}>
                            <WidgetTotal />
                            <WidgetGender />
                        </CardInfo>
                        <CardInfo gap={24}>
                            <WidgetImss />
                        </CardInfo>
                        <WidgetContracts />
                        <WidgetAnniversary />
                        <WidgetGeneration />
                        <WidgetBirthday />
                        {
                            config && config.applications.find(
                                (item) => item.app === "PAYROLL" && item.is_active
                            ) && <WidgetPayRollCalendar />
                        }

                        {
                            config && config.applications.find(
                                (item) => item.app === "PAYROLL" && item.is_active
                            ) && <WidgetPatronalRegistration />
                        }

                    </ContentCards>
                </ContentVertical>
            </MainLayout>
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore?.current_node,
        config: state.userStore?.general_config
    }
}

export default connect(mapState)(withAuthSync(Dashboard));