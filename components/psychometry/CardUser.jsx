import React, {useState, useEffect} from 'react';
import { FileDoneOutlined, FileSyncOutlined } from "@ant-design/icons";
import { Card, Row, Col, Avatar, Button}  from 'antd';
import { connect } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { SiMinutemailer } from 'react-icons/si';

//Components
import CardGeneric from '../dashboards-cards/CardGeneric';
import {
  ContentStart,
  ContentVertical,
  ContentButtons,
  ContentDescription,
  ContentEnd,
  CustomBtn
} from './Styled';

const CardUser = ({
  user_profile,
  user_assessments,
  loading,
  ...props}) => {

  const [user, setUser] = useState({});
  const [toAnswer, setToAnswer] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(()=>{
      setValues()
  },[user_profile])

  useEffect(()=>{
    if(user_assessments.length > 0){
      calculateIndicators()
    }
  },[user_assessments])

  const setValues = () =>{
    if(Object.keys(user_profile).length > 0){
      setUser({
          fullName: `${user_profile.first_name} ${user_profile.flast_name} ${user_profile.mlast_name ? user_profile.mlast_name : ''}`,
          photo: user_profile.photo ? user_profile.photo : '/images/usuario.png',
          email: user_profile.email
      })
    }
  }

  const calculateIndicators = () => {
    let toAnswer = 0;
    let completed = 0;
    user_assessments.map((item)=> {
      console.log("item---",item)
      let isArray = true
      if (Array.isArray(item.apply)) {
        isArray = true
        console.log("ARRAY---")
      } else {
        console.log("OBJETO---")
        isArray = false
      }
      if (isArray ? item.apply[0] : item.apply){
        if(
          isArray ? 
          item.apply[0].progress == 100 ||
          item.apply[0].status == 2 :
          item.apply.progress == 100 ||
          item.apply.status == 2
        ){
          completed = completed + 1;
        }else{
          toAnswer = toAnswer + 1;
        }
      }else{
        toAnswer = toAnswer + 1;
      }
    })
    setToAnswer(toAnswer)
    setCompleted(completed)
  }

  return (
    <Row gutter={[24,24]} align={'middle'}>
        <Col xs={24} sm={24} md={24} lg={14} xl={16}>
            <Card loading={loading} bordered={false} style={{background: '#814cf2', borderRadius: '12px'}}>
              <Row gutter={[16,24]} align='middle'>
                <Col xs={24} sm={16} md={18} lg={16} xl={19}>
                  <ContentStart gap={'16px'}>
                    <Avatar
                        shape={'circle'}
                        size={62}
                        src={user.photo}
                    />
                    <ContentVertical gap={'0px'}>
                      <ContentDescription>
                        <p><FaUser/></p>
                        <p>{user.fullName}</p>
                      </ContentDescription>
                      <ContentDescription>
                        <p><MdEmail/></p>
                        <p>{user.email}</p>
                      </ContentDescription>
                    </ContentVertical>
                  </ContentStart>
                </Col>
                <Col xs={24} sm={8} md={6} lg={8} xl={5}>
                  <ContentEnd>
                    <ContentButtons gap={'8px'}>
                      {/*<CustomBtn bg={'white'} cl={'black'} wd={'auto'}>*/}
                      {/*  <span>Enviar permalink</span><AiOutlineLink/>*/}
                      {/*</CustomBtn>*/}
                      {/*<CustomBtn bg={'#ed6432'} wd={'auto'}>*/}
                      {/*  <span>Enviar email</span><SiMinutemailer/>*/}
                      {/*</CustomBtn>*/}
                    </ContentButtons>
                  </ContentEnd>
                </Col>
              </Row>
            </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={5} xl={4}>
          <CardGeneric
            title={'Evaluaciones completadas'}
            icon={<FileDoneOutlined />}
            color={'#ec6532'}
            numcard={completed}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={5} xl={4}>
          <CardGeneric
            title={'Evaluaciones por contestar'}
            icon={<FileSyncOutlined />}
            color={'#1c1a28'}
            numcard={toAnswer}
          />
        </Col>
    </Row>
  )
}

export default CardUser;