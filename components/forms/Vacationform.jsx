import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Input,
  Image,
  InputNumber,
  DatePicker,
  Select, message
} from "antd";
import moment from "moment";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import WebApiPeople from "../../api/WebApiPeople";
import { ruleRequired } from "../../utils/rules";
import { getDifferenceDays, getFullName } from "../../utils/functions";
import locale from "antd/lib/date-picker/locale/es_ES";
import { connect } from "react-redux";
import webApiPeople from "../../api/WebApiPeople";

const Vacationform = ({edit = false,...props}) => {
  const { Title } = Typography;

  const [formVacation] = Form.useForm();
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [listPersons, setListPersons] = useState([]);
  const [nonWorkingDays, setNonWorkingDays] = useState(null)
  const [nonWorkingWeekDays, setNonWorkingWeekDays] = useState(null)
  const [daysToRequest, setDaysToRequest] = useState(0)

  const changePerson = async (value) => {
    if (value) {
      let index = await getCollaborator(value);
     // debugger;
      if (index) {
        setAvailableDays(index.available_days_vacation);
        formVacation.setFieldsValue({
          antiquity: index.antiquity,
          availableDays: index.available_days_vacation,
          dateOfAdmission: index.date_of_admission
            ? moment(index.date_of_admission).format("DD-MM-YYYY")
            : null,
          immediate_supervisor: index?.immediate_supervisor ? index?.immediate_supervisor?.id : null,
        });
        formVacation.setFieldsValue({
          job: index.work_title ? index.work_title.job.name : null,
        });

        setUrlPhoto(index.photo ? index.photo : null);
      }
    } else {
      formVacation.setFieldsValue({
        antiquity: null,
        availableDays: null,
        dateOfAdmission: null,
        job: null,
        immediate_supervisor:null
      });
      setUrlPhoto(null);
    }
  };

  const getCollaborator = async (id) => {
    let collaborator = {};
    let response = await WebApiPeople.getPerson(id);

    if (response.status == 200) {
      collaborator = response.data;
    }
    return collaborator;
  };

  useEffect(() => {
    if(props.currentNode){
      getListPersons(props.currentNode.id)
      getNonWorkingDays(props.currentNode.id)
      getWorkingWeekDays(props.currentNode.id)
    }
  }, [props.currentNode]);

  const getListPersons = async (node_id) => {
    let data = {
      node: node_id
    }
    try {
      let response = await WebApiPeople.filterPerson(data);
      setListPersons([]);
      let persons = response.data.map((a) => {
        a.key = a.khonnect_id;
        return a;
      });
      setListPersons(persons);
    } catch (error) {
      setListPersons([]);
      console.log(error);
    }
  };

  const validateImmediateSupervisor = (id) => ({
    validator(rule, value) {
      if (value != id) {
        return Promise.resolve();
      }
      return Promise.reject("No se puede elegir al mismo usuario como jefe inmediato");
    },
  });

  useEffect(() => {
    if (props.details) {
      // changePerson(props.details.collaborator.id);
      setStartDate(props.details.departure_date);
      setEndDate(props.details.return_date);
     // debugger;
      setAvailableDays(props.details.available_days_vacation);
      formVacation.setFieldsValue({
        person: props.details.collaborator
          ? props.details.collaborator.id
          : null,
        khonnect_id: props.details.collaborator
          ? props.details.collaborator.khonnect_id
          : null,
        days_requested: props.details.days_requested,
        antiquity: props.details.collaborator
          ? props.details.collaborator.antiquity
          : null,
        availableDays: props.details
          ? props.details.available_days_vacation
          : null,
        dateOfAdmission: props.details.collaborator
          ? moment(props.details.collaborator.date_of_admission).format(
              "DD-MM-YYYY"
            )
          : null,
        departure_date: props.details.departure_date
          ? moment(props.details.departure_date, "YYYY-MM-DD")
          : null,
        return_date: props.details.return_date
          ? moment(props.details.return_date, "YYYY-MM-DD")
          : null,
        job:
          props.details && props.details.work_title
            ? props.details.work_title.job.name
            : null,
        immediate_supervisor:
          props.details && props.details.immediate_supervisor
          ? props.details.immediate_supervisor.id
          : null,
      });

      setUrlPhoto(
        props.details.collaborator && props.details.collaborator.photo
          ? props.details.collaborator.photo
          : null
      );
    }
  }, [props.details]);

  const changeDepartureDate = (date, dateString) => {
    setStartDate(dateString);

    setEndDate(null)
    setDaysToRequest(0)
    formVacation.setFieldsValue({
      return_date: '',
      days_requested: ''
    })
  };

  const onEndDateChange = (date, dateString) => {
    getWorkingDaysFromRange(startDate, dateString)
  }

  // Recupera el número de días laborables entre un rango de fecha especificado
  const getWorkingDaysFromRange = async (start, end) =>{
    try{
      let params = {
        node_id: props.currentNode.id,
        start_date: moment(start).format('YYYY-MM-DD'),
        end_date: moment(end).format('YYYY-MM-DD')
      }
      let response = await webApiPeople.getWorkingDaysFromRange(params)
      const total_days = response.data.total_days

      setEndDate(end)
      setDaysToRequest(total_days)

      formVacation.setFieldsValue({
        return_date: moment(end),
        days_requested: total_days,
      })

      if(total_days > availableDays){
        message.error('Los días solicitados no deben ser mayor a los días diponibles.')
      }
    }catch (e) {
      console.log(e)
    }
  }

  const getNonWorkingDays = async (node_id) =>{
    try{
      let params = {
        node: node_id,
        limit: 1000,
      }

      let response = await webApiPeople.getNonWorkingDays(params)
      const data = response.data

      let dates = data.results.map(e => e.date)
      setNonWorkingDays(dates)
    }catch (e) {
      console.log(e)
    }
  }

  const getWorkingWeekDays = async (node_id) =>{
    try{
      let response = await webApiPeople.getWorkingWeekDays(node_id)
      const data = response.data
      const workingWeekDays = data.results.length > 0 ? data.results[0] : []

      // Obtenemos los días no laborables de la semana
      let _days = []
      Object.keys(workingWeekDays).forEach(key => {
        if(workingWeekDays[key] === false){
          _days.push(key)
        }
      })
      setNonWorkingWeekDays(_days)
    }catch (e) {
      console.log(e)
    }
  }

  const getDisabledStartDates = (current) =>{
    return nonWorkingWeekDays.includes(moment(current).locale('en').format('dddd').toLowerCase())
          || nonWorkingDays.includes(moment(current).format('YYYY-MM-DD'))
  }

  const getDisabledEndDates = (current) => {
    let _minDate =  moment()
    return current < moment(startDate)
        ||nonWorkingWeekDays.includes(moment(current).locale('en').format('dddd').toLowerCase())
        || nonWorkingDays.includes(moment(current).format('YYYY-MM-DD'))
  }

  return (<>{nonWorkingWeekDays && nonWorkingDays ?
    <Form form={formVacation} layout="vertical" onFinish={props.onFinish}>
      <Row>
        <Col span={20} offset={4}>
          <Title key="dats_gnrl" level={4}>
            Solicitud
          </Title>
        </Col>
        <Col span={4}>
          {urlPhoto ? (
            <Image style={{ width: "80%" }} src={urlPhoto} />
          ) : (
            <Image
              style={{ width: "80%" }}
              src={"error"}
              fallback="data:image/png;base64,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"
            />
          )}
        </Col>
        <Col span={20} style={{ padding: 20 }}>
          <Row gutter={24}>
            <Col sm={24} md={12} lg={12}>
              <Form.Item rules={[ruleRequired]}>
                <SelectCollaborator
                  label="Colaborador"
                  name="person"
                  onChange={changePerson}
                  isDisabled={edit ? true : false}
                  showSearch={true}
                  placeholder={"Seleccione"}
                  // setAllPersons={setAllPersons}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                label="Puesto"
                name="job"
                readOnly
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="departure_date"
                label="Fecha inicio"
                rules={[ruleRequired]}
              >
                <DatePicker
                  key="departure_date"
                  style={{ width: "100%" }}
                  onChange={changeDepartureDate}
                  disabled={availableDays <= 0}
                  locale = { locale }
                  disabledDate = {getDisabledStartDates}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="return_date"
                label="Fecha fin"
                rules={[ruleRequired]}
              >
                <DatePicker
                  key="return_date"
                  style={{ width: "100%" }}
                  onChange={onEndDateChange}
                  disabled={!startDate}
                  locale = { locale }
                  disabledDate = {getDisabledEndDates}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="days_requested"
                label="Días solicitados"
                rules={[ruleRequired]}
              >
                <InputNumber
                  min={1}
                  max={availableDays}
                  style={{ width: "100%" }}
                  // onChange={sumDays}
                  /*disabled={availableDays > 0 ? false : true}*/
                    disabled={true}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item name="availableDays" label="Días disponibles">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                label="Jefe inmediato"
                name="immediate_supervisor"
                rules={[
                 {
                  required: true,
                  message: "Este campo es requerido, esta información la puedes asignar desde el expediente de la persona",
                }
                  // validateImmediateSupervisor(props?.details?.collaborator?.id)
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  disabled={true}
                  >
                    { listPersons.length > 0 && listPersons.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {getFullName(item)}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                key="cancel"
                onClick={props.onCancel}
                disabled={props.sending}
                style={{ padding: "0 50px", margin: "0 10px" }}
              >
                Cancelar
              </Button>
              <Button
                key="save"
                htmlType="submit"
                loading={props.sending}
                type="primary"
                style={{ padding: "0 50px", margin: "0 0 0 10px" }}
                disabled={availableDays <= 0 || daysToRequest === 0 || daysToRequest > availableDays }
              >
                {props.edit ? "Actualizar" : "Guardar"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
 :null }</>);
};

const mapState = (state) => {
  return {
      currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(Vacationform);
