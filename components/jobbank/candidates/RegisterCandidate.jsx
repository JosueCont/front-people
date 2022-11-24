import React, { useEffect, useState } from 'react';
import {Row, Col, Tabs } from 'antd';
import TabGeneral from './TabGeneral';
import TabSchool from './TabSchool';
import TabExperience from './TabExperience';
import TabPositions from './TabPositions';
import { useRouter } from 'next/router';

const RegisterCandidate = () => {

    const router = useRouter();
    const [disableTab, setDisabledTab] = useState(true);

    const getAction = () => router.query?.id ? 'edit' : 'add';

    return (
        <Row gutter={[0,24]} style={{width: '70%'}}>
            <Col span={24} className='content-center'>
                <p style={{
                    marginBottom: 0,
                    fontSize: '1.25rem',
                    fontWeight: 700
                }}>
                    { router.query?.id
                        ? <span>Información del candidato</span>
                        : <span>Registrar nuevo candidato</span>
                    }
                </p>
            </Col>
            <Col span={24}>
                <div className='tabs-vacancies' style={{background: '#ffff', padding: 24, borderRadius: 10}}>
                    <Tabs type='card'>
                        <Tabs.TabPane key='1' tab='Datos generales'>
                            <TabGeneral
                                isAutoRegister={true}
                                action={getAction()}
                                setDisabledTab={setDisabledTab}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane forceRender key='2' disabled={disableTab} tab='Eduación'>
                            <TabSchool action={getAction()}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane forceRender key='3' disabled={disableTab} tab='Experiencia y especialización'>
                            <TabExperience action={getAction()}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane forceRender key='4' disabled={disableTab} tab='Últimas posiciones'>
                            <TabPositions action={getAction()}/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Col>
        </Row>
    )
}

export default RegisterCandidate;