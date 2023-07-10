import { Global, css } from '@emotion/core'
import { Avatar, Badge, Button, Col, Divider, List, Popconfirm, Progress, Row, Space, Tag, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import WebApiPeople from '../api/WebApiPeople';
import { downLoadFileBlob, getDomain } from '../utils/functions'
import { API_URL_TENANT } from "../config/config";

import {FilePdfOutlined, SyncOutlined} from '@ant-design/icons';

import moment from 'moment';

const TruoraCheck = ({person, ...props}) => {

    const { Title, Text } = Typography
    const [loading, setLoading] = useState(false)
    const [checkId, setCheckId] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [errorRequest, setErrorRequest] = useState(null)
    const [checkDetails, setCheckDetails] = useState(null)
    


    const valuesColors = [
      {
        color:"#0008ff",
        text: "0-2",
        values: [1,2]
      },
      {
        color: "#2f35f1",
        text: "3-4",
        values: [3,4]
      },
      {
        color: "#6c70f7",
        text: "5-6",
        values: [5,6]
      },
      {
        color: "#9093ef",
        text: "7-8",
        values: [7,8]
      },
      {
        color: "#cecff3",
        text: "9-10",
        values: [9,10]
      }
      ]

    useEffect(() => {
        if(person?.metadata?.check_id){
            getBackgroundCheck_details();
        }
    }, [])


    const ScoreIndicator = ({scoreItem}) => {
      let color = "none";
      
      valuesColors.map((item) => {
        if(item.values.includes(Math.trunc(scoreItem?.score*10))){
          color = item.color
        }
      })
      
      return (
          <Avatar style={{ backgroundColor: color, margin:'auto' }} icon={Math.trunc(scoreItem?.score*10)} />
      )
    }
    
    

    const createBackgroundCheck = async () => { 
        setShowDetails(false)
        setErrorRequest(false)
        setLoading(true);
        await WebApiPeople.CreateTruoraRequest(person.id)
        .then((response) => {
            
            if (response.status == 201){
              getBackgroundCheck_details()
            }
            setLoading(false);
        })
        .catch((error) => {
            setErrorRequest(error?.response?.data?.message)
            /* message.error("Error al actualizar, intente de nuevo."); */
            setLoading(false);
        });
    }

    const getBackgroundCheckFile = async () =>{
      
      downLoadFileBlob(
        `${getDomain(
          API_URL_TENANT
        )}/person/person/${person.id}/get_background_check_file/`,
        `${person?.first_name}_${person.flast_name ? person.flast_name :''}_${person.mplast_name ? person.mplast_name :''}_Truora_report.pdf`,
        "get"
      );

      

      /* await WebApiPeople.GetTruoraFile(person.id)
        .then((response) => {
          if(response.status == 200){
                const blob = new Blob([response.data]);
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "demo.pdf";
                link.click();
          }
        })
        .catch((error) => {
            console.log('first', error.message)
            setLoading(false);
        }); */
    }

    
    

    const getBackgroundCheck_details = async () =>{
        await WebApiPeople.GetTruoraRequest(person.id)
        .then((response) => {
          if(response.status == 201){
            setLoading(false);
            
            setCheckDetails(response.data.check)
            setShowDetails(true)
          }
            
        })
        .catch((error) => {
            
            setLoading(false);
            setShowDetails(false)
        });
    }

    const getLevelConfiance = (score) =>{
      if(score <= 2){
        return "Confianza muy baja"
      }else if(score > 2 && score<=4){
        return "Confianza baja"
      }else if(score > 4 && score<=6){
        return "Confianza media"
      }else if(score > 6 && score<=8){
        return "Confianza alta"
      }else if(score > 8 && score<=10){
        return "Confianza muy alta"
      }
    }

  return (
    <>
        <Global
            styles={css`
                .btnActionTruora{
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    margin-top:100px;
                }       
                
                  
                  .wrap {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  
                  .button-truora {
                    min-width: 300px;
                    min-height: 60px;
                    font-family: 'Nunito', sans-serif;
                    font-size: 22px;
                    text-transform: uppercase;
                    letter-spacing: 1.3px;
                    font-weight: 700;
                    color: #fff !important;
                    background: var(--primaryColor) !important;
                    background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
                    border: none;
                    border-radius: 1000px;
                    box-shadow: 12px 12px 24px rgba(79,209,197,.64);
                    transition: all 0.3s ease-in-out 0s;
                    cursor: pointer;
                    outline: none;
                    position: relative;
                    padding: 10px;
                    color: #313133;
                    margin-bottom: 10px;
                    text-align: center;
                    }

                  
                  .button-truora::before {
                    content: '';
                    border-radius: 1000px;
                    min-width: calc(300px + 12px);
                    min-height: calc(60px + 12px);
                    border: 6px solid #00FFCB;
                    box-shadow: 0 0 60px rgba(0,255,203,.64);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: all .3s ease-in-out 0s;
                  }

                  .btn_loading{
                        transform: translateY(-6px);
                    }
                  
                  
                  
                  .button-truora::after {
                    content: '';
                    width: 30px; height: 30px;
                    border-radius: 100%;
                    border: 6px solid #00FFCB;
                    position: absolute;
                    z-index: -1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 1.5s infinite;
                  }
                  
                  .text-light{
                    font-weight: 300 !important;
                    margin: 0px;
                  }

                  .color-indicator .ant-badge-status-text{
                    display:none;
                  }

                  button.btnDownloadFileTruora{
                    background-color: #930909 !important;
                  }
                  button.btnDownloadFileTruora:hover{
                    background-color: #5a0909 !important;
                  }
                  
                  @keyframes ring {
                    0% {
                      width: 30px;
                      height: 30px;
                      opacity: 1;
                    }
                    100% {
                      width: 300px;
                      height: 300px;
                      opacity: 0;
                    }
                  }

            `}
        />
        <Row justify='space-between'>
          <Col>
            <Title style={{ fontSize: "20px", marginBottom:0 }}>BackGround Check By Truora</Title>
            {showDetails && 
              <Text>
                Fecha de ultima actualización { checkDetails['creation_date'] ? moment(checkDetails['creation_date']).format("DD/MM/yyyy"): ''}
              </Text>
            }
          </Col>
          { showDetails && 
            <Col>
            <Space>
              
              <Popconfirm
                title="¿Volver a consutar?"
                description="Esto se contabilizara con una consulta nueva en Truora"
                onConfirm={() =>createBackgroundCheck()}
                okText="Si"
                cancelText="No"
              >
                <Tooltip placement="left" title={"Consultar nuevamente"}>
                  <Button>
                    <SyncOutlined style={{ color:'white' }} />
                  </Button>
                </Tooltip>  
                </Popconfirm>
              <Button className='btnDownloadFileTruora' onClick={() => getBackgroundCheckFile()} icon={<FilePdfOutlined/>}>
                Descargar reporte 
              </Button> 
            </Space>
          </Col>
          }          
        </Row>
        <Row justify='center' gutter={20}>
            { !showDetails ? 
              <Col style={{  paddingTop:100, textAlign:'center' }}>
                <div class="wrap">
                    <button onClick={() => createBackgroundCheck()} class={`button-truora ${loading && 'btn_loading'}`}>
                        { loading ? 'Consultando...' : 'Consultar' }
                    </button>
                </div>
                {
                    errorRequest &&
                        <Text type="danger">
                            {errorRequest}
                        </Text>
                }
              </Col>
              :
              <>
                <Col span={24}>
                  <Title style={{ marginTop:10 }} level={4} className='text-light'>
                    Puntaje
                  </Title>   
                  <Divider style={{ marginTop:10, marginBottom:10 }}  />
                  <Text>Id de la consulta</Text>
                  <Title level={5} style={{ margin:0, fontSize:10 }}>
                      {checkDetails?.check_id}
                    </Title>
                
                  <div style={{ width:'100%', textAlign:'center' }}>
                    <Progress style={{ marginTop:20 }} type="circle" percent={checkDetails?.score*100} format={() => (checkDetails?.score*10) }  />
                    <p style={{ marginBottom:0 }}>
                      <b>
                        {getLevelConfiance(checkDetails?.score*10)}
                      </b>
                    </p>
                    <p>
                    <Text >
                      El <b>puntaje global</b> se obtiene de todas las fuentes consultadas.
                    </Text>
                    </p>
                  </div>
                  <Title level={5} style={{ marginTop:20 }}>
                    Nivel de confianza
                  </Title>
                  <List 
                     grid={{
                      column: 5,
                      gutter: 16
                    }}
                    dataSource={valuesColors}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ textAlign:'center', width:'100%' }}>
                          <Badge color={item.color} className='color-indicator'/>
                          <p>{item.text}</p>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>

                <Col span={24} style={{ marginTop:20 }}>
                  <Title level={4} className='text-light'>
                    Categorías de información
                  </Title>   
                  <Divider style={{ marginTop:10, marginBottom:10 }}  />
                  <List
                    dataSource={checkDetails?.scores}
                    renderItem={(item,idx) => (
                      <List.Item style={{ display:'block' }}>
                        <Row justify='space-between'>
                          <Col>
                            <Title level={5} style={{ marginBottom:0 }}>
                              {
                                item.data_set == 'personal_identity' ? 'Identidad':
                                item.data_set == 'criminal_record' ? 'Criminal':
                                item.data_set == 'legal_background' ? 'Legal':
                                item.data_set == 'international_background' ? 'Internacional':
                                item.data_set == 'alert_in_media' ? 'Medios':
                                item.data_set == 'taxes_and_finances' && 'Impuestos y finanzas'
                              }
                            </Title>
                            <Text>
                              Registros encontrados: 2
                            </Text> <br/>
                            <Text>
                              <Tag color="#108ee9">
                                {
                                  item.data_set == 'personal_identity' ? '20%':
                                  item.data_set == 'criminal_record' ? '50%':
                                  item.data_set == 'alert_in_media' ? '0%': '10%'
                                }
                              </Tag>
                              Peso sobre el puntaje global
                            </Text>
                          </Col>
                          <Col style={{ textAlign:'end', display:'flex' }}>
                            <ScoreIndicator scoreItem={item}  />
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Col>
              </>
            }
        </Row>
    </>
  )
}

export default TruoraCheck