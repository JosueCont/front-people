import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {
    Row,
    Col,
    Typography,
    Card,
    Button,
    List,
    Statistic,
    Avatar
} from "antd";
import { useSelector } from "react-redux";
import {
    ReloadOutlined,
    ManOutlined,
    WomanOutlined,
    RobotOutlined
} from "@ant-design/icons";
import { css, Global } from "@emotion/core";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {withAuthSync} from "../../libs/auth";
import webApi from "../../api/webApi";
import {useRouter} from "next/router";
import moment from 'moment'
moment.locale("es");

const { Title } = Typography;


const TOTAL_PEOPLE_IN_NODE = "TOTAL_PEOPLE_IN_NODE";
const ANNIVERSARY_CURRENT_MONTH = "ANNIVERSARY_CURRENT_MONTH";
const BIRTHDAY_CURRENT_MONTH = "BIRTHDAY_CURRENT_MONTH";
const PEOPLE_BY_GENDER = "PEOPLE_BY_GENDER";

const Dashboard = () => {


    const router = useRouter();
    const [node, setNode] = useState(null)
    const [totalPerson, setTotalPersons] = useState(null)
    const [aniversaryPeople, setAniversaryPeople] = useState(null)
    const [birthDayPeople, setBirthDayPeople] = useState(null)
    const [peopleByGender, setPeopleByGender] = useState(null)
    const company = useSelector(state => state.userStore.current_node);

    useEffect(()=>{
        if(node){
            getDashboardWidget(TOTAL_PEOPLE_IN_NODE, `?widget_code=${TOTAL_PEOPLE_IN_NODE}&node_id=${node}`)
            getDashboardWidget(ANNIVERSARY_CURRENT_MONTH, `?widget_code=${ANNIVERSARY_CURRENT_MONTH}&node_id=${node}`)
            getDashboardWidget(BIRTHDAY_CURRENT_MONTH, `?widget_code=${BIRTHDAY_CURRENT_MONTH}&node_id=${node}`)
            getDashboardWidget(PEOPLE_BY_GENDER, `?widget_code=${PEOPLE_BY_GENDER}&node_id=${node}`)
        }
    },[node])

    useEffect(()=>{
       let dataNode = localStorage.getItem('data')
        if(dataNode){
            setNode(dataNode)
        }
    },[])


    const WidgetTotalPeople=()=>{
        return (
            <Card
                title={
                    <span>
                    <img src={'/images/people.png'} width={40} style={{marginRight:10}}/>
                    Total de personas
                </span>
                }
                extra={<a onClick={()=> router.push(`/home/persons/`)}>Ver</a>}
                style={{
                    width: '100%',
                    minHeight:185
                }}
            >
                {
                    totalPerson ? <Title style={{cursor:'pointer'}} onClick={()=>router.push(`/home/persons/`) } level={1}>{totalPerson}</Title> : <ReloadOutlined  spin />
                }
            </Card>
        )
    }

    const WidgetAniversaryPeople=()=>{
        return (
            <Card
                title={
                    <span>
                    <img src={'/images/newyearparty.png'} width={40} style={{marginRight:10}}/>
                    Aniversarios
                </span>
                }
                style={{
                    width: '100%',
                    minHeight:185
                }}
            >
                {
                    aniversaryPeople ?<div>
                        <List
                            itemLayout="horizontal"
                            dataSource={aniversaryPeople}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item?.photo_thumbnail ? <Avatar src={item?.photo_thumbnail  } />: null}
                                        title={<a onClick={()=> router.push(`/home/persons/${item.id}`)}>{`${item.first_name} ${item.flast_name} ${item?.mlast_name}`}</a>}
                                        description={`Aniversario: ${moment(item.date_of_admission).format('DD/MM/YYYY')}`}
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
                    <img src={'/images/boxparty.png'} width={35} style={{marginRight:10}}/>
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
                                        avatar={item?.photo_thumbnail ? <Avatar src={item?.photo_thumbnail  } />: null}
                                        title={<a onClick={()=> router.push(`/home/persons/${item.id}`)}>{`${item.first_name} ${item.flast_name} ${item?.mlast_name}`}</a>}
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

    const WidgetPeopleByGender=()=>{
        return (
            <Card
                title={
                    <span>
                    <img src={'/images/bygender.png'} width={40} style={{marginRight:10}}/>
                    Por género
                </span>
                }
                style={{
                    width: '100%',
                    minHeight:185
                }}
            >
                {
                    peopleByGender ?
                        <Row gutter={16}>
                       <Col span={8}>
                           <Statistic prefix={<ManOutlined style={{color:'#2351FC'}}  />} title="Masculino" value={peopleByGender['Masculino']} />
                       </Col>
                        <Col span={8}>
                            <Statistic prefix={<WomanOutlined  style={{color:'#EC23FC'}}   />} title="Femenino" value={peopleByGender['Femenino']} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Otro" value={peopleByGender['Otro']} />
                        </Col>


                        {/*<Button>Ver todos</Button>*/}
                    </Row>  : <ReloadOutlined  spin />
                }
            </Card>
        )
    }

    const getDashboardWidget= async(widget,params)=>{
        try{
            const res = await webApi.getDashboardDataWidget(widget,params)
            switch (widget){
                case TOTAL_PEOPLE_IN_NODE:
                    setTotalPersons(res?.data?.count)
                    break;
                case ANNIVERSARY_CURRENT_MONTH:
                    setAniversaryPeople(res?.data?.data)
                    break;
                case BIRTHDAY_CURRENT_MONTH:
                    setBirthDayPeople(res?.data?.data)
                    break;
                case PEOPLE_BY_GENDER:
                    setPeopleByGender(res?.data?.data)
                    break;
                default:
                    break;

            }
            console.log(res)
        }catch (e){
            console.log(e)

        }
    }

    return (
        <>

            <Global
                styles={css`
                .div-main-layout{
                    padding-left: 30px !important;
                    padding-right: 0px !important;
                    padding-top: 0px !important;
                }
            `}
            />

            <MainLayout currentKey={["dashboard"]}>
                <Row style={{marginTop:50}}>
                    <Col>
                        <Title style={{marginBottom:0}} level={1}>{company && company.name}</Title>
                        <p>{moment().format('LLL')}</p>
                    </Col>
                </Row>
                <Row gutter={[16]} style={{marginBottom:50}}>
                    <Col md={8} sm={12}>
                        <WidgetTotalPeople/>
                        <br/>
                        <WidgetPeopleByGender/>
                    </Col>
                    <Col md={8} sm={12}>
                        <WidgetAniversaryPeople/>
                    </Col>
                    <Col md={8} sm={12}>
                        <WidgetBirthDayPeople/>
                    </Col>
                </Row>
            </MainLayout>
        </>
    )
}

export default withAuthSync(Dashboard);