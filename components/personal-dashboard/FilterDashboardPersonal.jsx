import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, DatePicker, Select, Form, Button, Row, Col, ConfigProvider} from 'antd'
import {SyncOutlined} from "@material-ui/icons";
import moment from 'moment/moment';
import { format } from 'path';
import { connect } from "react-redux";
import WebApiYnl from '../../api/WebApiYnl';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { getPersons } from '../../redux/ynlDuck';
import { getReportPerson } from '../../redux/ynlDuck';
import { useRouter } from "next/router";


const FilterDashboardPersonal = ({persons, getPersons, getReportPerson, ...props}) => {
    const [filterModule] = Form.useForm();
    const { RangePicker } = DatePicker;
    const router = useRouter();
    const [dataPersons, setDataPersons] = useState([]);


    // Detectamos si tiene el queryparams de userid
    useEffect(()=>{
        if(router.query){
            console.log(router.query)
            const q = router?.query;
            if(q.user_id){
                filterModule.setFieldsValue({
                    valuesSelected: q.user_id
                })
                filterModule.submit()
            }
        }
    },[router])

    useEffect(() => {
        getPersons();
    }, []);

    useEffect(() => {
        //Armamos array para llenar el select
        let results = persons.map((item)=>{
            return { key: item.id, value: item.khonnect_id, label: item.firstName + " " + item.lastName } 
        })
        setDataPersons(results);
    }, [persons]);

    const onFinishFilter = (value) =>{
        //Formateamos la fecha que viene del range picker
        /*let valueStart = "";
        let valueEnd = "";
        value.filterDate.map((date, index) =>{if(index == 0){valueStart = moment(date._d).format("YYYY-MM-DD");}else if(index == 1){valueEnd = moment(date._d).format("YYYY-MM-DD");}})
        */
       const dates =  getDateFromPicker(value.filterDate)

        //Armamos la data a enviar a la api de consultas
        let data = {
            start_date : dates.valueStart,
            end_date: dates.valueEnd,
            khonnect_ids: [value.valuesSelected] ?? [],
        }
        console.log("Filtro que se envia a consulta",data);
        getReportPerson(data);
    }
    const resetFilter = () =>{filterModule.resetFields();}

    const getDateFromPicker=(filterDate)=>{
        //Formateamos la fecha que viene del range picker
        let valueStart = "";
        let valueEnd = "";
        filterDate.map((date, index) =>{if(index == 0){valueStart = moment(date._d).format("YYYY-MM-DD");}else if(index == 1){valueEnd = moment(date._d).format("YYYY-MM-DD");}})
        return { valueStart, valueEnd}

    }

  return (
    <>
        <Row>
            <Col xs={24} md={24}>
                <div style={{backgroundColor:"#FF5E00", padding:"16px 16px", borderRadius:"25px"}}>
                <h2 style={{color:"white"}}>Filtro por persona</h2>
                <Form
                    layout="horizontal"
                    onFinish={onFinishFilter}
                    form={filterModule}
                    requiredMark={false}
                    >
                    <Row>
                        <Col xs={22} md={8}>
                            <Form.Item label="Rango de fechas" name="filterDate" rules={[{ required: true, message: 'Es necesario un rango de fechas para realizar el filtro' }]}>
                                <RangePicker
                                    style={{width:"90%", marginLeft:"8px", marginRight:"8px"}}
                                    locale={locale}
                                    // disabledDate={disabledDate} 
                                    />                     
                            </Form.Item>
                        </Col>
                        <Col xs={22} md={8}>
                            <Form.Item label="Persona" name="valuesSelected">
                                <Select
                                    style={{width:"90%", marginLeft:"8px",}}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                    placeholder="Seleccion persona"
                                    options={dataPersons}
                                    />
                            </Form.Item>
                        </Col>
                        <Col xs={22} md={2} style={{display:"flex"}}>
                            <Button htmlType='submit' style={{marginLeft:"8px"}} >Filtrar</Button>
                            <Button  onClick={resetFilter} style={{marginLeft:"8px"}}
                            ><SyncOutlined /></Button>
                        </Col>
                    </Row>
                </Form>
                </div>
            </Col>
        </Row>
        
    </>
  )
}
const mapState = (state) => {
    return {
      persons: state.ynlStore.persons,
      reportPerson: state.ynlStore.reportPerson,
    };
};
  
export default connect(mapState,{getPersons, getReportPerson})(FilterDashboardPersonal);