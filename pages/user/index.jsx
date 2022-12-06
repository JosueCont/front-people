import React, { useEffect } from 'react';
import MainLayout from '../../layout/MainLayout_user'
import { Breadcrumb, Card, Button, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../libs/auth';
import { useRouter } from 'next/router';
import CardApps from "../../components/dashboards-cards/CardApp";

import {
    LinkOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const index = ({
    currentNode
}) => {

    const router = useRouter();

    const listAccess = [
        {
            name: 'Catálogos',
            icon: <FileTextOutlined/>,
            redirect: () => router.push('/jobbank/settings/catalogs')
        },
        {
            name: 'Conexiones',
            icon: <LinkOutlined/>,
            redirect: () => router.push('/jobbank/settings/connections')
        }
    ]

    return (
        <MainLayout currentKey={'jb_settings'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            {/* <div className='list-access'>
                {listAccess.map((item, idx) => (
                    <div key={idx} className='card-access' onClick={()=> item.redirect()}>
                        {item.icon}<p>{item.name}</p>
                    </div>
                ))}
            </div> */}
              <Row gutter={16}>
      <Col className="gutter-row" span={4}>
      <CardApps />
      </Col>
     
    </Row>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(withAuthSync(index));