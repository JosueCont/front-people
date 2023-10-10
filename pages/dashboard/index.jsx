import React, { useMemo } from "react";
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
    ContentCards
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
import WidgetPatronalRegistration from "../../components/dashboard/WidgetPatronalRegistration";

moment.locale("es-Mx");

const Dashboard = ({
    currentNode,
    config
}) => {

    const router = useRouter();

    const activePayroll = useMemo(() => {
        const some_ = item => item.app === 'PAYROLL' && item.is_active;
        return config?.applications?.some(some_);
    }, [config?.applications])

    return (
        <>

            <MainLayout currentKey={["dashboard"]}>
                <ContentVertical>
                    <Space size={[8, 0]}>
                        {currentNode?.image && (
                            <img alt='logo' width={80} src={currentNode.image} />
                        )}
                        <Space direction='vertical' size={0}>
                            <Typography.Title
                                level={3}
                                style={{
                                    marginBottom: 0,
                                    cursor: 'pointer'
                                }}
                                onClick={() => router.push(`/business/companies/myCompany/${currentNode.id}`)}
                            >
                                {currentNode && currentNode.name}
                            </Typography.Title>
                            <Typography.Text>
                                {moment().format('LLL')}
                            </Typography.Text>
                        </Space>
                    </Space>
                    <ContentCards>
                        <WidgetTotal />
                        <WidgetGender />
                        <WidgetGeneration />
                        {activePayroll && (
                            <>
                                <WidgetImss />
                                <WidgetPayRollCalendar />
                                <WidgetPatronalRegistration />
                            </>
                        )}
                        <WidgetAnniversary />
                        <WidgetBirthday />
                        {!activePayroll && <WidgetContracts />}
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