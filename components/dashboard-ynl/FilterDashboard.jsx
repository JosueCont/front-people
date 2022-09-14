import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, List, Checkbox, DatePicker, Select, Option, Form, Button, Row, Col} from 'antd'
import {SyncOutlined} from "@material-ui/icons";
import moment from 'moment/moment';
import { format } from 'path';
import { connect } from "react-redux";
import WebApiYnl from '../../api/WebApiYnl';
import { getDailyEmotions } from '../../redux/ynlDuck';

const FilterDashboard = ({currentNode, getDailyEmotions, ...props}) => {
    const [filterModule] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [value, setValue] = useState(1);
    const [jobs, setJobs] = useState([]);
    const [departaments, setDepartaments] = useState([]);
    const [people, setPeople] = useState([]);
    const [optionSelect, setOptionSelect] = useState([]);

    useEffect(() => {
        getJobs();
        getDepartaments();
        getPeoples();
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

    // const getTopPersons = async (data) =>{
    //     try {
    //         let response = await WebApiYnl.getTopPersons(data);
    //         console.log("respuesta top personas",response);
    //     } catch (e) {
    //         console.error(e.name + ": " + e.message);
    //     }
    // }

    // const getDailyEmotions = async (data) =>{
    //     try {
    //         let response = await WebApiYnl.getDailyEmotions(data);
    //         console.log("respuesta emociones diarias",response);
    //     } catch (e) {
    //         console.error(e.name + ": " + e.message);
    //     }
    // }

    // const getEmotionalAspects = async (data) =>{
    //     try {
    //         let response = await WebApiYnl.getEmotionalAspects(data);
    //         console.log("respuesta aspectos emocionales",response);
    //     } catch (e) {
    //         console.error(e.name + ": " + e.message);
    //     }
    // }

    // const getReportUser = async (data) =>{
    //     try {
    //         let response = await WebApiYnl.getReportUser(data);
    //         console.log("respuesta reporte usuario",response);
    //     } catch (e) {
    //         console.error(e.name + ": " + e.message);
    //     }
    // }

    // const getEmotionChart = async (data) =>{
    //     try {
    //         let response = await WebApiYnl.getEmotionChart(data);
    //         console.log("respuesta chart emociones",response);
    //     } catch (e) {
    //         console.error(e.name + ": " + e.message);
    //     }
    // }

    const onChange = (e) => {
        //console.log('radio checked', e.target.value);
        setValue(e.target.value);
        let results = [];
        if(e.target.value == 1){
            results = departaments.map(item => {
            return { key: item.id, value: item.id, label: item.name }
           }) 
        }else if(e.target.value == 2){
            results = jobs.map(item => {
                return { key: item.id, value: item.id, label: item.name }
            }) 
        }else if(e.target.value == 3){
            results = people.map(item => {
                return { key: item.id, value: item.id, label: item.first_name }
            })
        }
        setOptionSelect(results)
    };
    
    const onFinishFilter = (dataForm) =>{
        let valueStart = "";
        let valueEnd = "";
        dataForm.filterDate.map((date, index) =>{if(index == 0){valueStart = moment(date._d).format("YYYY-MM-DD");}else if(index == 1){valueEnd = moment(date._d).format("YYYY-MM-DD");}})
        let data = {
            start_date : valueStart,
            end_date: valueEnd,
            person_department_id: value == 1 ? dataForm.valuesSelected: [],
            person_employment_id: value == 2 ? dataForm.valuesSelected: [],
            //group_id: value == 3 ? dataForm.valuesSelected: "",
        }
        console.log("Valores del filtro",data);
        // getTopPersons(data);
        getDailyEmotions(data);
        // getEmotionalAspects(data);
        // getReportUser(data);
        // getEmotionChart(data);
    }
    const resetFilter = () =>{filterModule.resetFields();}

  return (
    <>
        <Form
            layout='horizontal'
            onFinish={onFinishFilter}
            form={filterModule}
            requiredMark={false}
            >
            <h3 className='subtitles'><b>Filtrar por:</b></h3>
            <Form.Item name="filterDate">
                <RangePicker />                          
            </Form.Item>
            <Form.Item name="OptionSelected">
                <Radio.Group onChange={onChange} value={value}>
                    <Space direction="vertical">
                        <Radio value={1}>Departamentos</Radio>
                        <Radio value={2}>Puesto</Radio>
                        <Radio value={3}>Personas</Radio>
                    </Space>
                </Radio.Group>                          
            </Form.Item>
            <Form.Item name="valuesSelected">
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: '100%',}}
                    placeholder="Selecciona"
                    options={optionSelect}
                     />
            </Form.Item>
            
            <Row>
                <Col span={12}>
                    <Button htmlType='submit'>Filtrar</Button>
                </Col>
                <Col span={12}>
                    <Button onClick={resetFilter}><SyncOutlined /></Button>
                </Col>
            </Row>
        </Form>

    </>
  )
}
const mapState = (state) => {
    return {
      currentNode: state.userStore.current_node,
    };
};
  
export default connect(mapState,{getDailyEmotions})(FilterDashboard);