import React, {useState, useEffect} from 'react';
import { FileDoneOutlined, FileSyncOutlined } from "@ant-design/icons";
import { Card, Row, Col, Avatar, Button}  from 'antd';
import { MdEmail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { useUser } from '../../utils/useUser';
import { useStatistics } from '../../utils/useStatistics';

//Components
import CardGeneric from '../dashboards-cards/CardGeneric';
import { 
    ContentStart,
    ContentVertical,
    Title2,
    CustomCard } from '../validation/styledAssesments';

const CardPerson = ({...props}) => {
    const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    const { user } = useUser();
    const { toAnswer, completed } = useStatistics();

  return (
    <Row gutter={[24,24]} align={'middle'}>
        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
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
                            {user.fullName}
                        </Title2>
                      </ContentStart>
                      <ContentStart gap={'8px'}>
                        <MdEmail style={{fontSize: '1rem', color: '#121212'}}/>
                        <Title2 cut={true} color={'#121212'}>
                            {user.email}
                        </Title2>
                      </ContentStart>
                    </ContentVertical>
                  </ContentStart>
                </Col>
              </Row>
            </CustomCard>
        </Col>
        <Col xs={12} sm={12} md={12} lg={5} xl={5}>
          <CardGeneric
            title={'Evaluaciones completadas'}
            icon={<FileDoneOutlined />}
            color={'#F99543'}
            numcard={completed}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={5} xl={5}>
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