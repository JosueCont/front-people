import React, {useEffect, useState} from 'react';
import { Row, Col, Breadcrumb, ConfigProvider, Select} from 'antd';
import { useRouter } from 'next/router';
import CardUser from '../../../components/psychometry/CardUser';
import TableAssessments from '../../../components/psychometry/TableAssessments';
import WebApiPeople from '../../../api/WebApiPeople';
import WebApiAssessment from '../../../api/WebApiAssessment';
import MainLayout from '../../../layout/MainInter';
import esES from "antd/lib/locale/es_ES";
import { withAuthSync } from '../../../libs/auth';
import { verifyMenuNewForTenant } from '../../../utils/functions';

const ProfileUser = () => {

    const router = useRouter();
    const { Option } = Select;
    const [person, setPerson] = useState({});
    const [assessments, setAssessments] = useState([]);
    const [copyAssessments, setCopyAssessments] = useState([]);
    const [fullName, setFullName] = useState();
    const [loadAssessment, setLoadAssessment] = useState(false);
    const [loadUser, setLoadUser] = useState(false);

    useEffect(()=>{
        if(router.query.id){
            getPerson(router.query.id);
            getAssessments(router.query.id);
        }
    },[router])

    const getPerson = async (id) =>{
        setLoadUser(true)
        try {
            let response = await WebApiPeople.getPerson(id);
            let nameFull = `
                ${response.data?.first_name}
                ${response.data?.flast_name}
                ${response.data?.mlast_name ? response.data?.mlast_name : ''}
            `; 
            setFullName(nameFull)
            setPerson(response.data)
            setLoadUser(false)
        } catch (e) {
            setLoadUser(false)
            console.log(e)
        }
    }

    const getAssessments = async (id) =>{
        setLoadAssessment(true);
        try {
            let response = await WebApiAssessment.getAssessmentsByPerson({person: id});
            setAssessments(response.data);
            // setCopyAssessments(response.data);
            setLoadAssessment(false);
        } catch (e) {
            setLoadAssessment(false);
            console.log(e)
        }
    }

    return (
        <MainLayout currentKey="1">
            <ConfigProvider locale={esES}>
                <Breadcrumb>
                    <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                    {verifyMenuNewForTenant() && 
                        <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
                    }
                    <Breadcrumb.Item href='/home/persons/'>Personas</Breadcrumb.Item>
                    <Breadcrumb.Item href={`/home/profile/${person.id}`}>
                        {fullName}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="container" style={{ width: "100%" }}>
                    <Row gutter={[24,24]}>
                        <Col span={24}>
                            <CardUser
                                loading={loadUser}
                                user_profile={person}
                                user_assessments={assessments}
                            />
                        </Col>
                        <Col span={24}>
                            <TableAssessments
                                loading={loadAssessment}
                                user_profile={person}
                                user_assessments={assessments}
                                getAssessments={getAssessments}
                            />
                        </Col>
                    </Row>
                </div>
            </ConfigProvider>
        </MainLayout>
    )
}

export default withAuthSync(ProfileUser);