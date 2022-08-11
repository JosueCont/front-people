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
    message,
    Skeleton
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
import WebApiAssessment from '../../../api/WebApiAssessment';
import { valueToFilter } from '../../../utils/functions';

const ReportsCompetences = ({
    persons_company,
    load_persons,
    profiles,
    load_profiles,
    currentKey,
    currentNode,
    general_config,
    ...props
}) => {

    const columns_many = [
        {
            title: 'Imagen',
            align: 'center',
            width: 100,
            show: true,
            render: ({persons}) =>{
                return (
                    <Avatar src={getPhotoPerson(persons.id)}/>
                )
            }
        },
        {
            title: 'Persona',
            fixed: 'left',
            width: 200,
            show: true,
            ellipsis: true,
            render: ({persons}) =>{
                return (
                    <span>{getFullNamePerson(persons.id)}</span>
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
    const [optionsPersons, setOptionsPersons] = useState([]);
    const [optionsProfiles, setOptionsProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        if(currentTab !== currentKey){
            setCurrentTab(currentKey)
            resetValues()
        }
    },[currentKey])

    useEffect(()=>{
        getOptionsPersons();
    },[persons_company])

    useEffect(()=>{
        getOptionsProfiles();
    },[profiles])

    const resetValues = () =>{
        setUsersSelected([])
        setCompetencesSelected([])
        setProfilesSelected([])
        setListReports([])
        setIsUsers(false)
        setColumnsMany(columns_many)
    }

    const getReportCompetences = async (data) =>{
        setLoading(true)
        try {
            let response = await WebApiAssessment.getReportCompetences(data);
            setListReports(response.data);
            setLoading(false)
            message.success('Información obtenida')
        } catch (e) {
            setLoading(false)
            message.error('Información no obtenida')
            console.log(e)
        }
    }

    const getReportProfiles = async (data) =>{
        setLoading(true)
        try {
            let response = await WebApiAssessment.getReportProfiles(data);
            setListReports(response.data);
            setLoading(false)
            message.success('Información obtenida')
        } catch (e) {
            setLoading(false)
            message.error('Información no obtenida')
            console.log(e)
        }
    }

    const getOptionsPersons = () =>{
        let options = [];
        if(persons_company.length > 0){
            persons_company.map(item =>{
                options.push({
                    key: item.id,
                    value: item.id,
                    label: getFullName(item)
                })
            })
        }
        setOptionsPersons(options);
    }

    const getOptionsProfiles = () =>{
        let options = [];
        if(profiles.length > 0){
          profiles.map(item=>{
            options.push({
                key: item.id,
                value: item.id,
                label: item.name
            })
          })
        }
        setOptionsProfiles(options);
    }

    // const getOptionsCompetences = () =>{
    //     let options = [];
    //     if(competences.length > 0){
    //         competences.map(item => {
    //             let exist = competencesSelected.some(record => record.id === item.id)
    //             if(!exist){
    //                 options.push({
    //                     key: item.id,
    //                     value: item.id,
    //                     label: item.name
    //                 })
    //             }
    //         })
    //     }
    //     return options;
    // }

    const sendProfile = (value) =>{
        if(currentTab == 'pps'){
            let list = [];
            value.map(item =>{
                let profile = profiles.find(record => record.id === item);
                list.push(profile);
            })
            setProfilesSelected(list);
        }else{
            let profile = profiles.find(record => record.id === value);
            setProfilesSelected([profile])
        }
    }

    const sendUser = (value) =>{
        if(['psp','psc'].includes(currentTab)){
            let list = [];
            value.map(item =>{
                let user = persons_company.find(record => record.id === item);
                list.push(user);
            })
            setUsersSelected(list);
        }else{
            let user = persons_company.find(item => item.id === value);
            setUsersSelected([user]);
        }
    }

    // const sendCompetence = (value) =>{
    //     let exists = competencesSelected.some(item => item.id === value);
    //     if(!exists){
    //         let competence = competences.find(item => item.id == value);
    //         let list = [...competencesSelected, competence];
    //         setCompetencesSelected(list);
    //     }
    // }

    const getPropertiesSelectUser = () =>{
        if(['psp','psc'].includes(currentTab)){
            return {
                mode: 'multiple',
                value: usersSelected.map(item => item.id),
                maxTagCount: 'responsive',
            };
        }
        return {
            value: usersSelected.length > 0
                ? usersSelected?.at(-1)?.id
                : null
        };
    }

    const getPropertiesSelectProfile = () =>{
        if(currentTab == 'pps'){
            return {
                mode: 'multiple',
                value: profilesSelected.map(item => item.id),
                maxTagCount: 'responsive',
            };
        }
        return {
            value: profilesSelected.length > 0
                ? profilesSelected?.at(-1)?.id
                : null
        };
    }

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
            setCurrentPage(1)
            validateReport()
        }
    }

    const validateReport = () =>{
        if(currentTab == 'p'){
            getReportP()
        }else if(['pp','psp','pps'].includes(currentTab)){
            getReportProfile()
        }else{
            getReportPSC()
        }
    }

    const getReportP = async () =>{
        let data = {
            node_id: currentNode?.id,
            user_id: usersSelected.at(-1).id,
            calculation_type: general_config?.calculation_type
        }
        getReportCompetences(data);
    }

    const getReportProfile = () =>{
        let data = {
            profiles: profilesSelected.map(item => item.id),
            users: usersSelected.map(item=> {return {id: item.id, fullName: getFullName(item)}}),
            calculation_type: general_config?.calculation_type,
            node_id: currentNode?.id
        }
        getReportProfiles(data);
    }

    const getReportPSC = () =>{
        generateColumns()
        getReportProfile()
    }

    const generateColumns = () =>{
        let info_columns = profilesSelected?.at(-1).competences;
        let list_columns = [...columns_many];
        info_columns.map((item, idx) =>{
            list_columns.push({
                title: ()=>{
                    return (
                        <Tooltip title={item.competence?.name}>
                            <span>{item.competence?.name.substring(0,3).toUpperCase()}</span>
                        </Tooltip>
                    )
                },
                width: 50,
                align: 'center',
                show: true,
                render: (record) =>{
                    return (
                        <span>{getLevelPerson(record, idx)}</span>
                    )
                }
            })
        })
        list_columns.push({
            title: 'Compatibilidad',
            width: 125,
            align: 'center',
            show: true,
            fixed: 'right',
            render: (record) =>{
                return(
                    <span>{getCompatibility(record)}</span>
                )
            }
        })
        let newList = list_columns.filter(item=> item.show);
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
        return item 
            ? item.profiles
            ? typeof(item.profiles.at(-1).compatibility) == "string"
            ? item.profiles.at(-1).compatibility
            : `${item.profiles.at(-1).compatibility.toFixed(0)}%`
            : 'Pendiente'
            : 'Pendiente';
    }

    const getLevelPerson = ({profiles}, index) =>{
        return profiles ? profiles?.at(-1).competences[index]?.level_person : 'N/A';
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

    const findUser = (id) =>{
        return persons_company.find(item => item.id === id);
    }

    const getPhotoPerson = (id) =>{
        let user = findUser(id);
        let photo = getPhoto(user);
        return photo;
    }

    const getFullNamePerson = (id) =>{
        let user = findUser(id);
        let fullName = getFullName(user);
        return fullName;
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
                rowKey: (item) => item.competence?.id,
                dataSource: listReports
            }
        }else if(currentTab == 'pp'){
            return {
                columns: columns_pp,
                rowKey: 'id',
                dataSource: listReports.at(-1)?.profiles.at(-1)?.competences
            }
        }else if(currentTab == 'psp'){
            return {
                columns: columns_psp,
                rowKey: (item) => item.persons?.id,
                dataSource: listReports
            }
        }else if(currentTab == 'pps'){
            return {
                columns: columns_pps,
                rowKey: 'id',
                dataSource: listReports.at(-1)?.profiles
            }
        }else{
            return {
                columns: columnsMany,
                rowKey: (item) => item.persons?.id,
                dataSource: listReports,
                scroll: { x: 1500}
            }
        }
    }

    const filterOptionSelect = (input, option) =>{
        return valueToFilter(option.label).includes(valueToFilter(input))
    }

    const onChangeTable = ({current}) =>{
        setCurrentPage(current)
    }

    const columns_p = [
        {
            title: 'Competencia',
            dataIndex: ['competence','name'],
            key: ['competence','name']
        },
        {
            title: 'Nivel',
            render: ({level}) =>{
                return <span>{level == 0 ? 'N/A' : level}</span>
            }
        },
        {
            title: 'Descripción',
            width: 800,
            render: ({description}) =>{
                return <span>{description ? description : 'N/A'}</span>
            }
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
            key: 'level_person',
            align: 'center',
        },
        {
            title: 'Descripción',
            key: 'description_person',
            render: ({description_person}) =>{
                return (
                    <span>{description_person ? description_person : 'N/A'}</span>
                )
            }
        },
        {
            title: 'Nivel perfil',
            dataIndex: 'level_profile',
            key: 'level_profile',
            align: 'center',
        },
        {
            title: 'Descripción',
            key: 'description_profile',
            render: ({description_profile}) =>{
                return (
                    <span>{description_profile ? description_profile : 'N/A'}</span>
                )
            }
        },
        {
            title: 'Compatibilidad',
            align: 'center',
            render: ({compatibility}) =>{
                return (
                    <span>
                        {typeof(compatibility) == "string"
                            ? compatibility
                            : `${compatibility.toFixed(0)}%`
                        }
                    </span>
                )
            }
        }
    ]

    const columns_psp = [
        {
            title: 'Imagen',
            align: 'center',
            width: 100,
            render: ({persons}) =>{
                return (
                    <Avatar src={getPhotoPerson(persons.id)}/>
                )
            }
        },
        {
            title: 'Persona',
            render: ({persons}) =>{
                return (
                    <span>{getFullNamePerson(persons.id)}</span>
                )
            }
        },
        {
            title: 'Compatibilidad',
            render: (item) =>{
                return(
                    <span>{getCompatibility(item)}</span>
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
                return (
                    <span>
                        {typeof(compatibility) == "string"
                            ? compatibility
                            : `${compatibility.toFixed(0)}%`
                        }
                    </span>
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
                                showSearch
                                placeholder={'Seleccionar usuario'}
                                notFoundContent={'No se encontraron resultados'}
                                options={optionsPersons}
                                {...getPropertiesSelectUser()}
                                onChange={sendUser}
                                loading={load_persons}
                                style={{width: 200}}
                                optionFilterProp={'children'}
                                filterOption={filterOptionSelect}
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
                                    showSearch
                                    placeholder={'Seleccionar perfil'}
                                    notFoundContent={'No se encontraron resultados'}
                                    options={optionsProfiles}
                                    {...getPropertiesSelectProfile()}
                                    loading={load_profiles}
                                    onChange={sendProfile}
                                    style={{width: 200}}
                                    optionFilterProp={'children'}
                                    filterOption={filterOptionSelect}
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
                        <Button
                            onClick={()=> resetValues()}
                            style={{marginTop:'auto'}}
                        >
                            Reiniciar
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
                        onChange={onChangeTable}
                        pagination={{
                            current: currentPage,
                            hideOnSinglePage: true,
                            showSizeChanger: false
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
        persons_company: state.userStore.persons_company,
        load_persons: state.userStore.load_persons,
        profiles: state.assessmentStore.profiles,
        load_profiles: state.assessmentStore.load_profiles,
        currentNode: state.userStore.current_node,
        general_config: state.userStore.general_config
    };
};

export default connect(mapState)(ReportsCompetences);