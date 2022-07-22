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
import { FcInfo } from "react-icons/fc";
import { getReportCompetences } from '../../../redux/assessmentDuck';

const ReportsCompetences = ({
    competences,
    load_competences,
    persons_company,
    load_persons,
    profiles,
    load_profiles,
    currentKey,
    data_report,
    load_report,
    getReportCompetences,
    ...props
}) => {

    const columns_many = [
        {
            title: 'Imagen',
            align: 'center',
            width: 100,
            show: true,
            render: (record) =>{
                return (
                    <Avatar src={getPhoto(record)}/>
                )
            }
        },
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

    const [usersSelected, setUsersSelected] = useState([]);
    const [competencesSelected, setCompetencesSelected] = useState([]);
    const [profilesSelected, setProfilesSelected] = useState([]);
    const [listReports, setListReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState();
    const [isUsers, setIsUsers] = useState(false);
    const [columnsMany, setColumnsMany] = useState(columns_many);
    const [currentTab, setCurrentTab] = useState();

    useEffect(()=>{
        if(currentTab !== currentKey){
            setCurrentTab(currentKey)
            setUsersSelected([])
            setCompetencesSelected([])
            setProfilesSelected([])
            setListReports([])
            setIsUsers(false)
            setColumnsMany(columns_many)
        }
    },[currentKey])

    useEffect(()=>{
        if(data_report.length > 0 && currentTab == currentKey){
            setListReports(data_report)
        }else{
            setListReports([])
        }
    },[data_report])

    useEffect(()=>{
        setLoading(load_report)
    },[load_report])

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

    const getOptionsProfiles = () =>{
        let options = [];
        if(profiles.results?.length > 0){
          profiles.results.map(item=>{
            let exist = profilesSelected.some(record => record.id === item.id)
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

    const sendProfile = (value) =>{
        let exist = profilesSelected.some(item => item.id === value);
        if(!exist) {
          let profile = profiles.results.find(item => item.id === value);
          if(currentTab == 'pps'){
              let list = [...profilesSelected, profile];
              setProfilesSelected(list);
          }else{
              setProfilesSelected([profile])
          }
        }
    }

    const sendUser = (value) =>{
        let exists = usersSelected.some(item => item.id === value);
        if(!exists){
            let user = persons_company.find(item => item.id === value);
            if(['psp','psc'].includes(currentTab)){
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

    // const onChangeType = ({target : {value}}) => {
    //     setIsIndividual(value)
    //     setUsersSelected([])
    //     setCompetencesSelected([])
    //     setListReport([])
    //     setColumnsMany(columns_many)
    //     if(value){
    //         let user = usersSelected.length > 0 ? usersSelected.at(-1) : {};
    //         let setUser = Object.keys(user).length > 0 ? [user] : [];
    //         setUsersSelected(setUser)
    //         setCompetencesSelected([])
    //     }
    // }

    const validateParameters = () =>{
        if(['p','pp','pps'].includes(currentTab) && usersSelected.length <= 0){
            message.error('Selecciona un usuario')
        }else if(['psp','psc'].includes(currentTab) && usersSelected.length <= 0){
            message.error('Selecciona los usuarios')
        }else if(['pp','psp','psc'].includes(currentTab) && profilesSelected.length <= 0){
            message.error('Selecciona un perfil')
        }else if(currentTab == 'pps' && profilesSelected.length <=0){
            message.error('Selecciona los perfiles')
        }else{
            validateReport()
        }
    }

    const validateReport = () =>{
        if(currentTab == 'p'){
            getReportP()
        }else if(currentTab == 'pp'){
            setLoading(true)
            getReportPP()
        }else if(currentTab == 'psp'){
            setLoading(true)
            getReportPSP()
        }else if(currentTab == 'pps'){
            setLoading(true)
            getReportPPS()
        }else{
            setLoading(true)
            generateColumns()
            getReportPSC()
        }
    }

    const getReportP = async () =>{
        let data = {
            competences: [
                "272143bb7e0844c38c4f8dac331eae75",
                "bf193cada3e24ebca715db79951cc8dc",
                "189ef8c8883346c696fa6eecebea9d89"
            ],
            users: [
                {
                    id: usersSelected.at(-1).id,
                    fullName: getFullName(usersSelected.at(-1))
                }
            ]
        }
        let resp = await getReportCompetences(data)
        if(resp) message.success('Información obtenida');
        else message.error('Información no obtenida');
    }

    const getReportPP = async () =>{
        console.log('persona-perfil')
        let data = {
            compatibility: '60%',
            competences: [
                {
                    "id": "272143bb7e0844c38c4f8dac331eae75",
                    "name": "ADAPTABILIDAD",
                    "level_person": "1",
                    "desc_level_person": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "level_profile": "2",
                    "desc_level_profile": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "compatibility": "37%" 
                    
                },
                {
                    "id": "bf193cada3e24ebca715db79951cc8dc",
                    "name": "ANÁLISIS DE PROBLEMAS",
                    "level_person": "2",
                    "desc_level_person": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "level_profile": "3",
                    "desc_level_profile": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "compatibility": "43%"
                },
                {
                    "id": "189ef8c8883346c696fa6eecebea9d89",
                    "name": "ANÁLISIS NUMÉRICO",
                    "level_person": "3",
                    "desc_level_person": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "level_profile": "2",
                    "desc_level_profile": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    "compatibility": "56%"
                }
            ]
        }
        setTimeout(()=>{
            setListReports([data])
            setLoading(false)
        },3000)
    }

    const getReportPSP = () =>{
        console.log('personas-perfil')
        let result = usersSelected.map((item, index) => {
            return {...item, compatibility: (100/(index+1))}
        })
        setTimeout(()=>{
            setListReports(result)
            setLoading(false)
        },3000)
    }

    const getReportPPS = () =>{
        console.log('persona-perfiles')
        let result = profilesSelected.map((item, index) =>{
            return {...item, compatibility: (100/(index+1))}
        })
        setTimeout(()=>{
            setListReports(result)
            setLoading(false)
        },3000)
    }

    const getReportPSC = () =>{
        console.log('persona-competencias')
        let list = [
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
        let result = usersSelected.map((item, index) => {
            let competences = list.map((record, idx) =>{
                return {...record, level: (index+idx)}
            })
            return {
                ...item,
                competences: competences,
                compatibility: (100/(index+1))
            }
        })
        setTimeout(()=>{
            setListReports(result)
            setLoading(false)
        },3000)
    }

    const generateColumns = () =>{
        let prueba = [
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
        let list = [...columns_many];
        prueba.map((item, idx) =>{
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
        }else if(!isUsers && profilesSelected.length <= 0){
            message.error('Selecciona los perfiles');
        }else{
            setIsUsers(isUsers)
            setOpenModal(true)
        }
    }

    const hideModalList = () =>{
        setIsUsers(false)
        setOpenModal(false)
    }

    const getDescProfile = ({description}) =>{
        return description ? description : 'N/A';
    }

    const getCompatibility = (item) =>{
        return item ? item.compatibility : 'Pendiente';
    }

    const getProfile = (item) =>{
        return item ? item.name : 'Pendiente';
    }

    const getListData = () =>{
        return isUsers ? usersSelected : profilesSelected;
    }

    const getSetListData = () =>{
        return isUsers ? setUsersSelected : setProfilesSelected;
    }

    const getInfoType = () =>{
        return currentTab == 'p'
            ? 'El tipo de reporte actual se trata de seleccionar solo una persona.'
            : currentTab == 'pp'
            ? 'El tipo de reporte actual se trata de seleccionar una persona vs un perfil.'
            : ['psp','psc'].includes(currentTab)
            ? 'El tipo de reporte actual se trata de seleccionar varias personas vs un perfil.'
            : currentTab == 'pps'
            && 'El tipo de reporte actual se trata de seleccionar una persona vs varios perfiles.'
    }

    const getProperties = () =>{
        if(currentTab == 'p'){
            return {
                columns: columns_p,
                rowKey: (item) => item.competence.id,
                dataSource: listReports.at(-1)?.competences
            }
        }else if(currentTab == 'pp'){
            return {
                columns: columns_pp,
                dataSource: listReports.at(-1)?.competences
            }
        }else if(currentTab == 'psp'){
            return {
                columns: columns_psp,
                dataSource: listReports
            }
        }else if(currentTab == 'pps'){
            return {
                columns: columns_pps,
                dataSource: listReports
            }
        }else{
            return {
                columns: columnsMany,
                dataSource: listReports,
                scroll: { x: 1500}
            }
        }
    }

    const columns_p = [
        {
            title: 'Competencia',
            dataIndex: ['competence','name'],
            key: ['competence','name']
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            width: 800
        },
    ]

    const columns_pp = [
        {
            title: 'Competencia',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Nivel persona',
            dataIndex: 'level_person',
            key: 'level_person'
        },
        {
            title: 'Descripción',
            dataIndex: 'desc_level_person',
            key: 'desc_level_person'
        },
        {
            title: 'Nivel perfil',
            dataIndex: 'level_profile',
            key: 'level_profile'
        },
        {
            title: 'Descripción',
            dataIndex: 'desc_level_profile',
            key: 'desc_level_profile'
        },
        {
            title: 'Compatibilidad',
            dataIndex: 'compatibility',
            key: 'compatibility'
        }
    ]

    const columns_psp = [
        {
            title: 'Imagen',
            align: 'center',
            width: 100,
            render: (record) =>{
                return (
                    <Avatar src={getPhoto(record)}/>
                )
            }
        },
        {
            title: 'Persona',
            render: (record) =>{
                return (
                    <span>{getFullName(record)}</span>
                )
            }
        },
        {
            title: 'Compatibilidad',
            render: ({compatibility}) =>{
                return(
                    <span>{compatibility.toFixed(0)}%</span>
                )
            }
        }
    ]

    const columns_pps = [
        {
            title: 'Perfil',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Compatibilidad',
            render: ({compatibility}) =>{
                return(
                    <span>{compatibility.toFixed(0)}%</span>
                )
            }
        }
    ]

    return (
        <div style={{margin: '20px'}}>
            <Row gutter={[24,24]}>
                <Col span={24} className='content_header'>
                    <div className='content_inputs'>
                        <div className='content_inputs_element'>
                            <p>
                                {['psp','psc'].includes(currentTab) ? 
                                    <span>Seleccionar usuarios</span> :
                                    <span>Selecionar usuario</span>
                                }
                            </p>
                            <Select
                                placeholder={'Seleccionar usuario'}
                                notFoundContent={'No se encontraron resultados'}
                                options={getOptionsPersons()}
                                value={null}
                                onChange={sendUser}
                                style={{width: 200}}
                            />
                        </div>
                        {['pp','psc','psp','pps'].includes(currentTab) && (
                            <div className='content_inputs_element'>
                                <p>
                                    {currentTab == 'pps' ? 
                                        <span>Seleccionar perfiles</span> :
                                        <span>Selecionar perfil</span>
                                    }
                                </p>
                                <Select
                                    placeholder={'Seleccionar perfil'}
                                    notFoundContent={'No se encontraron resultados'}
                                    options={getOptionsProfiles()}
                                    value={null}
                                    onChange={sendProfile}
                                    style={{width: 200}}
                                />
                            </div>
                        )}
                        {/* <div className='content_inputs_element fade_in'>
                            <p>Seleccionar competencias</p>
                            <Select
                                placeholder={'Seleccionar competencia'}
                                notFoundContent={'No se encontraron resultados'}
                                options={getOptionsCompetences()}
                                value={null}
                                onChange={sendCompetence}
                                style={{width: 200}}
                            />
                        </div> */}
                        <Button
                            onClick={()=> validateParameters()}
                            style={{marginTop:'auto'}}
                            loading={loading}
                        >
                            Generar
                        </Button>
                    </div>
                    <div className='content_inputs'>
                        {['psp','psc'].includes(currentTab) && (
                            <div className='content_inputs_element'>
                                <p>Ver listado</p>
                                <Tooltip title='Personas seleccionadas' placement='bottom'>
                                    <Button
                                        onClick={()=> modalList(true)}
                                        icon={<UserOutlined />}
                                    >
                                        ({usersSelected.length})
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                        {currentTab == 'pps' && (
                            <div className='content_inputs_element'>
                                <p>Ver listado</p>
                                <Tooltip title='Perfiles seleccionados' placement='bottom'>
                                    <Button
                                        onClick={()=> modalList(false)}
                                        icon={<ProfileOutlined />}
                                    >
                                        ({profilesSelected.length})
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                        <div className='content_inputs_element'>
                            <p>Reporte actual</p>
                            <Tooltip title={getInfoType()} placement='topLeft'>
                                <FcInfo size={30}/>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
                {(usersSelected.length > 0 || profilesSelected.length > 0 ) && (
                    <Col span={24}>
                        <Row gutter={[24,24]}>
                            {['p','pp','pps'].includes(currentTab) && usersSelected.length > 0 && (
                                <Col xs={24} sm={12} md={12} lg={12} xl={10} xxl={8} className='fade_in'>
                                    <div className='info_user'>
                                        <Avatar src={getPhoto(usersSelected.at(-1))} size={80}/>
                                        <div className='info_user_text'>
                                            <p>{getFullName(usersSelected.at(-1))}</p>
                                            {currentTab == 'pp' && (
                                                <>
                                                    <p>Puesto: <span>{getProfile(profilesSelected.at(-1))}</span></p>
                                                    <p>Compatiblidad: <span>{getCompatibility(listReports.at(-1))}</span></p>
                                                </>
                                            )}
                                            {['p','pps'].includes(currentTab) && (
                                                <p><span>{getWork(usersSelected.at(-1))}</span></p>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            )}
                            {['psp','psc'].includes(currentTab) && profilesSelected.length > 0 &&(
                                <Col xs={24} sm={12} md={12} lg={12} xl={10} xxl={8} className='fade_in'>
                                    <div className='info_user'>
                                        <div className='info_user_text'>
                                            <p>{getProfile(profilesSelected.at(-1))}</p>
                                            <p><span>{getDescProfile(profilesSelected.at(-1))}</span></p>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Col>
                )}
                <Col span={24}>
                    <Table
                        className='items_selected'
                        {...getProperties()}
                        loading={loading}
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
        load_persons: state.userStore.load_persons,
        profiles: state.assessmentStore.profiles,
        load_profiles: state.assessmentStore.load_profiles,
        data_report: state.assessmentStore.data_report,
        load_report: state.assessmentStore.load_report
    };
};

export default connect(mapState, {getReportCompetences})(ReportsCompetences);