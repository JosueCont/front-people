import { Divider, Space, Row, Button, Tooltip, Spin, Table, Modal, Form, Col, Input, DatePicker, Select, message } from "antd"; 
import { EditOutlined, SyncOutlined, HistoryOutlined, WarningOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import locale from "antd/lib/date-picker/locale/es_ES";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import { connect } from "react-redux";
import {
  fourDecimal,
  minLengthNumber,
  onlyNumeric,
  ruleRequired,
} from "../../../utils/rules";
import { InfonavitDiscountType, FACTOR_SDI } from "../../../utils/constant";


const CreditType = [
  { value: 1, label: "Crédito Tradicional" },
  { value: 2, label: "Crédito Apoyo INFONAVIT" },
  { value: 3, label: "Credito Cofinanciado 08" },
];

const InfonavitMovementype = [
  { value: 1, label: "Inicio Descuento" },
  { value: 2, label: "Suspensión Descuento" },
  { value: 3, label: "Modificación Tipo Descuento" },
  { value: 4, label: "Modificación Valor Descuento" },
  { value: 5, label: "Modificación de Número de Crédito" },
];

let errorExceptionOne = "La persona cuenta con crédito infonavit";
let errorExceptionTwo = "La persona no cuenta con crédito";


const ImssInfonavit = ({person, person_id = null, userInfo=null, refreshtab=false, node, ...props })=>{
    const [loadingTable, setLoadingTable] = useState(false);
    const [disabledStartDate, setDisabledStartDate] = useState(false);
    const [showModalHistory, setShowModalHistory] = useState(false); 
    const [formInfonavitManual] = Form.useForm();
    const [disabledNumber, setDisabledNumber] = useState(false);
    const [disabledCreditType, setDisabledCreditType] = useState(true);
    const [disabledStatus, setDisabledStatus] = useState(false);
    const [disabledMovementType, setDisabledMovementType] = useState(false);
    const [disabledDiscountType, setDisabledDiscountType] = useState(false);
    const [disabledDiscountValue, setDisabledDiscountValue] = useState(false);
    const [existCredit, setExistCredit] = useState(null);
    const [movementTypes, setMovementTypes] = useState([]);
    const [isNewRegister, setIsNewRegister] = useState(false);
    const [infonavitCredit, setInfonavitCredit] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isSuspension, setIsSuspension] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [updateInfonavit, setUpdateInfonavit] = useState(null);
    const [deleteInfonavit, setDeleteInfonavit] = useState(null); 
    const [loadingIMSS, setLodingIMSS] = useState(false);
    const [nss, setNSS] = useState(null);
    const [showModalDelete, setShowModalDelete] = useState(false); 
    const [updateCredit, setUpdateCredit] = useState(null);


    useEffect(()=>{
      if(refreshtab){
        localUserCredit()
        props.onFinishRefresh()
      }
    },[refreshtab])

    useEffect(() => {
      setMovementTypes(InfonavitMovementype);
      person_id && localUserCredit() && getInfo();
    }, [person_id]);

    useEffect(() => {
      if (updateInfonavit) {
        formInfonavitManual.setFieldsValue({
          folio: updateInfonavit.folio,
          start_date: updateInfonavit.start_date
            ? moment(updateInfonavit.start_date)
            : null,
          start_date_movement: updateInfonavit.start_date_movement
            ? moment(updateInfonavit.start_date_movement)
            : null,
          number: updateInfonavit.number,
          type: updateInfonavit.type,
          status: updateInfonavit.status,
          discount_type: updateInfonavit.discount_type
            ? updateInfonavit.discount_type
            : null,
          discount_value:
            updateInfonavit.discount_value > 0
              ? updateInfonavit.discount_value
              : null,
          discount_suspension_date: updateInfonavit.discount_suspension_date
            ? moment(updateInfonavit.discount_suspension_date)
            : null,
          movement: updateInfonavit.movement != 1 ? updateInfonavit.movement : "",
        });
        if (updateInfonavit.movement == 1) {
          setIsNewRegister(true);
          setMovementTypes(InfonavitMovementype);
  
          // Campos bloqueados
          setDisabledStartDate(false);
          setDisabledNumber(false);
          // setDisabledCreditType(false);
          setDisabledStatus(false);
          setDisabledMovementType(true);
          setDisabledDiscountType(false);
          setDisabledDiscountValue(false);
        } else {
          let choises_type = InfonavitMovementype.filter(
            (item) => item.value > 1
          );
          setMovementTypes(choises_type);
          setDisabledStartDate(true);
          setDisabledNumber(true);
          // setDisabledCreditType(true);
          setDisabledStatus(false);
          setDisabledMovementType(true);
          setDisabledDiscountType(true);
          setDisabledDiscountValue(true);
        }
        setModalVisible(true);
      }
    }, [updateInfonavit]);

    useEffect(()=>{
      if(updateCredit && !!updateCredit.id){
        return setNSS(updateCredit.nss); 
      }
      setNSS(person.imss); 

    },[updateCredit]); 

    useEffect(() => {
      if (isNewRegister) {
        formInfonavitManual.setFieldsValue({
          movement: 1,
          type: 1,
        });
      }
    }, [isNewRegister]);

    const localUserCredit = async () => {
      setLodingIMSS(true);
      try {
        let response = await WebApiPayroll.getPersonalCredits(person_id);
        setUpdateCredit(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLodingIMSS(false);
      }
    };
  
    const cancelDelete = () => {
      setShowModalDelete(false); 
      setDeleteInfonavit(null); 
    }

    const deleteInfonavitByID = async () => {
      if(!!!deleteInfonavit) return; 
      const {id} = deleteInfonavit; 
      try {
        setLodingIMSS(true)
        const res = await WebApiPayroll.deleteInfonavit(id);
        setLodingIMSS(true)
        localUserCredit()
        cancelDelete()
      } catch (error) {
        console.log('=>>>>')
      }
      finally{
        getInfo();
      }
      /* console.log('updateCredit', updateCredit) */
    }

    const getInfo = async () => {
      setLoadingTable(true);
      try {
        let response = await WebApiPayroll.getUserCredits(person_id);
        let credit_config = response.data.find((elem) => elem.is_active);
        setExistCredit(credit_config);
        setIsNewRegister(false);
        setInfonavitCredit(response.data);
      } catch (error) {
        setIsNewRegister(true);
        console.log(error);
      } finally {
        setLoadingTable(false);
      }
    };

    const newInfonavit = async (values) => {
      values.person_id = person_id;
  
      values.start_date = moment(values.start_date).format("YYYY-MM-DD");
  
      if (values.movement != 2) {
        values.start_date_movement = moment(values.start_date_movement).format(
          "YYYY-MM-DD"
        );
      } else {
        values.start_date_movement = moment(
          values.discount_suspension_date
        ).format("YYYY-MM-DD");
      }
      values.discount_suspension_date = values.discount_suspension_date
        ? moment(values.discount_suspension_date).format("YYYY-MM-DD")
        : null;
  
      setLoadingModal(true);
  
      try {
        let response = updateInfonavit
          ? await WebApiPayroll.editInfonavit(updateInfonavit.id, values)
          : await WebApiPayroll.addInfonavit(values);
        (response &&
          updateInfonavit &&
          message.success("Editado Exitosamente")) ||
          message.success("Agregado Exitosamente");
      } catch (error) {
        if (error?.response?.data?.message)
          message.error(error.response.data.message);
        else message.error(messageError);
      } finally {
        setLoadingModal(false);
        onModalCancel();
        getInfo();
        setIsSuspension(false);
      }
    };

    const onModalCancel = () => {
      setUpdateInfonavit(null);
      setModalVisible(false);
      formInfonavitManual.resetFields();
      setIsNewRegister(false);
      setIsSuspension(false);
    };

    const changeMovement = (value) => {
      if (value) {
        switch (value) {
          case 2:
            // suspensión
            setIsSuspension(true);
            setDisabledNumber(true);
            setDisabledDiscountType(true);
            setDisabledDiscountValue(true);
            break;
          case 3:
            // Modificación de tipo descuento
            setDisabledDiscountType(false);
            setDisabledDiscountValue(false);
            setDisabledNumber(true);
            setIsSuspension(false);
            break;
          case 4:
            // Modificación de valor descuento
            setDisabledNumber(true);
            setDisabledDiscountType(true);
            setDisabledDiscountValue(false);
            setIsSuspension(false);
            break;
          case 5:
            // Modificación de Número de crédito
            setDisabledNumber(false);
            setDisabledDiscountValue(true);
            setDisabledDiscountType(true);
            setIsSuspension(false);
            break;
          default:
            break;
        }
      }
    };
  

    const userCredit = async () => {
        setLoadingTable(true);
        let data = new FormData();
        let patronal_registration = person?.patronal_registration;
    
        data.append("node", node);
        data.append("person", person_id);
        data.append("patronal_registration", patronal_registration);
        data.append('requesting_user', userInfo.id); 
        WebApiPayroll.getInfonavitCredit(data)
          .then((response) => {
            setLoadingTable(false);
            response &&
              response.data &&
              response.data.message &&
              response.data.message !== "" &&
              message.success(response.data.message);
            getInfo();
          })
          .catch((error) => {
            setLoadingTable(false);
            let errorMsg = error.response.data.message ?? "";
            if (errorMsg === errorExceptionOne || errorMsg === errorExceptionTwo) {
              message.error(errorMsg);
            } else {
              message.error(`La consulta de información no pudo ser exitosa, intente nuevamente, 
              recuerde que este proceso está  vinculado a la disponibilidad del servicio de infonavit.`);
            }
          })
          .finally(() => {
            getInfo();
          });
    };


    const colCredit = [
        {
          title: "Fecha de inicio",
          dataIndex: "start_date",
          key: "start_date",
          // width: 100,
        },
        {
          title: "Folio",
          dataIndex: "folio",
          key: "folio",
          // width: 100,
        },
        {
          title: "Número",
          dataIndex: "number",
          key: "number",
          // width: 100,
        },
        {
          title: "Tipo de descuento",
          dataIndex: "discount_type",
          // width: 100,
          render: (item) => {
            return (
              <div>
                {item == 1
                  ? "Porcentaje"
                  : item == 2
                  ? "Cuota fija mensual en Pesos"
                  : item == 3
                  ? "Cuota fija mensual en VSM"
                  : ""}
              </div>
            );
          },
        },
        {
          title: "Valor de descuento",
          key: "discount_value",
          render: (item) => 
            item?.discount_type === 2 ?
            Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(item?.discount_value)
            : item.discount_value
        },
        {
          title: "Movimiento",
          dataIndex: "movement",
          // key: "movement",
          render: (item) => {
            return (
              <div>
                {item == 1
                  ? "Inicio Descuento"
                  : item == 2
                  ? "Suspensión Descuento"
                  : item == 3
                  ? "Modificación Tipo Descuento"
                  : item == 3
                  ? "Modificación Valor Descuento"
                  : "Modificación de Número de Crédito"}
              </div>
            );
          },
        },
        // {
        //   title: "Estatus",
        //   dataIndex: "status",
        //   key: "status",
        //   // width: 100,
        // },
        {
          title: "Opciones",
          render: (item, record) => {
            return (
              <div>
                <Row gutter={16}>
                  <Col
                    className="gutter-row"
                    offset={1}
                    style={{ padding: "0px 20px" }}
                  >
                    {record.is_active && (
                      <div style={{display:'flex', gap:'1em', justifyContent:'center'}}>
                      <Tooltip title="Editar">
                        <EditOutlined
                          style={{ fontSize: "20px" }}
                          onClick={() => setUpdateInfonavit(item)}
                        />
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <DeleteOutlined
                        style={{ fontSize: "20px" }}
                        onClick={()=> setDeleteInfonavit(item)}
                        /> 
                      </Tooltip>
                      </div>
                      
                    )}
                  </Col>
                </Row>
              </div>
            );
          },
        },
      ];

      const columnLogs = [
        {
          title: "Solicitado por",
          key: "requesting_user",
          render: (row) => <>
            {row?.requesting_user?.first_name}{" "}{row.requesting_user?.flast_name}
          </>
        },
        {
          title: "Fecha",
          key: "date",
          dataIndex: ['timestamp'],
          render: (date) => <>{moment(date).format("DD/MM/YYYY HH:mm")}</>
        },
        {
          title: "Respuesta",
          key: "response",
          dataIndex: "response_msg"
        }
      ]


      const openModalInfonavit = () => {
        if (existCredit) {
          formInfonavitManual.setFieldsValue({
            start_date: moment(existCredit.start_date),
            number: existCredit.number,
            type: existCredit.type,
            status: existCredit.status,
            discount_type: existCredit.discount_type,
            discount_value: existCredit.discount_value,
          });
          let choises_type = InfonavitMovementype.filter((item) => item.value > 1);
          setMovementTypes(choises_type);
    
          //Campos bloqueados
          setDisabledStartDate(true);
          setDisabledNumber(true);
          // setDisabledCreditType(true);
          setDisabledStatus(true);
          setDisabledMovementType(false);
          setDisabledDiscountType(true);
          setDisabledDiscountValue(true);
        } else {
          setMovementTypes(InfonavitMovementype);
          formInfonavitManual.setFieldsValue({
            type: 1,
            status: "Vigente",
            movement: 1,
          });
        }
        setIsSuspension(false);
        setModalVisible(true);
      };
    
      const getInfonavitLogs =  async () => {
        setShowModalHistory(true)
        setLoadingLogs(true)
        try {
          const res = await WebApiPayroll.getLogsInfonavit(person_id);
          if(res.status === 200){
            setLogs(res.data)
          }
          setLoadingLogs(false)
        } catch (error) {
          setLoadingLogs(false)
          console.log('error', error)
        }

      }

      const closeModalLogs = () => {
        setShowModalHistory(false)
        setLogs([])
      }



    return(
        <>

        <Divider orientation="left"> <img src={"/images/logoinfonavit.png"} width={20} /> INFONAVIT</Divider>

        <br/>
        <Row justify="space-between">
        <div>
            <Space>
            <Button
                type="primary"
                loading={loadingTable}
                onClick={openModalInfonavit}
            >
                Nuevo
            </Button>
            {nss && (
                <Tooltip title="Obtener datos infonavit">
                <Button onClick={() => userCredit()} loading={loadingTable}>
                    <SyncOutlined style={{ fontSize: "20px" }} />
                </Button>
                </Tooltip>
            )}
            <Tooltip title="Ver registros de consultas">
                <Button onClick={getInfonavitLogs}>
                <HistoryOutlined style={{ fontSize: "20px" }}/>
                </Button>
            </Tooltip>
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
        <Modal
        title="INFONAVIT manual"
        visible={modalVisible}
        onCancel={() => onModalCancel()}
        footer={[]}
      >
        <Form
          layout="vertical"
          form={formInfonavitManual}
          onFinish={newInfonavit}
          className="form-details-person"
        >
          <Row>
            <Col span={11}>
              <Form.Item label="Folio" name="folio">
                <Input maxLength={20} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Fecha de inicio"
                name="start_date"
                rules={[ruleRequired]}
              >
                <DatePicker
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                  disabled={disabledStartDate}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Tipo de crédito" name="type">
                <Select
                  allowClear
                  disabled={disabledCreditType}
                  options={CreditType}
                  initialValue={1}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Número"
                name="number"
                rules={[ruleRequired, onlyNumeric]}
              >
                <Input maxLength={10} disabled={disabledNumber} />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Estatus" name="status">
                <Select
                  allowClear
                  disabled={disabledStatus}
                  initialValue={"Vigente"}
                >
                  <Select.Option value={"Vigente"} key={"Vigente"}>
                    Vigente
                  </Select.Option>
                  <Select.Option value={"Sin crédito"} key={"Sin crédito"}>
                    Sin crédito
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de movimiento"
                name="movement"
                rules={[ruleRequired]}
              >
                <Select
                  allowClear
                  disabled={disabledMovementType}
                  options={movementTypes}
                  onChange={changeMovement}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={11} offset={2}>
              {isSuspension && (
                <Form.Item
                  label="Fecha de suspensión de descuento"
                  name="discount_suspension_date"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    locale={locale}
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}
              {!isSuspension && (
                <Form.Item
                  label="Fecha de inicio de movimiento"
                  name="start_date_movement"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    locale={locale}
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de descuento"
                name="discount_type"
                rules={[ruleRequired]}
              >
                <Select
                  allowClear
                  options={InfonavitDiscountType}
                  disabled={disabledDiscountType}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                label="Valor de descuento"
                name="discount_value"
                maxLength={8}
                rules={[fourDecimal, ruleRequired]}
              >
                <Input
                  type="number"
                  disabled={disabledDiscountValue}
                  maxLength={10}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 30 }}>
            <Col>
              <Button
                key="back"
                onClick={() => {
                  onModalCancel();
                }}
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
                  loading={loadingModal}
                >
                  {(updateInfonavit && "Editar") || "Registrar"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal 
        visible={showModalHistory}
        width={800}
        footer={[
          <Button key="close" onClick={closeModalLogs}>
            Ok
          </Button>,
        ]}
      >
        <Table 
          loading={loadingLogs}
          columns={columnLogs}
          dataSource={logs}
          pagination={false}
        />
      </Modal>
      <Modal
        title="Eliminar"
        visible={!!deleteInfonavit}
        onOk={deleteInfonavitByID}
        onCancel={cancelDelete}
        okText="Sí, eliminar"
        cancelText="Cancelar"
      >
        Al eliminar este registro, perderá todos los datos de infonavit relacionados a la persona de
        manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal>
        </>
    )
}

const mapState = (state) => {
  return {
    userInfo: state.userStore.user
  };
};




export default connect(mapState)(ImssInfonavit); 