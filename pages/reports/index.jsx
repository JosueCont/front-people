import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import {
    Row,
    Col,
    Table,
    Breadcrumb,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Tabs,
    Tooltip
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    PlusOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import CollaboratorsReport from "../../components/reports/Collaborators";
import PayrollReport from '../../components/reports/Payroll';
import LoanReport from '../../components/reports/Loan';
import HolidaysReport from '../../components/reports/Holidays';
import InabilityReport from '../../components/reports/Inability';


import { withAuthSync } from "../../libs/auth";
import { UserOutlined, DollarOutlined, BankOutlined, TrophyOutlined } from '@ant-design/icons';
/* Icons custom */
import UsersIcon from '../../components/icons/Users';
import HolidayIcon from '../../components/icons/Holidays';
import NominaIcon from '../../components/icons/NominaIcon';
import LoanIcon from '../../components/icons/Loan';
import HealthIcon from '../../components/icons/Health';
import PermissionIcon from '../../components/icons/Permissions';

const Reports = () => {
    const route = useRouter();
    const { TabPane } = Tabs;
    


    return (
        <MainLayout currentKey="8.5">
            <Breadcrumb className={"mainBreadcrumb"}>
                <Breadcrumb.Item onClick={() => route.push('/home')}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Reportes</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }} >
                <Row>
                    <Col span={24}>
                        <Tabs defaultActiveKey="1" tabPosition="left" className="tabReports">
                            <TabPane 
                                tab={<UsersIcon />} 
                                key="1">
                                <CollaboratorsReport />
                            </TabPane>
                            <TabPane tab={<NominaIcon />} key="2">
                                <PayrollReport/>
                            </TabPane>
                            <TabPane tab={<LoanIcon />} key="3">
                                <LoanReport />
                            </TabPane>
                            <TabPane tab={<HolidayIcon />} key="4">
                                <HolidaysReport/>
                            </TabPane>
                            <TabPane tab={<HealthIcon/>} key="5">
                                <InabilityReport/>
                            </TabPane>
                            <TabPane tab={<PermissionIcon/>} key="6">
                                <InabilityReport/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default withAuthSync(Reports);
