import React, { useEffect, useState } from 'react';
import MainLayout from '../../layout/MainLayout_user'
import {Breadcrumb, Card, Button, Row, Col, List, Avatar, Typography, Tooltip, Divider} from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../libs/auth';
import { useRouter } from 'next/router';
import CardApps from "../../components/dashboards-cards/CardApp";

import {
    LinkOutlined,
    FileTextOutlined, ReloadOutlined, FileTextTwoTone, FilePdfTwoTone
} from '@ant-design/icons';
import moment from "moment";
import webApi from "../../api/webApi";
import WebApiPayroll from "../../api/WebApiPayroll";
import _ from "lodash";
import {downLoadFileBlob, getDomain} from "../../utils/functions";
import {API_URL_TENANT} from "../../config/config";

const BIRTHDAY_CURRENT_MONTH = "BIRTHDAY_CURRENT_MONTH";
moment.locale("es");
const { Title } = Typography;
const index = ({
    currentNode,
    user,
    applications
}) => {


    const router = useRouter();
    const [birthDayPeople, setBirthDayPeople] = useState(null)
    const [itsMyBirthDay, setItsMyBirthDay] = useState(false)
    const [vouchers,setVouchers] = useState(null)


    useEffect(()=>{
        if(currentNode?.id){
            getDashboardWidget(BIRTHDAY_CURRENT_MONTH, `?widget_code=${BIRTHDAY_CURRENT_MONTH}&node_id=${currentNode?.id}`)
            if (applications && (_.has(applications, "payroll") && applications["payroll"].active)) {
                getCfdiPayrrol()
            }

        }
    },[currentNode])

    const getCfdiPayrrol=async()=>{
        try{
          const res = await WebApiPayroll.getCfdiPayrrol(`node=${currentNode?.id}&person=${user?.id}`)
            setVouchers(res?.data?.results)
          console.log(res?.data?.results)
        }catch (e){
          setVouchers(null)
        }
    }


    const getDashboardWidget= async(widget,params)=>{
        try{
            const res = await webApi.getDashboardDataWidget(widget,params)
            switch (widget){
                case BIRTHDAY_CURRENT_MONTH:
                    setBirthDayPeople(res?.data?.data)
                    break;
                default:
                    break;
            }
            console.log(res)
        }catch (e){
            console.log(e)

        }
    }


    const downLoadFile = (item, file) => {
        let data = {
            type_request: 3,
            type_file: file,
            id_facturama: item.id_facturama,
        };
        let url = `${getDomain(
            API_URL_TENANT
        )}/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`;

        downLoadFileBlob(
            url,
            `${item.payroll_person.person.rfc}_${item.payment_period.start_date}_${
                item.payment_period.end_date
            }.${file == 1 ? "xml" : "pdf"}`,
            "POST",
            data
        );
    };


    const WidgetPayrollVoucher=()=>{
        return (
            <Card
                title={
                    <span>
                    <img src={'/images/voucher.png'} width={40} style={{marginRight:10}}/>
                   Mis recibos de nómina
                </span>
                }
                style={{
                    width: '100%',
                    minHeight:185
                }}
            >
                {
                    vouchers ?<div>
                        <List
                            itemLayout="horizontal"
                            dataSource={vouchers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item?.photo_thumbnail ? <Avatar src={item?.photo_thumbnail  } />: null}
                                        title={<span>Fecha de pago: {item?.pay_date}</span>}
                                        description={
                                        <div>

                                            {item.id_facturama ? (
                                                <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                                                    <FileTextTwoTone
                                                        onClick={() => downLoadFile(item, 1)}
                                                        style={{ fontSize: "25px" }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                item.xml_file && (
                                                    <a href={item.xml_file} target="_blank" download>
                                                        <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                                                            <FileTextTwoTone style={{ fontSize: "25px" }} />
                                                        </Tooltip>
                                                    </a>
                                                )
                                            )}

                                            {item.id_facturama ? (
                                                <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                                                    <FilePdfTwoTone
                                                        onClick={() => downLoadFile(item, 2)}
                                                        style={{ fontSize: "25px" }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                item.pdf_file && (
                                                    <a href={item.pdf_file} target="_blank" download>
                                                        <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                                                            <FilePdfTwoTone style={{ fontSize: "25px" }} />
                                                        </Tooltip>
                                                    </a>
                                                )
                                            )}

                                            <Divider/>
                                        </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                        {/*<Button>Ver todos</Button>*/}
                    </div>  : <ReloadOutlined  spin />
                }
            </Card>
        )
    }

    const WidgetBirthDayPeople=()=>{
        return (
            <Card
                title={
                    <span>
                    <img src={'/images/ballon.png'} width={35} style={{marginRight:10}}/>
                    Cumpleañeros del mes
                </span>
                }
                style={{
                    width: '100%',
                    minHeight:185
                }}
            >
                {
                    birthDayPeople ?<div>
                        <List
                            itemLayout="horizontal"
                            dataSource={birthDayPeople}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item?.photo_thumbnail ? <Avatar src={item?.photo_thumbnail  } size={'large'} />: null}
                                        title={<p >{`${item.first_name?item.first_name:''} ${item.flast_name?item.flast_name:''} ${item?.mlast_name?item?.mlast_name:''}`}</p>}
                                        description={`Fecha de cumpleaños: ${moment(item.birth_date).format('DD/MM/YYYY')}`}
                                    />
                                </List.Item>
                            )}
                        />
                        {/*<Button>Ver todos</Button>*/}
                    </div>  : <ReloadOutlined  spin />
                }
            </Card>
        )
    }


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
        <MainLayout currentKey={'dashboard'} defaultOpenKeys={["dashboard",'dashboard']}>
            <Row style={{marginTop:50}}>
                <Col>
                    <Title style={{marginBottom:0}} level={1}>{currentNode && currentNode.name}
                    </Title>
                    <p>{moment().format('LLL')}</p>

                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginBottom:50}}>
                <Col lg={8} md={12} sm={12} xs={24}>
                    <WidgetBirthDayPeople/>
                </Col>

                {
                    vouchers &&
                    <Col lg={8} md={12} sm={12} xs={24}>
                        <WidgetPayrollVoucher/>
                    </Col>
                }

            </Row>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore?.current_node,
        user: state.userStore?.user,
        applications: state.userStore.applications,
    }
}

export default connect(mapState)(withAuthSync(index));