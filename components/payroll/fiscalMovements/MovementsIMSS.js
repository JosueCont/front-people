import { useEffect, useState } from "react";
import {UploadOutlined, DownloadOutlined, SyncOutlined, ThunderboltOutlined} from '@ant-design/icons';
import { API_URL_TENANT, API_URL } from "../../../config/config";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { Table, Button, Upload, Row, Col, message, Modal } from 'antd';
import WebApiPayroll from "../../../api/WebApiPayroll";
import WebApiPeople from "../../../api/WebApiPeople";
import SelectPatronalRegistration from "../../selects/SelectPatronalRegistration";
import UploadFile from "../../UploadFile";
import { connect } from "react-redux";
import moment from 'moment'

const MovementsIMSS=({ currentNode })=>{

    const [file, setFile]=useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ loadingSync, setLoadingSync ] = useState(false)
    const [patronalSelected, setPatronalSelected] = useState(null);
    const [ documents, setDocuments ] = useState(null)


    useEffect(() => {
        currentNode && patronalSelected && getMovements()
    },[patronalSelected])

    const getMovements = async () => {
        setLoading(true)
        try {
            let response = await WebApiPayroll.getIMSSMovements(currentNode.id, patronalSelected)
            setDocuments(response.data.documents)
        } catch (error) {
            console.log('Error -->', error)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Vuelve a ejecutar el scrapper para consultartodos
     */
    const syncPending= async (movimientoId=null) =>{
        setLoadingSync(true)
        try {
            let response = await WebApiPayroll.syncMovementImssScapper(currentNode.id, patronalSelected,movimientoId)
            message.success('Solicitado correctamente')
        } catch (error) {
            message.error('Hubo un error al solicitar, porfavor intenta mas tarde')
        } finally {
            setLoadingSync(false)
        }
    }


    const columns = [
        {
            title: 'Fecha de envío',
            width: 200,
            render: (date) => moment(date,"DD/MM/YYYY hh:mm:ss").utc().format('DD/MM/YYYY hh:mm:ss') || "----",
            dataIndex: 'date',
        },
        {
            title: 'Lote',
            dataIndex: 'lot',
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            render: (type) => type || "----"
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                let sts = ""
                switch(status) {
                    case 1:
                        sts = "Creado"
                        break
                    case 2:
                        sts = "Enviado"
                        break
                    case 3:
                        sts = "En proceso"
                        break
                    case 4:
                        sts = "Procesado"
                        break
                    case 5:
                        sts = "Error"
                        break
                    default:
                        sts = ""
                        break
                }

                return sts
            }
        },
        {
            title: 'Acuse',
            dataIndex: 'receipt',
            render:(receipt) => (
                <div style={{ textAlign: 'center' }}>
                    {
                        receipt? (
                            <a href={receipt} target={'_blank'}>
                                <DownloadOutlined />
                            </a>
                        ) : "----"
                    }

                </div>
            )
        },
        {
            title: 'Resultado',
            dataIndex: 'result',
            render:(result) => (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                  {
                        result? (
                            <a href={result}>
                                <DownloadOutlined />
                            </a>
                        ) : "----"
                    }
                </div>
                </div>
            )
        },
        {
            title: 'Mensaje',
            width: 300,
            dataIndex: 'message',
            render: (message) => message || "----"
        },
    ];

    
    const importAfiliateMovements = async () => {

        setLoading(true)
        let data = new FormData()

        data.append('File', file)
        data.append('node', currentNode.id)
        data.append('patronal_registration', patronalSelected)

        try {
            let response = await WebApiPeople.importAfiliateMovement(data)
            if(response){           
                message.success('Movimientos importados correctamente')
                getMovements()
            }
        } catch (error) {
            console.log('Error', error)
            message.error('Error al importar movimientos')
        } finally {
            setFile(null)
            setModalVisible(false)
            setLoading(false)
        }
    }


    return (
        <>
            <h4>Consulta de movimientos</h4>

            <Row justify={'space-between'} style={{ marginTop: '20px' }}>
                <Col span={10}>
                    <SelectPatronalRegistration
                        currentNode={currentNode?.id}
                        onChange={(value) => setPatronalSelected(value)}
                    />
                </Col>
                <Col span={10} style={{ display: 'flex', justifyContent: 'end'}}>
                    <Button
                        style={{marginRight:20}}
                        onClick={()=>syncPending()}
                        disabled = { patronalSelected?  false : true }
                    >
                        {loadingSync ? <SyncOutlined spin={loading}/> : <ThunderboltOutlined/>} Sincronizar pendientes
                    </Button>
                        <Button
                          onClick={ () => {
                            getMovements(false)
                          }
                        }
                          disabled = { patronalSelected?  false : true }
                        >

                            <SyncOutlined spin={loading} /> Refrescar tabla
                        </Button>
                </Col>
            </Row>

            <Table 
              style={{width:'100%'}} 
              columns={columns} 
              dataSource={documents} 
              size="middle"
              loading = { loading || loadingSync }
              scroll={{ x: true }}
              locale={{
                emptyText: (loading || loadingSync ) ? "Cargando..." : "No se encontraron Documentos.",
              }}
              
            />
        </>
    )
}

const mapState = (state) => {
    return {
      currentNode: state.userStore.current_node,
    };
  };

export default connect(mapState)(MovementsIMSS); 