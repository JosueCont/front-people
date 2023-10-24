import React, { useEffect, useState } from 'react'
import Cookie from "js-cookie";
import SelectPatronalRegistration from '../../selects/SelectPatronalRegistration'
import WithHoldingNotice from '../../../pages/business/WithHoldingNotice'
import GenericModal from '../../modal/genericModal'
import { useRouter } from 'next/router'
import { Alert, Button, Col, DatePicker, Row, Select, Spin, message, Tabs, Table, Modal } from 'antd'
import WebApiPeople from '../../../api/WebApiPeople'
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from 'moment'
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';

const WithholdingNoticesContent = ({ currentNodeId }) => {

  const router = useRouter();
  const { confirm } = Modal;
  const [loading,setLoading] = useState(false);
  const [patronalSelected, setPatronalSelected] = useState(null)
  const [scraperActive, setScraperActive] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [disabledBimester, setDisabledBimester] = useState(true);
  const [bimester, setBimester] = useState(null);
  const [year, setYear] = useState("");
  const [logData, setLogData] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [dataTable, setDataTable] = useState([])
  const [messageTable, setMessageTable] = useState("")
  const [lastRequest, setLastRequest] = useState(null)

  const validateScraper = async () => {
    let valid = await WebApiPeople.getCredentials('infonavit', patronalSelected)
    const results = valid?.data?.results
    console.log('result', results)
    setScraperActive(results?.credentials)
    //credentials
}

  useEffect(() => {
    if(patronalSelected){
      validateScraper()
    }
  }, [patronalSelected])

  const getnotices = async() => {
    setLoadingTable(true);
    try {
        let url = `?node_id=${currentNodeId}&patronal_registration_id=${patronalSelected}`;
        const notices = await WebApiPeople.getWithHoldingNotice(url);
        setLoadingTable(false);
        if(notices?.data?.message) {
            setMessageTable(notices?.data?.message)
        } else {
            setDataTable(notices?.data?.documents)
            setLogData(notices?.data?.logs)
            if (notices?.data?.logs){
              setLogData(notices.data.logs)
              let inProcess = notices.data.logs.filter(value=> value.status == "En proceso")
              if (inProcess.length > 0){
                setLastRequest(inProcess[0].start_time)
              }
            }
        }
    } catch (e) {
        console.log(e)
        setLoadingTable(false);
    }finally {
        setLoadingTable(false);
    }
}


  const changeYear = (value) => {
    if (value) {
      setYear(value);
      setDisabledBimester(false);
    } else {
      setDisabledBimester(true);
      setBimester(null);
    }
};

  const changeBimester = (value) => {
    if (value) {
        setBimester(value);
    }
  };

  const getOptions = () => {
    let options = [];
    let period = 1;
    for (period; period <= 6; period++) {
      options.push(
        <Option key={period.toString()} value={`0${period.toString()}`}>
          0{period}
        </Option>
      );
    }
    return options;
  };

  const confirmSyncUpData = () => {
    confirm({
      title: '¿Estás seguro de sincronizar o solicitar?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Si',
      cancelText: 'Cancelar',
      onOk() {
        syncUpData()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const syncUpData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(Cookie.get("token"));
      let dataSend = {
        patronal_registration_id: patronalSelected,
        node_id: currentNodeId,
        user_id: user.user_id
      };
      const syncData = await WebApiPeople.withHoldingNotice(dataSend);
      if (syncData?.data?.message) message.success(syncData?.data?.message);
    } catch (error) {
      let msg = "Ocurrio un error intente de nuevos.";
      if (error?.response?.data?.message) {
        msg = error?.response?.data?.message;
      }
      message.error(msg);

    } finally {
      setLoading(false);
    }
  };

  const verifyPeriod = async () => {
    try {
      setShowModal(false);
      setLoading(true);
      let period = moment(year).format("YYYY").slice(2, 4).concat(bimester);
      let data = {
        period,
        node: currentNodeId,
        patronal_registration: patronalSelected,
      };
      const syncMovements = await WebApiPeople.syncUpAfilliateMovements(data);
      if (syncMovements?.data?.message)
        message.success(syncMovements?.data?.message);
      else message.error("Hubo un problema, intentalo más tarde");
    } catch (e) {
      console.log(e?.response.data?.message);
      if (e?.response.data?.message) {
        message.error(e?.response.data?.message);
      } else {
        message.error("Hubo un problema, intentalo más tarde");
      }
    } finally {
      setLoading(false);
    }
};

  const columnsLogs = [
    {
      title: "Fecha de ejecución",
      dataIndex: "start_time",
      key:"start_time",
        width: 200
    },
    {
      title: "Fecha de finalización",
      dataIndex: "end_time",
      key:"end_time",
        width: 200
    },
    {
      title: "Autor",
      dataIndex: "author",
      key:"author",
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key:"status",
    },
    {
      title: "Mensaje",
      dataIndex: "message",
      key:"message",
    },
  ];

  return (
    <>
      <Row justify="space-between" style={{ paddingTop:20 }}>
            <Col>
                <SelectPatronalRegistration
                    currentNode={currentNodeId}
                    onChange={(value) => setPatronalSelected(value)}
                  />
            </Col>
            <Col>
              {
                lastRequest &&
                  <Alert
                  description={<><b>Se esta procesando una solicitud generada el {lastRequest}</b></>}
                  type="success"
                />
              }
            </Col>
            <Col>
              {
                patronalSelected &&
                  <Button
                      onClick={confirmSyncUpData}
                      form="formGeneric"
                      htmlType="submit"
                      style={{marginBottom:'20px'}}>
                    Sincronizar / Solicitar
                  </Button>
                // <Button
                //     onClick={() => setShowModal(true)}
                //     form="formGeneric"
                //     htmlType="submit"
                //     style={{ marginBottom: "20px" }}
                // >
                //     Sincronizar / Solicitar
                // </Button>
              }
            </Col>
            <Col span={24}>
                { patronalSelected && 
                    <>{
                      !scraperActive  ?    
                            <Alert
                            description={<>No se encuentra la configuración de Infonavit para este Reg. Patronal.  <br/>
                            <a onClick={()=> router.push("/business/patronalRegistrationNode") } >Configuralo aquí</a> </>}
                            type="warning"
                            showIcon
                            />
                        :
                        <>
                        <Button
                            onClick={getnotices}
                        >
                            <SyncOutlined spin={loadingTable} />
                        </Button>
                          <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Eventos finalizados" key="1" style={{padding:10}}>
                              <WithHoldingNotice
                                getnotices={getnotices}
                                loading={loadingTable}
                                data={dataTable}
                                message= {messageTable}
                              />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Logs" key="2" style={{padding:10}}>
                              <Spin tip="Cargando..." spinning={loadingTable}>
                                <Table
                                  columns={columnsLogs}
                                  dataSource={logData}
                                  pagination={{showSizeChanger:true}}
                                  locale={{
                                      emptyText: loadingTable
                                          ? "Cargando..."
                                          : message,
                                  }}
                                />
                                </Spin>
                            </Tabs.TabPane>
                          </Tabs> 
                        </>
                    }
                    </>
                }
            </Col>
      </Row>
      <GenericModal
            visible={showModal}
            setVisible={() => setShowModal(false)}
            title="Solicitar movimientos"
            actionButton={() => verifyPeriod()}
            width="30%"
            //disabledSave={disabeldSave}
        >
        <Row justify="center">
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <span>Año</span>
              <DatePicker
                style={{ width: "100%", marginBottom: "10px" }}
                onChange={changeYear}
                picker="year"
                moment={"YYYY"}
                disabledDate={(currentDate) =>
                  currentDate.year() > new Date().getFullYear()
                }
                placeholder="Selecciona año"
                locale={locale}
              />

              <span>Bimestre</span>
              <Select
                size="middle"
                key={"period"}
                disabled={disabledBimester}
                val={bimester}
                onChange={changeBimester}
                allowClear
                notFoundContent={"No se encontraron resultados."}
                showSearch
                optionFilterProp="children"
                placeholder="Selecciona bimestre"
              >
                {getOptions()}
              </Select>
            </div>
          </Col>
        </Row>
      </GenericModal>
    </>
  )
}

export default WithholdingNoticesContent