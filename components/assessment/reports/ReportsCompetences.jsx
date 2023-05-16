import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
    Select,
    Col,
    Row,
    Table,
    Avatar,
    Button,
    Tooltip,
    message,
    Switch,
    Space,
    Typography
} from 'antd';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import {
    UserOutlined,
    ProfileOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import ViewList from './ViewList';
import {
    getFullName,
    getPhoto,
    getWork
} from '../../../utils/functions';
import WebApiAssessment from '../../../api/WebApiAssessment';
import _ from 'lodash';
// Se renderiza en el navegador, donde existe el objeto windown.
//Esta modificación es para la librería chartjs-plugin-zoom
const ViewChart = dynamic(()=> import('./ViewChart'), { ssr: false });
//Necesario para la libreria react-pdf
const GenerateReport = dynamic(()=> import('./GenerateReport'), { ssr: false });

const ReportsCompetences = ({
    persons_company,
    load_persons,
    profiles,
    load_profiles,
    currentKey,
    currentNode,
    general_config,
    labelUser = 'Seleccionar usuario',
    labelProfile = 'Seleccionar perfil',
    showSelectProfile = true,
    showChart = false,
    showListUser = false,
    showListProfile = false,
    showCardProfile = false,
    showCardUser = false,
    showTitleProfile = false,
    showTitleWork = false,
    ...props
}) => {

    const {Text} = Typography
    const [selectType, setSelectType] = useState(1)
    const [listGroups, setLisGroups] = useState([]);
    

    const columns_many = [
        {
            title: 'Imagen',
            fixed: 'left',
            align: 'center',
            width: 65,
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
            width: 70,
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
        }
    ]

    const [usersSelected, setUsersSelected] = useState([]);
    const [groupsSelected, setGroupsSelected] = useState([])
    const [profilesSelected, setProfilesSelected] = useState([]);
    const [listReports, setListReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState();
    const [isUsers, setIsUsers] = useState(false);
    const [columnsMany, setColumnsMany] = useState(columns_many);
    const [currentTab, setCurrentTab] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [openModalChart, setOpenModalChart] = useState(false);
    const [dataChart, setDataChart] = useState([]);
    const [typeReport, setTypeReport] = useState('p');
    //Estados para excel
    const [csvHeaders, setCsvHeaders] = useState([])
    const [csvDataSource, setCsvDataSource ] = useState([])
    const [nameFile, setNameFile] = useState('')
    const csvLink = useRef()

    useEffect(()=>{
        if(currentTab !== currentKey){
            setCurrentTab(currentKey)
            resetValues()
        }
    },[currentKey])

    const resetValues = () =>{
        setUsersSelected([])
        setProfilesSelected([])
        setListReports([])
        setIsUsers(false)
        setColumnsMany(columns_many)
        setCsvDataSource([])
        setCsvHeaders([])
        setNameFile('')
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

    const sendProfile = (value) =>{
        if(currentTab == 'pps'){
            const map_ = item => profiles.find(record => record.id == item);
            let results = value.map(map_);
            setProfilesSelected(results);
        }else{
            getObjProfile(value);
        }
    }

    const getObjProfile = (id) =>{
        let profile = profiles.find(record => record.id === id);
        if(profile) setProfilesSelected([profile]);
    }

    const sendUser = (value) =>{
        if(['psp','psc'].includes(currentTab)){
            const map_ = item => persons_company.find(record => record.id == item);
            let results = value.map(map_);
            setUsersSelected(results);
        }else{
            let user = persons_company.find(item => item.id === value);
            if(['pp','pps'].includes(currentTab)) sendProfileUser(user);
            setUsersSelected([user]);
        }
    }

    const addGroup = (val) => {
        const map_ = item => listGroups.find(record => record.id == item);
        let results = val.map(map_);
        setGroupsSelected(results);
    }

    const sendProfileUser = (user) =>{
        if(user.work_title &&
            user.work_title.job &&
            user.work_title.job.skill_profile_id
        ){
            getObjProfile(user.work_title.job.skill_profile_id);
        }
    }

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
        }else if( ['psp','psc'].includes(currentTab) && usersSelected.length <= 0 && groupsSelected.length <= 0){
            message.error('Selecciona una o mas personas o grupo de personas')
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
            node_id: currentNode?.id,
            groups: groupsSelected
        }
        getReportProfiles(data);
    }

    const getReportPSC = () =>{
        generateColumns()
        getReportProfile()
    }
    
    const subTitle = (item, subs = 3) => {  return  item?.competence?.name.substring(0, subs).toUpperCase() }

    const generateColumns = () =>{
        let info_columns = profilesSelected?.at(-1).competences;
        let list_columns = [...columns_many];
        info_columns.map((item, idx) =>{
            let title = subTitle(item)
            let exist = list_columns.some(record => record.comp == title)
            if(exist) title = subTitle(item, title.length + 1)
            list_columns.push({
                title: ()=>{
                    return (
                        <Tooltip title={item.competence?.name}>
                            <span>{title} ({item.level})</span>
                        </Tooltip>
                    )
                },
                comp: title,
                width: 30,
                align: 'center',
                show: true,
                render: (record) =>{
                    return (
                        <span>{getLevelPerson(record, item?.competence?.id)}</span>
                    )
                }
            })
        })
        list_columns.push({
            title: 'Compatibilidad',
            width: 50,
            align: 'center',
            show: true,
            // fixed: 'right',
            render: (record) =>{
                return(
                    <span>{getCompatibility(record)}</span>
                )
            }
        })
        list_columns.push({
            title: 'Ver gráfica',
            width: 50,
            align: 'center',
            show: true,
            render: (record) => {
                if(record.profiles.at(-1).compatibility !== 'N/A'){
                    return(
                        <EyeOutlined onClick={()=> modalChartInvidual([record],'pp')}/>  
                    )
                }
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

    const getDescProfile = () =>{
        let item = profilesSelected?.at(-1);
        return item ? item?.description : 'N/A';
    }

    const getCompatibility = (item) =>{
        return item 
            ? item.profiles
            ? typeof(item.profiles.at(-1).compatibility) == "string"
            ? item.profiles.at(-1).compatibility
            : `${item.profiles.at(-1).compatibility.toFixed(2)}%`
            : 'Pendiente'
            : 'Pendiente';
    }

    const getLevelPerson = (record, id) =>{
       if(!id) return 'N/A'
       const find_ = item => item.id == id
       let profiles = record?.profiles?.at(-1).competences
       if(!profiles) return 'N/A'
       let result = profiles.find(find_)
       if(!result) return 'N/A'
       return result.level_person
    }

    const getProfile = () =>{
        let item = profilesSelected?.at(-1);
        return item ? item.name : 'Pendiente';
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

    const onChangeTable = ({current}) =>{
        setCurrentPage(current)
    }

    const modalChartGlobal = () =>{
        if(listReports.length <= 0){
            message.error('Generar el reporte');
        }else{
            validateReportGlobal();
            setTypeReport(currentTab);
        }
    }

    const validateReportGlobal = () =>{
        if(currentTab == 'p') typeReportP();
        if(currentTab == 'psp') typeReportPSP();
        if(currentTab == 'pps') typeReportPPS();
        if(currentTab == 'psc') typeReportPSP();
        if(currentTab == 'pp'){
            setOpenModalChart(true);
            setDataChart(listReports);
        }
    }

    const typeReportP = () =>{
        const getItem = item => item.level !== 'N/A' && item.level !== 'N/A';
        let result = listReports.some(getItem);
        if(result){
            setDataChart([{
                fullName: getFullName(usersSelected.at(-1)),
                data: listReports.filter(getItem)
            }])
            setOpenModalChart(true);
        }else{
            message.error('Información insuficiente');
        }
    }

    const typeReportPSP = () =>{
        const getItem = item => item.profiles.at(-1).compatibility !== 'N/A';
        let result = listReports.some(getItem);
        if(result){
            setDataChart([{
                profile: profilesSelected,
                data: listReports.filter(getItem)
            }])
            setOpenModalChart(true);
        }else{
            message.error('Información insuficiente');
        }
    }

    const typeReportPPS = () =>{
        const getItem = item => item.compatibility !== 'N/A';
        let result = listReports.at(-1).profiles.some(getItem);
        if(result){
            setDataChart([{
                fullName: getFullName(usersSelected.at(-1)),
                data: listReports.at(-1).profiles.filter(getItem)
            }])
            setOpenModalChart(true);
        }else{
            message.error('Información insuficiente');
        }
    }

    const modalChartInvidual = (item, type) =>{
        setTypeReport(type);
        validateReportInvidual(item, type);
        setOpenModalChart(true);
    }

    const validateReportInvidual = (item, type) =>{
        if(currentTab == 'pps' && type == 'pp'){
            setDataChart([{
                persons: { fullName: getFullName(usersSelected.at(-1)) },
                profiles: item
            }])
        }else{
            setDataChart(item);
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
                    <span>{description_person ?? 'N/A'}</span>
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
                    <span>{description_profile ?? 'N/A'}</span>
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
                            : `${compatibility.toFixed(2)}%`
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
        },
        {
            title: 'Ver gráfica',
            render: (item) =>{
                if(item.profiles.at(-1).compatibility !== 'N/A'){
                    return(
                        <EyeOutlined onClick={()=> modalChartInvidual([item],'pp')}/>
                    )
                }
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
                            : `${compatibility.toFixed(2)}%`
                        }
                    </span>
                )
            }
        },
        {
            title: 'Ver gráfica',
            render: (item) =>{
                if(item.compatibility !== 'N/A'){
                    return(
                        <EyeOutlined onClick={()=> modalChartInvidual([item],'pp')}/>
                    )
                }
            }
        }
    ]

    const getDataReport = () =>{
        if(['p','psp','psc'].includes(currentTab)) return listReports;
        if(currentTab == 'pp') return listReports.at(-1)?.profiles.at(-1)?.competences;
        if(currentTab == 'pps') return listReports.at(-1)?.profiles;
    }

    const getRowKey = () =>{
        if(['pp','pps'].includes(currentTab)) return 'id';
        if(currentTab == 'p') return (item) => item.competence?.id;
        if(['psp','psc'].includes(currentTab)) return (item) => item.persons?.id;
    }

    const getColumns = () =>{
        if(currentTab == 'p') return columns_p;
        if(currentTab == 'pp') return columns_pp;
        if(currentTab == 'psp') return columns_psp;
        if(currentTab == 'pps') return columns_pps;
        if(currentTab == 'psc') return columnsMany;
    }

    const getProperties = () =>{
        let params = {
            columns: getColumns(),
            rowKey: getRowKey(),
            dataSource: getDataReport()
        }
        if(currentTab == 'psc') params.scroll = columnsMany.length > 8 ? { x: 1200}: {};
        return params;
    }

    const changeSelectType = (val) => {
        console.log('val',val);
        if(val === true){
            setSelectType(2)
            setUsersSelected([])
        }else{
            setSelectType(1)
            setGroupsSelected([])
        }
    }

    useEffect(() => {
      
    
      return () => {
        console.log('selectType', selectType);
      }
    }, [selectType])
    

    const getGroups = async () => {
        const data = {
            nodeId: currentNode?.id,
            name: '',
            queryParam: '',
          };
        try {
            let response = await WebApiAssessment.getGroupsPersons(data);
            console.log('response',response);
            if (response.status === 200){
                setLisGroups(response?.data?.results);    
            }
            
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getGroups();
    }, [currentNode])
    


    return (
        <div style={{margin: '20px'}}>
            <Row gutter={[24,24]}>
                {
                    ['psp','psc'].includes(currentTab) &&
                    <Col>
                        <Space>
                            <Text style={selectType === 1 ? {fontWeight:'bold'} : null}>
                                Personas
                            </Text>
                            <Switch checked={selectType === 2 ? true : false} onChange={changeSelectType} />
                            <Text style={selectType === 2 ? {fontWeight:'bold'} : null}>
                                Grupos
                            </Text>
                        </Space>
                    </Col>
                }
                <Col span={24} className='content_header'>
                    <div className='content_inputs'>
                        {
                            selectType === 1 ? 
                            <div className='content_inputs_element'>
                                <p>{labelUser}</p>
                                <Select
                                    showSearch
                                    placeholder='Seleccionar grupo'
                                    notFoundContent='No se encontraron resultados'
                                    {...getPropertiesSelectUser()}
                                    onChange={sendUser}
                                    loading={load_persons}
                                    style={{width: 200}}
                                    optionFilterProp='children'
                                >
                                    {persons_company.length > 0 && persons_company.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {getFullName(item)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div> :
                            <div className='content_inputs_element'>
                                <p>Selecciona un grupo</p>
                                <Select
                                    showSearch
                                    placeholder='Seleccionar usuario'
                                    notFoundContent='No se encontraron resultados'
                                    onChange={addGroup}
                                    loading={load_persons}
                                    style={{width: 200}}
                                    optionFilterProp='children'
                                    mode="multiple"
                                >
                                    {listGroups.length > 0 && listGroups.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>                             
                        } 
                        
                        {showSelectProfile && (
                            <div className='content_inputs_element'>
                                <p>{labelProfile}</p>
                                <Select
                                    showSearch
                                    placeholder='Seleccionar perfil'
                                    notFoundContent='No se encontraron resultados'
                                    {...getPropertiesSelectProfile()}
                                    loading={load_profiles}
                                    onChange={sendProfile}
                                    style={{width: 200}}
                                    optionFilterProp='children'
                                >
                                    {profiles.length > 0 && profiles.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}
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
                        <div
                            style={{alignItems:'center', marginTop: 30}}
                            className='content_inputs_element'
                        >   
                            <GenerateReport
                                currentTab={currentTab}
                                getColumns={getColumns}
                                getDataReport={getDataReport}
                                profilesSelected={profilesSelected}
                                usersSelected={usersSelected}
                                csvHeaders={csvHeaders}
                                setCsvHeaders={setCsvHeaders}
                                csvDataSource={csvDataSource}
                                setCsvDataSource={setCsvDataSource}
                                nameFile={nameFile}
                                setNameFile={setNameFile}
                                listReports={listReports}
                            />
                        </div>
                        {showChart && (
                            <div
                                style={{alignItems:'center'}}
                                className='content_inputs_element'
                            >
                                <p>Ver gráfica</p>
                                <Button
                                    onClick={()=> modalChartGlobal()}
                                    icon={<EyeOutlined />}
                                />
                            </div>
                        )}
                        {showListUser && (
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
                        {showListProfile && (
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
                    </div>
                </Col>
                {((usersSelected.length > 0 && showCardUser)
                    || (profilesSelected.length > 0 && showCardProfile)) && (
                    <Col span={24}>
                        <Row gutter={[24,24]}>
                            {showCardUser && usersSelected.length > 0 && (
                                <Col xs={24} sm={12} md={12} lg={12} xl={10} xxl={8} className='fade_in'>
                                    <div className='info_user'>
                                        <Avatar src={getPhoto(usersSelected.at(-1))} size={80}/>
                                        <div className='info_user_text'>
                                            <p>{getFullName(usersSelected.at(-1))}</p>
                                            {showTitleProfile && (
                                                <>
                                                    <p>Perfil: <span>{getProfile()}</span></p>
                                                    <p>Compatiblidad: <span>{getCompatibility(listReports.at(-1))}</span></p>
                                                </>
                                            )}
                                            {showTitleWork && (
                                                <p><span>{getWork(usersSelected.at(-1))}</span></p>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            )}
                            {showCardProfile && profilesSelected.length > 0 &&(
                                <Col xs={24} sm={12} md={12} lg={12} xl={10} xxl={8} className='fade_in'>
                                    <div className='info_user'>
                                        <div className='info_user_text'>
                                            <p>{getProfile()}</p>
                                            <p><span>{getDescProfile()}</span></p>
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
            {openModal && (
                <ViewList
                    visible={openModal}
                    isUsers={isUsers}
                    close={hideModalList}
                    listData={isUsers ? usersSelected : profilesSelected}
                    setListData={isUsers ? setUsersSelected : setProfilesSelected}
                />
            )}
            {openModalChart && (
                <ViewChart
                    visible={openModalChart}
                    close={setOpenModalChart}
                    infoReport={dataChart}
                    typeReport={typeReport}
                />
            )}
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