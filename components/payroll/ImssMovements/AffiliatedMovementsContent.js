import { Alert, Button, Col, DatePicker, Row, Select, Spin, message } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectPatronalRegistration from '../../selects/SelectPatronalRegistration'
import AfilliateMovements from '../../../pages/business/AfilliateMovements'
import { useRouter } from 'next/router'
import WebApiPeople from '../../../api/WebApiPeople'
import GenericModal from '../../modal/genericModal'
import moment from 'moment'
import locale from "antd/lib/date-picker/locale/es_ES";

const AffiliatedMovementsContent = ({currentNodeId, ...props}) => {

    const router = useRouter();

    const [patronalSelected, setPatronalSelected] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [scraperActive, setScraperActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disabledBimester, setDisabledBimester] = useState(true);
    const [bimester, setBimester] = useState(null);
    const [year, setYear] = useState("");

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
                            <Spin spinning={loading}>
                                <AfilliateMovements
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
    </>
  )
}

export default AffiliatedMovementsContent