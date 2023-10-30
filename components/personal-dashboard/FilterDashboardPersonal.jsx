import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, DatePicker, Select, Form, Button, Row, Col,} from 'antd'
import {SyncOutlined} from "@material-ui/icons";
import moment from 'moment';
import { format } from 'path';
import { connect } from "react-redux";
import WebApiYnl from '../../api/WebApiYnl';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { getPersons } from '../../redux/ynlDuck';
import { getReportPerson } from '../../redux/ynlDuck';
import { getStreakTop, getDataGraphGoal, getTopGoals } from '../../redux/ynlDuck';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';


const FilterDashboardPersonal = ({persons, getPersons, getReportPerson, getStreakTop, getDataGraphGoal, getTopGoals,...props}) => {
    const [filterModule] = Form.useForm();
    const { RangePicker } = DatePicker;
    const router = useRouter();
    const [dataPersons, setDataPersons] = useState([]);
    const [ynlType, setYnlType] = useState(null)
    const isShowFilters = useSelector((state) => state.userStore.applications.ynl)
    const instance = useSelector(state => state.userStore.current_node)


    const  getFirstDayOfMonth=(year, month)=> {
        return new Date(year, month, 1);
    }
    // Detectamos si tiene el queryparams de userid
    useEffect(()=>{
        if(router.query){
            console.log(router.query)
            const q = router?.query;
            if(q.user_id){
                console.log('useR_id', q.user_id)
                filterModule.setFieldsValue({
                    valuesSelected: q.user_id
                })
                /*Usamos del mes*/
                const startOfMonth = moment().clone().startOf('month');
                const endOfMonth = moment().clone().endOf('month');
                if(!filterModule.getFieldValue('filterDate')){
                    filterModule.setFieldsValue({
                        filterDate:[startOfMonth, endOfMonth]
                    })
                }

                filterModule.submit()
            }
        }
    },[router])

    useEffect(() => {
        //getPersons(filterModule.getFieldsValue().siteSelected);
        filterModule.setFieldsValue({filterDate: [moment().startOf('month'), moment().endOf('month')]})
        if(isShowFilters) filterModule.setFieldsValue({siteSelected:'NULL'})
    }, []);
    useEffect(() => {
        getPersons(ynlType);
    }, [ynlType]);

    useEffect(() => {
        if(persons.length>0){
            //Armamos array para llenar el select
            let results = persons.map((item)=>{
                console.log('item', item.provider, item )
                return { key: item.id, value: item.khonnect_id?item.khonnect_id:item.id.toString(), label: `${(item.firstName !=='' && item.firstName !==null)?item.firstName:'' } ${(item.lastName !=='' && item.lastName !==null)?`${item.lastName} / `:''}  ${item.email}` }
            })
            console.log('results====',results)
            setDataPersons(results);
        }else{
            setDataPersons([]);
        }
        
        
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
            publica_data: true
        }

        if(isKhorID(value.valuesSelected)){
            data = {
                khonnect_ids: [value.valuesSelected] ?? [],
                ynl_id: [],
                ...data
            }
        }else{
            data = {
                khonnect_ids:[],
                ynl_id: [value.valuesSelected]??[],
                ...data
            }
        }

        if(value.siteSelected != '') data.ynl_type_response = value.siteSelected


        console.log("Filtro que se envia a consulta",data);
        getReportPerson(data);
        //getStreakTop(data);
        //getTopGoals(data);
        //getDataGraphGoal(data)
    }
    const resetFilter = () =>{filterModule.resetFields();}

    const isKhorID = (valuesSelected) => {
        return isNaN(valuesSelected)
    }

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
                        <Col xs={22} md={10}>
                            <Form.Item label={<label style={{ color: "white" }}><b>Rango de fechas</b></label>} name="filterDate" rules={[{ required: true, message: 'Es necesario un rango de fechas para realizar el filtro' }]}>
                                <RangePicker
                                    style={{width:"90%", marginLeft:"8px", marginRight:"8px"}}
                                    locale={locale}
                                    // disabledDate={disabledDate} 
                                    />                     
                            </Form.Item>
                        </Col>
                        <Col xs={22} md={10}>
                            <Form.Item label={<label style={{ color: "white" }}><b>Selecciona una persona</b></label>} name="valuesSelected">
                                <Select
                                    style={{width:"90%", marginLeft:"8px",}}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                    placeholder="Selecciona una persona"
                                    options={dataPersons}
                                    />
                            </Form.Item>
                        </Col>
                        <Col xs={22} md={2} style={{display:"flex"}}>
                            <Button htmlType='submit' style={{marginLeft:"8px"}} >Filtrar</Button>
                            {/*<Button  onClick={resetFilter} style={{marginLeft:"8px"}}*/}
                            {/*><SyncOutlined /></Button>*/}
                        </Col>
                    </Row>
                    <Row>
                    {isShowFilters?.showFilterSite?.allow_view_users_non_site ? (
                            <Col xs={22} md={10}>
                                <Form.Item name="siteSelected" label={<label style={{ color: "white" }}><b>Filtrar por usuarios</b></label>}>
                                <Select
                                    mode={"single" }
                                    allowClear
                                    style={{width: '80%',}}
                                    placeholder="Selecciona"
                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                    showSearch
                                    onChange={(e) => {
                                        setYnlType(e)
                                        filterModule.setFieldsValue({valuesSelected:null})
                                      }}
                                    options={[
                                        {label:`Todos`, value:'ALL'},
                                        {label:`Con sitio ${instance?.name}`, value:''},
                                        {label:`Sin sitio`,value:'NULL'}
                                    ]}
                                />
                                </Form.Item>
                            </Col>
                        ): null}
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
  
export default connect(mapState,{getPersons, getReportPerson,getStreakTop, getDataGraphGoal, getTopGoals})(FilterDashboardPersonal);