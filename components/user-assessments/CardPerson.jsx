import React, {useState, useEffect} from 'react';
import { FileDoneOutlined, FileSyncOutlined } from "@ant-design/icons";
import {Card, Row, Col, Avatar, Button, Grid} from 'antd';
import { MdEmail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { useUser } from '../../utils/useUser';
import { useStatistics } from '../../utils/useStatistics';
import { getFullName } from '../../utils/functions'

//Components
import CardGeneric from '../dashboards-cards/CardGeneric';
import { 
    ContentStart,
    ContentVertical,
    Title2,
    CustomCard } from '../validation/styledAssesments';
import { useSelector } from 'react-redux';
const { useBreakpoint } = Grid;

const CardPerson = ({...props}) => {
    const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    
    const user = useSelector(state => state.userStore.user);
    const { toAnswer, completed } = useStatistics();
    const screens = useBreakpoint();    

  return (
    <Row gutter={[24,24]} align={'middle'}>
        {screens.sm && screens.md &&
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={14}>
            <CustomCard
              loading={false}
              bordered={false}
              bg={'#fffff'}
            >
              <Row gutter={[16,24]} align='middle'>
                <Col sm={24} md={18} lg={16} xl={19}>
                  <ContentStart gap={'16px'}>
                    <Avatar
                        shape={'circle'}
                        size={62}
                        src={user?.photo ? user?.photo : defaulPhoto}
                    />
                    <ContentVertical>
                      <ContentStart gap={'8px'}>
                        <FaUser style={{fontSize: '1rem', color: '#121212'}}/>
                        <Title2 color={'#121212'} cut={true}>
                            {user && getFullName(user)}
                        </Title2>
                      </ContentStart>
                      <ContentStart gap={'8px'}>
                        <MdEmail style={{fontSize: '1rem', color: '#121212'}}/>
                        <Title2 cut={true} color={'#121212'}>
                            {user?.email}
                        </Title2>
                      </ContentStart>
                    </ContentVertical>
                  </ContentStart>
                </Col>
              </Row>
            </CustomCard>
        </Col>
        }
        <Col xs={24} sm={12} md={12} lg={12} xl={6} xxl={5}>
          <CardGeneric
            title={'Evaluaciones completadas'}
            icon={<FileDoneOutlined />}
            color={'#F99543'}
            numcard={completed}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={6} xxl={5}>
          <CardGeneric
            title={'Evaluaciones por contestar'}
            icon={<FileSyncOutlined />}
            color={'#121212'}
            numcard={toAnswer}
          />
        </Col>
    </Row>
  )
}

export default CardPerson;