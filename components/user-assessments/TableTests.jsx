import React, { useState, useEffect } from "react";
import {Card, Row, Col, Tooltip, Input, Tag, Grid} from "antd";
import { redirectTo, getCurrentURL } from "../../utils/constant";
import { ClearOutlined } from "@ant-design/icons";
import { valueToFilter } from "../../utils/functions";
import { useRouter } from "next/router";
import {
    BsArrowLeft,
    BsPlayCircleFill,
    BsFillSkipEndCircleFill,
    BsFillCheckCircleFill,
    BsCheckCircleFill
} from "react-icons/bs";
import { connect } from "react-redux";
import jwtEncode from "jwt-encode";
import moment from "moment";
//Components
 import {
    ContentVertical,
    Title1,
    Title2,
    CustomBtn,
    CustomProgress,
    ContentEnd,
    CustomTable,
    CustomCard,
} from "../validation/styledAssesments";
import { BtnTest, ProgressTest } from "../validation/styled";
import WebApiAssessment from "../../api/WebApiAssessment";
import { useStatistics } from "../../utils/useStatistics";
import {urlKuizBaseFront, typeHttp} from '../../config/config'

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0 && !splitDomain[0].includes('localhost') ) {
    tenant = splitDomain[0];
  }
}

// Set url Kuiz Base Front with Tenant
const urlKuizBaseFrontWithTenant = `${typeHttp}://${tenant}.${urlKuizBaseFront}`

const { useBreakpoint } = Grid;

const TableTests = ({user_profile, ...props}) => {

    const router = useRouter();
    const screens = useBreakpoint();
    moment.locale('es-mx');
    const { generalPercent } = useStatistics();
    const [lisAssessments, setListAssessments] = useState([]);
    const [listFilterAssessmets, setListFilterAssessmets] = useState([]);
    const [nameAssessment, setNameAssessment] = useState('');
    const [loadingAssessments, setLoadingAssessments] = useState(true);

    useEffect(() => {
        if(user_profile){
            getAssessments(user_profile.id)
        }
    }, [user_profile]);

    const getAssessments = async (id) =>{
        let data = {person: id}
        WebApiAssessment.getAssessmentsByPerson(data)
        .then((response) => {
            setListAssessments(response.data)
            setListFilterAssessmets(response.data)
            setLoadingAssessments(false)
        })
        .catch((error) => {
            console.log(error);
            setLoadingAssessments(false)
        });
    }

    const getFieldDate = (item) =>{
        let endDate = item?.apply[0]?.end_date;
        let applyDate = item?.apply[0]?.apply_date;
        let selectDate = endDate ? endDate : applyDate;
        return moment(selectDate).format('DD/MM/YYYY hh:mm a');
    }

    const startAssessment = (item) =>{
        const data = {
            assessment: item.id,
            user_id: user_profile.id,
            email: user_profile.email ? user_profile.email : user_profile.jwt_data.email,
            firstname: user_profile.first_name,
            lastname: user_profile.flast_name,
            mlastname: user_profile.mlast_name ? user_profile.mlast_name : 'N/A',
            company_id: user_profile.node,
            is_psychometric: true,
            url: getCurrentURL(),
            version: 'khorplus',
        }
        const token = jwtEncode(data, 'secret', 'HS256');
        const url = `${urlKuizBaseFrontWithTenant}/?token=${token}`;
        // const url = `http://humand.localhost:3000/?token=${token}`;
        redirectTo(url)
    }

    const onFilter = ({target}) => {
        setNameAssessment(target.value)
        if((target.value).trim()){
            let results = listFilterAssessmets.filter((item)=> valueToFilter(item.name).includes(valueToFilter(target.value)));
            setListAssessments(results)
        }else{
            setListAssessments(listFilterAssessmets)
        }
    }

    const onReset = () =>{
        setNameAssessment('');
        setListAssessments(listFilterAssessmets);
    }

    const columns = [
        {
            title: 'NOMBRE',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'FECHA',
            render: (item) =>{
                return(
                    <>
                        { (
                            item?.apply[0]?.progress == 100 ||
                            item?.apply[0]?.status == 2
                        ) ? (
                           <span>{getFieldDate(item)}</span>
                        ) : (
                            item?.apply[0]?.progress > 0
                        ) ? (
                            <Tag color={'green'}>En curso</Tag>
                        ) :(
                            <Tag color={'red'}>Pendiente</Tag>
                        )}
                    </>
                )
            }
        },
        {
            title: 'AVANCE',
            render: (item)=>{
                return(
                    <span>{item?.apply[0]?.progress ?? 0}%</span>
                )
            }
        },
        {
            title: 'ACCIONES',
            render: (item)=>{
                return(
                   <>
                    {(
                        item?.apply[0]?.progress == 100 ||
                        item?.apply[0]?.status == 2
                    ) ? (
            /*           <div
                            style={{background:'#F99543', maxWidth:150, borderRadius:10, textAlign:'center', color:'white' }}
                        >
                            Completado
                        </div>*/

                        <BtnTest
                            size={'small'}
                            bg={'#F99543!important'}
                            wd={'150px'}
                            scale={false}
                            icon={<BsCheckCircleFill/>}
                            cursor={'auto'}
                        >
                            Completado
                        </BtnTest>
                    ):(
                        <BtnTest
                            size={'small'}
                            bg={'#814cf2'}
                            wd={'150px'}
                            onClick={()=>startAssessment(item)}
                            icon={<BsPlayCircleFill/>}
                        >
                            {item?.apply[0]?.progress > 0 ? (
                                <span>Continuar prueba</span>
                            ):(
                                <span>Iniciar prueba</span>
                            )}
                        </BtnTest>
                    )}
                   </>
                )
            }
        }
    ]

    return(
        <Row gutter={[24,24]} align={'middle'}>
            <Col
                xs={24}
                md={12}
                lg={12}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <Input
                    placeholder={'Buscar por nombre'}
                    style={{borderRadius: '12px'}}
                    value={nameAssessment}
                    onChange={onFilter}
                />
                <Tooltip title={'Borrar filtros'}>
                    <CustomBtn
                        wd={'50px'}
                        icon={<ClearOutlined/>}
                        onClick={()=> onReset()}
                    />
                </Tooltip>
            </Col>
            <Col xs={24} md={12} lg={12}>
                <CustomProgress percent={generalPercent} bg1={"#F99543"} />
            </Col>
            <Col span={24}>
                <CustomTable
                    rowKey={'id'}
                    showHeader={false}
                    columns={columns}
                    loading={loadingAssessments}
                    dataSource={lisAssessments}
                    pagination={{
                        pageSize: 10,
                        total: lisAssessments?.length,
                        hideOnSinglePage: true
                    }}
                    scroll={{x: 600}}
                    locale={{emptyText:"Sin evaluciones asignadas"}}
                />
            </Col>
        </Row>

    )
}

const mapState = (state) => {
    return {
        user_profile: state.userStore.user,
    }
}

export default connect(mapState)(TableTests);