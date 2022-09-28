import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, DatePicker, Select, Form, Button, Row, Col, ConfigProvider} from 'antd'
import {SyncOutlined} from "@material-ui/icons";
import moment from 'moment/moment';
import { format } from 'path';
import { connect } from "react-redux";
import WebApiYnl from '../../api/WebApiYnl';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { getPersons } from '../../redux/ynlDuck';


const FilterDashboardPersonal = ({persons, getPersons, ...props}) => {
    const [filterModule] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [dataPersons, setDataPersons] = useState([]);

    useEffect(() => {
        getPersons();
    }, []);

    useEffect(() => {
        //Armamos array para llenar el select
        let results = persons.map((item)=>{
            return { key: item.id, value: item.id, label: item.firstName + " " + item.lastName } 
        })
        setDataPersons(results);
    }, [persons]);

    const onFinishFilter = (value) =>{
        //Formateamos la fecha que viene del range picker
        let valueStart = "";
        let valueEnd = "";
        value.filterDate.map((date, index) =>{if(index == 0){valueStart = moment(date._d).format("YYYY-MM-DD");}else if(index == 1){valueEnd = moment(date._d).format("YYYY-MM-DD");}})
        //Armamos la data a enviar a la api de consultas
        let data = {
            start_date : valueStart,
            end_date: valueEnd,
            person_id: value.valuesSelected ?? [],
        }
        console.log("data",data);
    }
    const resetFilter = () =>{filterModule.resetFields();}

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
    };
};
  
export default connect(mapState,{getPersons})(FilterDashboardPersonal);