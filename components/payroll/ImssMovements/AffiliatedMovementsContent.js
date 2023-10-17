import { Alert, Button, Col, DatePicker, Row, Select, Spin, message, Input,Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectPatronalRegistration from '../../selects/SelectPatronalRegistration'
import AfilliateMovements from '../../../pages/business/AfilliateMovements'
import { useRouter } from 'next/router'
import WebApiPeople from '../../../api/WebApiPeople'
import GenericModal from '../../modal/genericModal'
import moment from 'moment'
import locale from "antd/lib/date-picker/locale/es_ES";
import {
    CloudUploadOutlined,
    UploadOutlined
} from '@ant-design/icons';

const AffiliatedMovementsContent = ({currentNodeId, ...props}) => {

    const router = useRouter();

    const [patronalSelected, setPatronalSelected] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [showModalImport, setShowModalIMport] = useState(false);
    const [scraperActive, setScraperActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disabledBimester, setDisabledBimester] = useState(true);
    const [bimester, setBimester] = useState(null);
    const [year, setYear] = useState("");
    const [refreshTable,setRefreshTable] = useState(false)
    const [fileList, setFileList] = useState([]);

    const validateScraper = async () => {
        try{
            let valid = await WebApiPeople.getCredentials('infonavit', patronalSelected)
            const results = valid?.data?.results
            setScraperActive(results?.credentials)
        }catch (e){

        }

        //credentials
    }


    const propsUpload = {
        accept:'.csv',
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        multiple:false,
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };






    useEffect(() => {
      if(patronalSelected){
          validateScraper()
      }
    }, [patronalSelected])

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
          setRefreshTable(true);
        }
    };


    const importDataMovements = async () => {
        try {
            setShowModalIMport(false);
            setLoading(true);
            let period = moment(year).format("YYYY").slice(2, 4).concat(bimester);
            const formData = new FormData();
            formData.append('year', moment(year).format("YYYY").slice(2, 4))
            formData.append('month', bimester)
            formData.append('node', currentNodeId)
            formData.append('patronal_registration', patronalSelected)
            formData.append('File', fileList)

            const syncMovements = await WebApiPeople.importDataMovements(formData);
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
            setRefreshTable(true);
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
                patronalSelected && 
                <Button
                    onClick={() => setShowModal(true)}
                    form="formGeneric"
                    htmlType="submit"
                    style={{ marginBottom: "20px" }}
                >
                    Sincronizar / Solicitar
                </Button>
              }
              {
                patronalSelected &&
                <Button
                    onClick={() => setShowModalIMport(true)}
                    style={{ marginBottom: "20px" }}
                >
                    <CloudUploadOutlined /> Importar datos
                </Button>
              }
            </Col>
            <Col span={24}>
                { patronalSelected && 
                    <>{
                        // !scraperActive  ?
                        //     <Alert
                        //     description={<>No se encuentra la configuración de Infonavit para este Reg. Patronal.  <br/>
                        //     <a onClick={()=> router.push("/business/patronalRegistrationNode") } >Configuralo aquí</a> </>}
                        //     type="warning"
                        //     showIcon
                        //     />
                        // :
                        <>
                            <Spin spinning={loading}>
                                <AfilliateMovements
                                    refreshTable={refreshTable}
                                    onFinishRefreshTable={()=>setRefreshTable(false)}
                                    id={patronalSelected}
                                    node={currentNodeId}
                                />
                            </Spin>
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




        <GenericModal
            visible={showModalImport}
            setVisible={() => setShowModalIMport(false)}
            title="Importar movimientos"
            actionButton={() => importDataMovements()}
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

                        <br/>
                        <Upload {...propsUpload}>
                            <Button icon={<UploadOutlined />}>Clic para seleccionar un archivo</Button>
                        </Upload>

                    </div>
                </Col>
            </Row>
        </GenericModal>

    </>
  )
}

export default AffiliatedMovementsContent