import React from 'react';
import MainLayout from '../../layout/MainLayout_user'
import {
    Typography
} from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../libs/auth';
import moment from "moment";
import {
    ContentVertical,
    ContentCards
} from '../../components/dashboard/Styled';
import WidgetRequests from '../../components/dashboard/WidgetRequests';
import WidgetBirthday from '../../components/dashboard/WidgetBirthday';
import WidgetPayroll from '../../components/dashboard/WidgetPayroll';
import _ from "lodash";

moment.locale("es-mx");

const { Title } = Typography;

const index = ({
    currentNode,
    user,
    applications
}) => {
    return (
        <MainLayout
            currentKey='dashboard'
            defaultOpenKeys={["dashboard", 'dashboard']}
        >
            <ContentVertical>
                <div>
                    <Title style={{ marginBottom: 0 }} level={1}>{currentNode && currentNode.name}</Title>
                    <p style={{ marginBottom: 0 }}>{moment().format('LLL')}</p>
                </div>
                {/*<ContentCards>*/}
                {/*    {*/}
                {/*        applications && (_.has(applications, "concierge") && applications["concierge"].active) && <WidgetRequests />*/}
                {/*    }*/}

                {/*    {*/}
                {/*        applications && (_.has(applications, "payroll") && applications["payroll"].active) && <WidgetPayroll/>*/}
                {/*    }*/}

                {/*    {*/}
                {/*        applications && (_.has(applications, "concierge") && applications["concierge"].active) && <WidgetBirthday redirectPerson={false} />*/}
                {/*    }*/}

                {/*</ContentCards>*/}
            </ContentVertical>
        </MainLayout>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore?.current_node,
        user: state.userStore?.user,
        applications: state.userStore.applications,
    }
}

export default connect(mapState)(withAuthSync(index));