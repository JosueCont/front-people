import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout_user';
import {Breadcrumb, Card, Button, Row, Col, List, Avatar, Typography, Tooltip, Divider} from 'antd';
import CardPerson from '../../../components/user-assessments/CardPerson';
import TableTests from '../../../components/user-assessments/TableTests';

const index = () => {
    const { Title } = Typography;
  return (
    <>
        <MainLayout currentKey={'myEvaluation'} defaultOpenKeys={["evaluationDiagnosis",'myEvaluation']}> 
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <CardPerson/>
                </Col>
                <Col span={24}>
                   <TableTests/>
                </Col>
            </Row>
        </MainLayout>
    </>
  )
}

export default index