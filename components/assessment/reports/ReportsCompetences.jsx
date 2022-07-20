import React, {useState, useEffect} from 'react';
import {
    Select,
    Form,
    Col,
    Row,
    Table,
    Avatar,
    Radio,
    Button,
    Tooltip,
    message
} from 'antd';
import { connect } from 'react-redux';
import {
    CloseOutlined,
    UserOutlined,
    ProfileOutlined
} from "@ant-design/icons";
import ViewList from './ViewList';
import {
    getFullName,
    getPhoto,
    getWork
} from '../../../utils/functions';

const ReportsCompetences = ({
    competences,
    load_competences,
    persons_company,
    load_persons,
    ...props
}) => {

    const columns_many = [
        {
            title: 'Persona',
            fixed: 'left',
            width: 200,
            show: true,
            ellipsis: true,
            render: (record) =>{
                return (
                    <span>{getFullName(record)}</span>
                )
            }
        },
        {
            title: 'Competencias',
            show: false,
            render: ({competences})=>{
                return (
                    <span>{competences?.length}</span>
                )
            }
        },
    ]

    const options = [
        {key: true, value: true, label: 'Sí'},
        {key: false, value: false, label: 'No'}
    ]

    const [usersSelected, setUsersSelected] = useState([]);
    const [competencesSelected, setCompetencesSelected] = useState([]);
    const [listReports, setListReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInvidual, setIsIndividual] = useState(true);
    const [openModal, setOpenModal] = useState();
    const [isUsers, setIsUsers] = useState(false);
    const [columnsMany, setColumnsMany] = useState(columns_many);

    // useEffect(()=>{
    //     console.log('competencias------->', persons_company)
    // },[persons_company])

    const getOptionsPersons = () =>{
        let options = [];
        if(persons_company.length > 0){
            persons_company.map(item =>{
                let exist = usersSelected.some(record => record.id === item.id);
                if(!exist){
                    options.push({
                        key: item.id,
                        value: item.id,
                        label: getFullName(item)
                    })
                }
            })
        }
        return options;
    }

    const getOptionsCompetences = () =>{
        let options = [];
        if(competences.length > 0){
            competences.map(item => {
                let exist = competencesSelected.some(record => record.id === item.id)
                if(!exist){
                    options.push({
                        key: item.id,
                        value: item.id,
                        label: item.name
                    })
                }
            })
        }
        return options;
    }

    const sendUser = (value) =>{
        let exists = usersSelected.some(item => item.id === value);
        if(!exists){
            let user = persons_company.find(item => item.id === value);
            if(!isInvidual){
                let list = [...usersSelected, user];
                setUsersSelected(list);
            }else{
                setUsersSelected([user]);
            }
        }
    }

    const sendCompetence = (value) =>{
        let exists = competencesSelected.some(item => item.id === value);
        if(!exists){
            let competence = competences.find(item => item.id == value);
            let list = [...competencesSelected, competence];
            setCompetencesSelected(list);
        }
    }

    const onChangeType = ({target : {value}}) => {
        setIsIndividual(value)
        setUsersSelected([])
        setCompetencesSelected([])
        setListReport([])
        setColumnsMany(columns_many)
        // if(value){
        //     let user = usersSelected.length > 0 ? usersSelected.at(-1) : {};
        //     let setUser = Object.keys(user).length > 0 ? [user] : [];
        //     setUsersSelected(setUser)
        //     setCompetencesSelected([])
        // }
    }

    const validateParameters = () =>{
        if(isInvidual && usersSelected.length <= 0){
            message.error('Selecciona un usuario');
        }else if(!isInvidual && usersSelected.length <=0){
            message.error('Selecciona los usuarios');
        }else if(!isInvidual && competencesSelected.length <=0){
            message.error('Selecciona las competencias');
        }else{
            validateReport()
        }
    }

    const validateReport = () =>{
        if(isInvidual){
            getReportInvidual()
        }else{
            getReportMany()
            generateColumns()
        }
    }

    const getReportInvidual = () =>{
        setLoading(true)
        let data = [
            {
                "id": "272143bb7e0844c38c4f8dac331eae75",
                "name": "ADAPTABILIDAD",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                "level": "1",

            },
            {
                "id": "bf193cada3e24ebca715db79951cc8dc",
                "name": "ANÁLISIS DE PROBLEMAS",
                "description":  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                "level": "2"
            },
            {
                "id": "189ef8c8883346c696fa6eecebea9d89",
                "name": "ANÁLISIS NUMÉRICO",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                "level": "3"
            }
        ]
        setTimeout(()=>{
            setListReport(data)
            setLoading(false)
        },3000)
    }

    const getReportMany = () =>{
        setLoading(true)
        let result = usersSelected.map((item, index) => {
            let competences = competencesSelected.map((record, idx) =>{
                return {...record, level: (index+idx)}
            })
            return {
                ...item,
                competences: competences,
                compatibility: (100/(index+1))
            }
        })
        setTimeout(()=>{
            setListReport(result)
            setLoading(false)
        },3000)
    }

    const generateColumns = () =>{
        let list = [...columns_many];
        competencesSelected.map((item, idx) =>{
            list.push({
                title: <Tooltip title={item.name}><span>{item.name.substring(0,3)}</span></Tooltip>,
                width: 50,
                align: 'center',
                show: true,
                render: ({competences}) =>{
                    return (
                        <span>{competences[idx]?.level}</span>
                    )
                }
            })
        })
        list.push({
            title: 'Compatibilidad',
            width: 125,
            align: 'center',
            show: true,
            fixed: 'right',
            render: ({compatibility}) =>{
                return(
                    <span>{compatibility.toFixed(0)}%</span>
                )
            }
        })
        let newList = list.filter(item=> item.show);
        setColumnsMany(newList)
    }

    const modalList = (isUsers) =>{
        if(isUsers && usersSelected.length <= 0){
            message.error('Selecciona los usuarios');
        }else if(!isUsers && competencesSelected.length <= 0){
            message.error('Selecciona las competencias');
        }else{
            setIsUsers(isUsers)
            setOpenModal(true)
        }
    }

    const hideModalList = () =>{
        setIsUsers(false)
        setOpenModal(false)
    }

    const getListData = () =>{
        return isUsers ? usersSelected : competencesSelected;
    }

    const getSetListData = () =>{
        return isUsers ? setUsersSelected : setCompetencesSelected;
    }

    const getProperties = () =>{
        return isInvidual ? {
            columns: columns_individual
        } : {
            columns: columnsMany,
            scroll: { x: 1500 },
            // expandable: {
            //     expandedRowRender,
            //     defaultExpandedRowKeys: ['0']
            // }
        }
    }

    const columns_individual = [
        {
            title: 'Competencia',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
        },
    ]

    // const columns_many = [
    //     {
    //         title: 'Persona',
    //         show: true,
    //         render: (item) =>{
    //             return (
    //                 <span>{getFullName(item)}</span>
    //             )
    //         }
    //     },
    //     {
    //         title: 'Competencias',
    //         show: false,
    //         render: (item)=>{
    //             return (
    //                 <span>{item.competences?.length}</span>
    //             )
    //         }
    //     },
    // ]

    const expandedRowRender = ({competences}) =>{

        const columns = [
            {
                title: 'Competencia',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Nivel',
                dataIndex: 'level',
                key: 'level'
            },
            {
                title: 'Requerido',
                render: (item) =>{
                    return(
                        <span>3</span>
                    )
                }
            }
        ]

        return <Table
            rowKey={'id'}
            size={'small'}
            columns={columns}
            dataSource={competences}
            pagination={false}
        />
    }

    return (
        <div style={{margin: '20px'}}>
            <Row gutter={[24,24]}>
                <Col span={24} className='content_header'>
                    <div className='content_inputs'>
                        <div className='content_inputs_element'>
                            <p>Seleccionar usuario</p>
                            <Select
                                placeholder={'Seleccionar usuario'}
                                notFoundContent={'No se encontraron resultados'}
                                options={getOptionsPersons()}
                                value={null}
                                onChange={sendUser}
                                style={{width: 200}}
                            />
                        </div>
                        {!isInvidual && (
                            <div className='content_inputs_element fade_in'>
                                <p>Seleccionar competencias</p>
                                <Select
                                    placeholder={'Seleccionar competencia'}
                                    notFoundContent={'No se encontraron resultados'}
                                    options={getOptionsCompetences()}
                                    value={null}
                                    onChange={sendCompetence}
                                    style={{width: 200}}
                                />
                            </div>
                        )}
                        <Button
                            onClick={()=> validateParameters()}
                            style={{marginTop:'auto'}}
                        >
                            Generar
                        </Button>
                    </div>
                    <div className='content_inputs'>
                        {!isInvidual && (
                            <>
                                <div className='content_inputs_element fade_in'>
                                    <p>Ver listado</p>
                                    <Tooltip title='Usuarios seleccionados' placement='bottom'>
                                        <Button
                                            onClick={()=> modalList(true)}
                                            icon={<UserOutlined />}
                                        >
                                            ({usersSelected.length})
                                        </Button>
                                    </Tooltip>
                                </div>
                                <div className='content_inputs_element fade_in'>
                                    <p>Ver listado</p>
                                    <Tooltip title='Competencias seleccionadas' placement='bottom'>
                                        <Button
                                            onClick={()=> modalList(false)}
                                            icon={<ProfileOutlined />}
                                        >
                                            ({competencesSelected.length})
                                        </Button>
                                    </Tooltip>
                                </div>
                            </>
                        )}
                        <div className='content_inputs_element'>
                            <p>Reporte individual</p>
                            <Radio.Group
                                options={options}
                                onChange={onChangeType}
                                value={isInvidual}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </div>   
                    </div>
                </Col>
                {usersSelected.length > 0 && isInvidual && (
                    <Col span={24}>
                        <Row gutter={[24,24]}>
                            <Col xs={24} sm={18} md={14} lg={12} xl={10} xxl={8}>
                                <div className='info_user fade_in'>
                                    <Avatar src={getPhoto(usersSelected.at(-1))} size={80}/>
                                    <div className='info_user_text'>
                                        <p>{getFullName(usersSelected.at(-1))}</p>
                                        <p>{getWork(usersSelected.at(-1))}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                )}
                <Col span={24}>
                    <Table
                        className='items_selected'
                        {...getProperties()}
                        dataSource={listReports}
                        loading={loading}
                        rowKey={'id'}
                        size={'small'}
                        locale={{
                            emptyText: loading
                                ? "Cargando..."
                                : "No se encontraron resultados.",
                        }}
                    />
                </Col>
            </Row>
            <ViewList
                visible={openModal}
                isUsers={isUsers}
                close={hideModalList}
                listData={getListData()}
                setListData={getSetListData()}
            />
        </div>
    )
}

const mapState = (state) => {
    return {
        competences: state.assessmentStore.competences,
        load_competences: state.assessmentStore.load_competences,
        persons_company: state.userStore.persons_company,
        load_persons: state.userStore.load_persons
    };
};

export default connect(mapState)(ReportsCompetences);