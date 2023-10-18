import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, DatePicker, Select, Form, Button, Row, Col, ConfigProvider, Tooltip} from 'antd'
import {SyncOutlined} from "@material-ui/icons";
import moment from 'moment/moment';
import { format } from 'path';
import {ClearOutlined, FilterOutlined} from '@ant-design/icons';
import { connect } from "react-redux";
import WebApiYnl from '../../api/WebApiYnl';
import { getDailyEmotions } from '../../redux/ynlDuck';
import { getTopPersons } from '../../redux/ynlDuck';
import { getEmotionalAspects } from '../../redux/ynlDuck';
import { getReportUser } from '../../redux/ynlDuck';
import { getEmotionChart } from '../../redux/ynlDuck';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { subtract } from 'lodash';
import { useSelector } from 'react-redux';

const FilterDashboard = ({currentNode,
    getDailyEmotions,
    getTopPersons,
    getEmotionalAspects,
    getReportUser,
    getEmotionChart,
    ...props}) => {
    const [filterModule] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [value, setValue] = useState(1);
    const [jobs, setJobs] = useState([]);
    const [departaments, setDepartaments] = useState([]);
    const [people, setPeople] = useState([]);
    const [groups, setGroups] = useState([]);
    const [optionSelect, setOptionSelect] = useState([]);
    const [visibilitySelect, setVisibilitySelect] = useState(true);
    const isShowFilters = useSelector((state) => state.userStore.applications.ynl)

    
    useEffect(() => {
        // Initial datepicker filter
        console.log('isShwsFilters',isShowFilters)
        const startOfMonth = moment().clone().startOf('month');
        const endOfMonth = moment().clone().endOf('month');
      //Seteamos fecha actual al datepicker porque es el rango de la consulta al principio
      filterModule.setFieldsValue({ filterDate: [startOfMonth, endOfMonth] });
      //Consulta a los reportes con la fecha de hoy, solo al cargar la página al principio.
      let dataToInicialize = {start_date : startOfMonth.format("YYYY-MM-DD"),end_date: endOfMonth.format("YYYY-MM-DD"),person_department_id: [],person_employment_id:[],}
      getTopPersons(dataToInicialize);
      getDailyEmotions(dataToInicialize);
      getEmotionalAspects(dataToInicialize);
      getReportUser(dataToInicialize);
      getEmotionChart(dataToInicialize);  
    }, []);
    
    useEffect(() => {
        //Consulta a las apis para llenar listas de departamentos, trabajos, personas
        getJobs();
        getDepartaments();
        getPeoples();
        getGroups();
    }, [currentNode]);

    const getJobs = async () =>{
        try {
            let response = await WebApiYnl.getJobs(currentNode.id);
            //console.log("respuesta api puestos de trabajo",response);
            setJobs(response.data);
        } catch (e) {
            console.error(e.name + ": " + e.message);
        }
    };
    const getDepartaments = async () =>{
        try {
            let response = await WebApiYnl.getDepartamentsToYnl(currentNode.id, true);
            //console.log("respuesta api departamentos",response);
            setDepartaments(response.data.results);
        } catch (e) {
            console.error(e.name + ": " + e.message);
        }
    }
    const getPeoples = async () =>{
        try {
            let response = await WebApiYnl.getPeoplesToYnl(currentNode.id, true, false, true);
            //console.log("respuesta api personas",response);
            setPeople(response.data.results);
        } catch (e) {
            console.error(e.name + ": " + e.message);
        }
    }

    const getGroups = async () => {
        try {
            let response = await WebApiYnl.getSelectsData();
            //console.log("respuesta api grupos", response.data.data);
            setGroups(response.data.data.groups)
        } catch (e) {
            console.error(e.name + ": " + e.message);
        }
    }

    const onChange = (e) => {
        setVisibilitySelect(false);
        //Borramos los valores del select cuando se cambia de check
        filterModule.setFieldsValue({ valuesSelected: undefined })
        setValue(e.target.value);
        //Dependiendo del check cargamos la lista de las consultas previamente realizadas
        let results = [];
        if(e.target.value == 1){
            results = departaments.map(item => {
            return { key: item.id, value: item.code, label: item.name }
           }) 
        }else if(e.target.value == 2){
            results = jobs.map(item => {
                return { key: item.id, value: item.code, label: item.name }
            }) 
        }else if(e.target.value == 3){
            results = groups.map(item => {
                return { key: item.group_id, value: item.group_id , label: item.group_name }
            })
        }else if(e.target.value === 4){
            let ynlOptions = {key: 0, value: 0, label: "Todos"}
            let ynlOptionsYNL = {key: -1, value: -1, label: "Sin empresa"}
            if (props?.userInfo?.user?.nodes.length > 0) {
                results = props?.userInfo?.user?.nodes?.map(item => {
                    if (item.active) {
                        return { key: item.id, value: item.id, label: item.name}
                    }
                })
                results = [ynlOptions,ynlOptionsYNL, ...results]
            }
        }
        setOptionSelect(results)
    };
    
    const onFinishFilter = (dataForm) =>{
        //Formateamos la fecha que viene del range picker
        let valueStart = "";
        let valueEnd = "";
        dataForm.filterDate.map((date, index) =>{if(index == 0){valueStart = moment(date._d).format("YYYY-MM-DD");}else if(index == 1){valueEnd = moment(date._d).format("YYYY-MM-DD");}})
        //Armamos la data a enviar a la api de consultas
        let data = {
            start_date : valueStart,
            end_date: valueEnd,
            person_department_id: value == 1 ? dataForm.valuesSelected?? []: [],
            person_employment_id: value == 2 ? dataForm.valuesSelected?? []: [],
            groups: value == 3 ? dataForm.valuesSelected ?? [] : [],
            companies: value === 4 ? [dataForm.valuesSelected] ?? [] : []
        }
        if(dataForm.siteSelected != '') data.ynl_type_response = dataForm.siteSelected
        //Consultas
        getTopPersons(data);
        getDailyEmotions(data);
        getEmotionalAspects(data);
        getReportUser(data);
        getEmotionChart(data);
    }

    const resetFilter = () =>{
        const startOfMonth = moment().clone().startOf('month');
        const endOfMonth = moment().clone().endOf('month');
        filterModule.resetFields();
        filterModule.setFieldsValue({ filterDate: [startOfMonth, endOfMonth] });
        filterModule.submit()
    }

    const disabledDate = (current) => { 
        let start = moment().subtract(2,'years').startOf('year');
        let end = moment().endOf('month');
        if (current < moment(start)){
            return true;
        }
        else if (current > moment(end)){
            return true;
        }
        else {
            return false; 
        }
    }

  return (
    <>
        <Form
            layout='horizontal'
            onFinish={onFinishFilter}
            form={filterModule}
            requiredMark={false}
            >
            <h3 className='subtitles'><b>Filtrar por:</b></h3>
            <Form.Item name="filterDate" rules={[{ required: true, message: 'Es necesario un rango de fechas para realizar el filtro' }]}>
                <RangePicker
                    locale={locale}
                    style={{width: '100%',}}
                    disabledDate={disabledDate}
                    format={'DD/MM/YYYY'} />
            </Form.Item>
            <Form.Item name="OptionSelected">
                <Radio.Group onChange={onChange} value={value}>
                    <Space direction="vertical">
                        <Radio value={1}>Departamentos</Radio>
                        <Radio value={2}>Puestos</Radio>
                        <Radio value={3}>Grupos</Radio>
                        <Radio value={4}>Empresas</Radio>
                    </Space>
                </Radio.Group>                          
            </Form.Item>
            <Form.Item name="valuesSelected">
                <Select
                    mode={value === 4 ? "single" : "multiple"}
                    allowClear
                    style={{width: '100%',}}
                    placeholder="Selecciona"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={optionSelect}
                    disabled={visibilitySelect}
                     />
            </Form.Item>
            {isShowFilters?.showFilterSite?.allow_view_users_non_site ? (
                <>
                <h3 className='subtitles'><b>Filtrar por usuarios:</b></h3>
                <Form.Item name="siteSelected">
                <Select
                    mode={"single" }
                    allowClear
                    style={{width: '100%',}}
                    placeholder="Selecciona"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={[
                        {label:'Todos', value:'ALL'},
                        {label:'Con sitio', value:''},
                        {label:'Sin sitio',value:'NULL'}
                    ]}
                />
            </Form.Item>
                </>
            ): null}
            
            <Row>
                <Col span={12}>
                    <Space>
                        <Button htmlType='submit' style={{marginRight:5, display:'flex', justifyContent:'center',alignItems:'center', padding:5}}><FilterOutlined /> Filtrar</Button>
                        <Button onClick={resetFilter} style={{display:'flex', justifyContent:'center',alignItems:'center', padding:5}}><ClearOutlined /> Limpiar</Button>
                    </Space>

                </Col>
            </Row>
        </Form>

    </>
  )
}
const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        userInfo: state.userStore
    };
};
  
export default connect(mapState,{getTopPersons, getDailyEmotions, getEmotionalAspects, getReportUser, getEmotionChart})(FilterDashboard);