import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Divider,
  Tooltip,
  Space
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {typeEmployee, typeSalary, reduceDays, FACTOR_SDI} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import SelectMedicineUnity from "../../selects/SelectMedicineUnity";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {fourDecimal, minLengthNumber, onlyNumeric, ruleRequired} from "../../../utils/rules";

const FormImssInfonavit = ({ person, person_id, node }) => {
  
  const { Title } = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [formInfonavitManual] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingIMSS, setLodingIMSS] = useState(false);
  const [infonavitCredit, setInfonavitCredit] = useState([]);
  const [ updateCredit, setUpdateCredit ] = useState(null)
  const [ updateInfonavit, setUpdateInfonavit ] = useState(null)
  const [ isEdit, setIsEdit ] = useState(false)
  const [ modalVisible, setModalVisible ] = useState(false)
  const [ nss, setNSS ] = useState(null)
  const [ loadingModal, setLoadingModal ] = useState(false)
  const daily_salary = Form.useWatch('sbc', formImssInfonavit);
  //const [integratedDailySalary, setIntegratedDailySalary] = useState(0);

  useEffect(() => {
    person_id && localUserCredit() && getInfo();
  }, [person_id]);

  useEffect(() =>{
    if (updateCredit) {
      setIsEdit(true)
      formImssInfonavit.setFieldsValue({
        employee_type: updateCredit.employee_type,
        salary_type: updateCredit.salary_type,
        reduce_days: updateCredit.reduce_days,
        movement_date: moment(updateCredit.movement_date),
        family_medical_unit: updateCredit.family_medical_unit.id,
        nss: updateCredit.nss,
        sbc: updateCredit.sbc

      })
      setNSS(updateCredit.nss)
    } else {
        formImssInfonavit.setFieldsValue({
          nss: person.imss
        })
        setNSS(person.imss)
    }

  },[updateCredit])


  useEffect(()=>{
    console.log(daily_salary)
    if(daily_salary){
      formImssInfonavit.setFieldsValue({
          integrated_daily_salary:(daily_salary*FACTOR_SDI).toFixed(2)
        })
    }else{
      formImssInfonavit.setFieldsValue({
        integrated_daily_salary:0
      })
    }
  },[daily_salary])

  useEffect(() => {
    if(updateInfonavit){
      formInfonavitManual.setFieldsValue({
        start_date: moment(updateInfonavit.start_date),
        number: updateInfonavit.number,
        type: updateInfonavit.type,
        status: updateInfonavit.status
      })
      setModalVisible(true)
    }
  },[updateInfonavit])

  const formImmssInfonavitAct = (values) => {
    setLoadingTable(true)

    values.person = person_id
    values.movement_date = values.movement_date ? moment(values.movement_date).format('YYYY-MM-DD') : ""
    values.modify_by = "System"
    values.patronal_registration = person?.branch_node? person.branch_node.patronal_registration.id    : ""
    console.log("Data", values);
    // funcion WEB API

    if(isEdit){


      WebApiPayroll.editIMSSInfonavit(updateCredit.id, values)
      .then((response) => {
        console.log('Response', response)
        message.success('Editado exitosamente')
        setLoadingTable(false)
        setIsEdit(false)  
      })
      .catch((error) => {
        console.log('Error -->', error)
        message.error('Error al editar')
        setLoadingTable(false)
      })

    } else {

      WebApiPayroll.saveIMSSInfonavit(values)
      .then((response) => {
        console.log('Response', response)
        message.success('Guardado exitosamente')
        setLoadingTable(false)
      })
      .catch((error) => {
        console.log('Error -->', error.message)
        message.error('Error al guardar')
        setLoadingTable(false)
      })
    }
  };

  const userCredit = async () => {
    
    setLoadingTable(true);
    let data = new FormData()
    let patronal_registration = person?.branch_node?.patronal_registration?.id
    
    data.append("node", node)
    data.append("person", person_id)
    data.append("patronal_registration", patronal_registration)

    WebApiPayroll.getInfonavitCredit(data)
      .then((response) => {
        console.log('Response manual', response)
        setLoadingTable(false);
        response &&
        response.data &&
        response.data.message &&
        response.data.message !== '' &&
        message.success(response.data.message)
        getInfo()
      })
      .catch((error) => {
        setLoadingTable(false);
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message !== "" &&
        error.response.data.message === "La persona cuenta con crédito infonavit" &&
        message.error(error.response.data.message) || 
        message.error(`La consulta de información no pudo ser exitosa, intente nuevamente, 
        recuerde que este proceso está  vinculado a la disponibilidad del servicio de infonavit.`)

      })
      .finally(() => {
        getInfo()
      })
  };

  const getInfo = async () => {
    setLoadingTable(true)
    try {
      let response = await WebApiPayroll.getUserCredits(person_id)
      console.log('Se esta haciendo el get')
      setInfonavitCredit(response.data)
    } catch (error) {
      console.log('Error ===>', error)
    } finally {
      setLoadingTable(false)
    }
  }

  const localUserCredit = async () => {
    setLodingIMSS(true)
    try {
      let response = await WebApiPayroll.getPersonalCredits(person_id)
      setUpdateCredit(response.data)
    } catch (error) {
      console.log('Error', error)
    } finally {
      setLodingIMSS(false)
    }
  }

  const newInfonavit = async (values) => {

          
    values.person_id = person_id
    values.start_date = moment(values.start_date).format('YYYY-MM-DD')

    setLoadingModal(true)

    try {

        let response = updateInfonavit? await WebApiPayroll.editInfonavit(updateInfonavit.id, values) : await WebApiPayroll.addInfonavit(values)
        response && updateInfonavit && message.success('Editado Exitosamente') || message.success('Agregado Exitosamente')

      
    } catch (error) {
      console.log('Error', error)

    } finally {
      setLoadingModal(false)
      onModalCancel()
      getInfo()
    }

  }

  const colCredit = [
    {
      title: "Fecha de inicio",
      dataIndex: "start_date",
      key: "start_date",
      // width: 100,
    },
    {
      title: "Número",
      dataIndex: "number",
      key: "number",
      // width: 100,
    },
    {
      title: "Tipo de crédito",
      dataIndex: "type",
      key: "type",
      // width: 100,
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      // width: 100,
    },
    // {
    //   title: "Monto",
    //   dataIndex: "amount_payment",
    //   key: "amount_payment",
    //   width: 100,
    // },
    // {
    //   title: "Monto actual",
    //   dataIndex: "current_payment",
    //   key: "current_payment",
    //   width: 100,
    // },
    // {
    //   title: "Numero de pago",
    //   dataIndex: "number_payment",
    //   key: "number_payment",
    //   width: 100,
    // },
    // {
    //   title: "Ultima fecha de pago",
    //   dataIndex: "date_last_payment",
    //   key: "date_last_payment",
    //   width: 100,
    // },
    // {
    //   title: "Monto total",
    //   dataIndex: "total_amount",
    //   key: "total_amount",
    //   width: 100,
    // },
    {
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1} style={{ padding: '0px 20px' }}>
                <Tooltip title="Editar" >
                  <EditOutlined
                    style={{ fontSize: "20px" }}
                    onClick={() => setUpdateInfonavit(item)}
                  />
                </Tooltip>
              </Col>
              {/* <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    showModalDelete(item.id);
                  }}
                />
              </Col> */}
            </Row>
          </div>
        );
      },
    },
  ];

  const onModalCancel = () => {
    setUpdateInfonavit(null)
    setModalVisible(false)
    formInfonavitManual.resetFields()
  }

  return (
    <>
      <Spin tip="Cargando..."  spinning={loadingIMSS}>
        <Row>
          <Title style={{ fontSize: "20px" }}>IMSS</Title>
        </Row>
        <Form
          layout="vertical"
          form={formImssInfonavit}
          onFinish={formImmssInfonavitAct}
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="employee_type"
                label="Tipo de empleado"
                rules={[ruleRequired]}
              >
                <Select
                  options={typeEmployee}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="salary_type"
                label="Tipo de salario"
                rules={[ruleRequired]}
              >
                <Select
                  options={typeSalary}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="reduce_days"
                label="Semana o jornada reducida"
                rules={[ruleRequired]}
              >
                <Select
                  options={reduceDays}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="movement_date"
                label="Fecha de movimiento"
                rules={[ruleRequired]}
              >
                <DatePicker
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <SelectFamilyMedicalUnit />
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                  name="nss"
                  label="IMSS"
                  rules={[ruleRequired, onlyNumeric, minLengthNumber]}
              >
                <Input maxLength={11} />
              </Form.Item>
            </Col>

            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                  name="sbc"
                  label="Salario diario"
                  maxLength={13}
                  rules={[fourDecimal, ruleRequired]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                  name="integrated_daily_salary"
                  label="Salario diario integrado"
                  maxLength={13}
                  rules={[fourDecimal]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"}>
            {
              updateCredit && updateCredit.id? null : (
                <Form.Item>
                <Button 
                  loading={loadingIMSS} 
                  style = {{ marginRight: 20 }}
                  type="primary" 
                  htmlType="submit"
                  disabled = { updateCredit && updateCredit.id? true : false }
                >
                  Guardar
                </Button>
                </Form.Item>
              )
            }


            {/* <Form.Item>
              <Button 
                loading={loadingIMSS} 
                type="primary" 
                onClick={ () => userCredit() }
                // disabled = { updateCredit && updateCredit.is_registered? true : false }
              >
                sincronizar
              </Button>
            </Form.Item> */}
          </Row>
        </Form>

        <Divider />

        <Row justify='space-between'>
          <Title style={{ fontSize: "20px", marginBottom: 20 }}>INFONAVIT</Title>
          <div>
            <Space>
              <Button
                type='primary'
                onClick={ () => setModalVisible(true)}
              >
                Nuevo
              </Button>
              {
                nss &&
                
                <Tooltip title="sincronizar" >
                  <Button
                    onClick={() => userCredit()}
                    loading = { loadingTable }
                  >
                    <SyncOutlined
                      style={{ fontSize: "20px" }}
                    />
                  </Button>
                </Tooltip>
              }
            </Space>
          </div>
        </Row>

        <Spin tip="Cargando..." spinning={loadingTable}>
          <Table
            columns={colCredit}
            scroll={{
              x: true,
            }}
            rowKey="id"
            dataSource={infonavitCredit}
            locale={{
              emptyText: loadingTable
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          />
        </Spin>
      </Spin>
      <Modal
        title = "INFONAVIT manual"
        visible = { modalVisible }
        onCancel={() => onModalCancel()}
        footer={[]}
      >
        <Form
          layout="vertical"
          form={ formInfonavitManual }
          onFinish = { newInfonavit }
        >
          <Row>
            <Col span={11}>
              <Form.Item
                label = "Fecha de inicio"
                name = "start_date"
                rules={[ruleRequired]}
              >
                <DatePicker 
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                label = "Número"
                name = "number"
                rules={[ruleRequired, onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label = "Tipo de crédito"
                name = "type"
                rules={[ruleRequired]}
              >
                <Select
                 allowClear
                >
                  <Select.Option
                    value = "Crédito Tradicional"
                    key = "Crédito Tradicional"
                  >
                      Crédito Tradicional
                  </Select.Option>
                  <Select.Option
                    value = "Crédito Apoyo INFONAVIT"
                    key = "Crédito Apoyo INFONAVIT"
                  >
                      Crédito Apoyo INFONAVIT
                  </Select.Option>
                  <Select.Option
                    value = "Credito Cofinanciado 08"
                    key = "Credito Cofinanciado 08"
                  >
                      Credito Cofinanciado 08
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
            <Form.Item
                label = "Estatus"
                name = "status"
                rules={[ruleRequired]}
              >
                <Select
                  allowClear
                >
                  <Select.Option
                    value = {'Vigente'}
                    key = {'Vigente'}
                  >
                    Vigente
                  </Select.Option>
                  <Select.Option
                    value = {'Sin crédito'}
                    key = {'Sin crédito'}
                  >
                    Sin crédito
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end' style={{ marginTop: 30 }}>
            <Col>
              <Button
                key="back"
                onClick={ () => {
                  onModalCancel()
                  } 
                }
                style={{ padding: "0 10px", marginLeft: 15 }}
              >
              Cancelar
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  key="submit_modal"
                  type="primary"
                  htmlType="submit"
                  style={{ padding: "0 10px", marginLeft: 15 }}
                  loading = { loadingModal }
                >
                  {
                    updateInfonavit && "Editar" || "Registrar"
                  }
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default FormImssInfonavit;
