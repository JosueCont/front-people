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
    Avatar,
    Empty
} from "antd";
import { useSelector } from "react-redux";
import {injectIntl, FormattedMessage} from "react-intl";
import {
    ReloadOutlined,
    ManOutlined,
    WomanOutlined,
    RobotOutlined
} from "@ant-design/icons";
import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {withAuthSync} from "../../libs/auth";
import webApi from "../../api/webApi";
import {useRouter} from "next/router";
import moment from 'moment'
import _ from 'lodash'
import ChartDoughnut from "../../components/dashboards-cards/ChartDoughnut";
import ButtonChangeLang from "../../components/ButtonChangeLang/ButtonChangeLang";
moment.locale("es-Mx");

const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({gap}) => gap ? `${gap}px` : '8px'};
`;

const ContentCards = styled.div`
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    grid-auto-rows: 165px;
    grid-auto-flow: dense;
`;

const CardInfo = styled(ContentVertical)`
    border-radius: 10px;
    grid-row: span 2;
`;

const CardItem = styled(Card)`
    height: ${({hg}) => hg ? hg : '50%'};
    & .ant-card-extra{
        padding: 0px;
        font-size: 16px;
        font-weight: 600;
    }
    & .ant-card-head-title{
        display: flex;
        align-items: center;
        padding: 8px 0px;
        & p {
            margin-bottom: 0px;
            color: rgba(0,0,0,0.85);
            font-weight: 600;
            font-size: 18px;
        }
        & img{
            width: auto;
            height: 32px;
            margin-inline-end: 8px;
        }
    }
    & .ant-card-body{
        display: flex;
        justify-content: ${({jc}) => jc ? jc : 'flex-start'};
        align-items: ${({ai}) => ai ? ai : 'center'};
        flex-direction: ${({fd}) => fd ? fd : 'row'};
        padding: ${({pd}) => pd ? pd : '8px 24px'};
        height: calc(100% - 49px);
        max-height: calc(100% - 49px);
    }
    & .card-load{
        margin: auto;
        font-size: 2rem;
        color: rgba(0,0,0,0.3)
    }
`;

const CardScroll = styled.div`
    max-height: 100%;
    overflow-y: auto;
    width: 100%;
`;

const { Title } = Typography;


const TOTAL_PEOPLE_IN_NODE = "TOTAL_PEOPLE_IN_NODE";
const ANNIVERSARY_CURRENT_MONTH = "ANNIVERSARY_CURRENT_MONTH";
const BIRTHDAY_CURRENT_MONTH = "BIRTHDAY_CURRENT_MONTH";
const PEOPLE_BY_GENDER = "PEOPLE_BY_GENDER";
const PEOPLE_BY_GENERATION = "PEOPLE_BY_GENERATION";

const Dashboard = ({intl, ...props}) => {


    const router = useRouter();
    const [node, setNode] = useState(null)
    const [totalPerson, setTotalPersons] = useState(null)
    const [aniversaryPeople, setAniversaryPeople] = useState(null)
    const [birthDayPeople, setBirthDayPeople] = useState(null)
    const [peopleByGender, setPeopleByGender] = useState(null)
    const [peopleByGenenation, setPeopleByGeneration] = useState(null)
    const [maximunGeneration, setMaximunGeneration] = useState(null)
    const company = useSelector(state => state.userStore.current_node);

    useEffect(()=>{
        if(node){
            getDashboardWidget(TOTAL_PEOPLE_IN_NODE, `?widget_code=${TOTAL_PEOPLE_IN_NODE}&node_id=${node}`)
            getDashboardWidget(ANNIVERSARY_CURRENT_MONTH, `?widget_code=${ANNIVERSARY_CURRENT_MONTH}&node_id=${node}`)
            getDashboardWidget(BIRTHDAY_CURRENT_MONTH, `?widget_code=${BIRTHDAY_CURRENT_MONTH}&node_id=${node}`)
            getDashboardWidget(PEOPLE_BY_GENDER, `?widget_code=${PEOPLE_BY_GENDER}&node_id=${node}`)
            getDashboardWidget(PEOPLE_BY_GENERATION, `?widget_code=${PEOPLE_BY_GENERATION}&node_id=${node}`)
        }
    },[node])

    useEffect(()=>{
       let dataNode = localStorage.getItem('data')
        if(dataNode){
            setNode(dataNode)
        }
    },[])

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />}/>
    )


    const WidgetTotalPeople=()=>{
        return (
            <CardItem
                title={<>
                    <img src='/images/people.png'/>
                    <p><FormattedMessage id={'dashboard.totalpeople'}/></p>
                </>}
                extra={<a onClick={()=> router.push(`/home/persons/`)}><FormattedMessage id={'view'}/></a>}
            >
                { totalPerson
                    ? <Title
                        style={{cursor:'pointer', marginBottom: 0}}
                        onClick={()=>router.push(`/home/persons/`)}
                        level={1}>
                    {totalPerson}
                    </Title> : <ReloadOutlined className="card-load" spin />
                }
            </CardItem> 
        )
    }

    const WidgetAniversaryPeople=()=>{
        return (
            <CardInfo>
                <CardItem jc='center' hg='100%' pd='16px 0px'
                    ai={aniversaryPeople?.length > 0 ? 'flex-start' : 'center'}
                    title={<>
                        <img src='/images/newyearparty.png'/>
                        <p><FormattedMessage id={'dashboard.anniversary'}/></p>
                    </>}
                    extra={<>{aniversaryPeople?.length ?? 0}</>}
                >
                    {aniversaryPeople ?
                        <CardScroll className="scroll-bar">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={aniversaryPeople}
                                locale={{emptyText: Void}}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar size='large' src={item?.photo_thumbnail ? item?.photo_thumbnail : '/images/profile-sq.jpg'}/>}
                                            title={<a onClick={()=> router.push(`/home/persons/${item.id}`)}>{`${item.first_name} ${item.flast_name} ${item?.mlast_name}`}</a>}
                                            description={`${intl.formatMessage({id:'aniversary'})}: ${moment(item.date_of_admission).format('DD/MM/YYYY')}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </CardScroll>  : <ReloadOutlined className="card-load" spin />
                    }
                </CardItem>
            </CardInfo>
        )
    }

    const WidgetBirthDayPeople=()=>{
        return (
           <CardInfo>
                <CardItem jc='center' hg='100%' pd='16px 0px'
                    ai={birthDayPeople?.length > 0 ? 'flex-start' : 'center'}
                    title={<>
                        <img src='/images/ballon.png'/>
                        <p><FormattedMessage id={'dashboard.birthdaymonth'}/></p>
                    </>}
                    extra={<>{birthDayPeople?.length ?? 0}</>}
                >
                    {birthDayPeople ?
                        <CardScroll className="scroll-bar">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={birthDayPeople}
                                locale={{emptyText: Void}}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar size='large' src={item?.photo_thumbnail ? item?.photo_thumbnail : '/images/profile-sq.jpg'}/>}
                                            title={<a onClick={()=> router.push(`/home/persons/${item.id}`)}>{`${item.first_name} ${item.flast_name} ${item?.mlast_name}`}</a>}
                                            description={`Fecha de cumpleaños: ${moment(item.birth_date).format('DD/MM/YYYY')}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </CardScroll>
                    : <ReloadOutlined className="card-load" spin />
                    }
                </CardItem>
           </CardInfo>
        )
    }

    const WidgetGeneracionalPeople=()=>{

        const dataWidget = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1,
                },
            ],
            };

        return (
            <CardInfo>
                <CardItem jc='center' hg='100%' title={<>
                    <img src='/images/people.png'/>
                    <p><FormattedMessage id={'generations'} /></p>
                </>}>
                    {peopleByGenenation ? <div className="card-chart">
                           {peopleByGenenation.data?.some(item => item > 0) ? (
                                <>
                                    <ChartDoughnut data={peopleByGenenation} />
                                    <p style={{marginBottom: 0, marginTop: 24, textAlign: 'center'}}>
                                        <FormattedMessage id={'dashboard.predominant'}/> : {maximunGeneration}
                                    </p>
                                </>
                           ): Void }
                        </div>  : <ReloadOutlined className="card-load"  spin />
                    }
                </CardItem>
            </CardInfo>
        )
    }


    const WidgetPeopleByGender=()=>{
        return (
            <CardItem title={<>
                <img src='/images/bygender.png'/>
                <p><FormattedMessage id={'gender'}/></p>
            </>}>
                {peopleByGender ?
                    <>
                        <Statistic
                            style={{marginInlineEnd: 24}}
                            prefix={<ManOutlined style={{color:'#2351FC'}} />}
                            title={<FormattedMessage id={'male'}/>}
                            value={peopleByGender['Masculino']}
                        />
                        <Statistic
                            style={{marginInlineEnd: 24}}
                            prefix={<WomanOutlined 
                            style={{color:'#EC23FC'}}/>}
                            title={<FormattedMessage id={'female'}/>}
                            value={peopleByGender['Femenino']}
                        />
                        <Statistic title={<FormattedMessage id={'other'}/>} value={peopleByGender['Otro']} />
                    </>  : <ReloadOutlined className="card-load"  spin />
                }
            </CardItem>
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
                case PEOPLE_BY_GENERATION:
                    console.log(res.data)
                    if(res.data){
                        let dataD = {...res.data};
                        dataD.datasets= [
                            {
                                label: '# of Votes',
                                data: res?.data?.data,
                                backgroundColor: [
                                    'rgba(208, 0, 0,1)',
                                    'rgba(255, 186, 8,1)',
                                    'rgba(63, 136, 197,1)',
                                    'rgb(196,9,203)',
                                    'rgba(19, 111, 99,1)',
                                    'rgb(105,199,16)',
                                ]
                            }
                        ]
                        if(dataD?.data){
                            // conseguimos cual se repite mas
                            let maximo = _.max(dataD.data);
                            let maxIdx = dataD.data.findIndex((ele)=> ele===maximo)
                            setMaximunGeneration(dataD?.labels[maxIdx])
                        }
                        console.log(dataD.data)
                        setPeopleByGeneration(dataD)
                    }else{
                        setPeopleByGeneration(null)
                    }



                    break;
                default:
                    break;

            }
        }catch (e){
            console.log(e)

        }
    }

    return (
        <>

            <MainLayout currentKey={["dashboard"]}>
                <ContentVertical>
                    <div>
                        <Title style={{marginBottom:0}} level={1}>{company && company.name}</Title>
                        <p style={{marginBottom: 0}}>{moment().format('LLL')}</p>
                        {/*<ButtonChangeLang/>*/}
                    </div>
                    <ContentCards>
                        <CardInfo gap={24}>
                            <WidgetTotalPeople/>
                            <WidgetPeopleByGender/>
                        </CardInfo>
                        <WidgetAniversaryPeople/>
                        <WidgetGeneracionalPeople/>
                        <WidgetBirthDayPeople/>
                    </ContentCards>
                </ContentVertical>
            </MainLayout>
        </>
    )
}

export default injectIntl(withAuthSync(Dashboard));