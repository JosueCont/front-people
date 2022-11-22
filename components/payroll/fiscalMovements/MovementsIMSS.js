import { useEffect, useState } from "react";
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { API_URL_TENANT, API_URL } from "../../../config/config";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { Table, Button, Upload, Row, Col } from 'antd';
import WebApiPayroll from "../../../api/WebApiPayroll";
import SelectPatronalRegistration from "../../selects/SelectPatronalRegistration";
import UploadFile from "../../UploadFile";
import { connect } from "react-redux";

const MovementsIMSS=({ currentNode })=>{

    const [file, setFile]=useState(null)
    const [ loading, setLoading ] = useState(false)
    const [patronalSelected, setPatronalSelected] = useState(null);
    const [ documents, setDocuments ] = useState(null)


    useEffect(()=>{
        if(file){
            alert('enviado archivo')
        }
    },[file])

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


    const columns = [
        {
            title: 'Fecha de envío',
            dataIndex: 'date',
        },
        {
            title: 'Lote',
            dataIndex: 'lot',
        },
        {
            title: 'Tipo',
            dataIndex: 'address',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                let sts = ""
                switch(status) {
                    case 1:
                        sts = "Enviado"
                        break
                    case 2:
                        sts = "En proceso"
                        break
                    case 3:
                        sts = "Procesando"
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
                    <a href={receipt}>
                        <DownloadOutlined />
                    </a>
                </div>
            )
        },
        {
            title: 'Resultado',
            dataIndex: 'result',
            render:(result) => (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <a href={result}>
                        <DownloadOutlined />
                    </a>
                </div>
                </div>
            )
        },
        {
            title: 'Mensaje',
            dataIndex: 'msj',
        },
    ];


    const data = [
        {
            "date": "16/11/2022",
            "status": 3,
            "receipt": "/media/node/documents/266/dc88cc0f9cb4405d8064f8c9179e9a07/1611202205652/recibo_d424803410_lote_2NYYtIC.pdf",
            "result": "/media/node/documents/266/dc88cc0f9cb4405d8064f8c9179e9a07/1611202205811/idse_d424803410_lote_336463897.pdf",
            "lot": "336463897"
        },
    ];


    const settingsUplod={
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


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
                <Col span={10} style={{ display: 'flex', justifyContent: 'end' }}>
                    {/* <Col span={12}>
                        <UploadFile
                            textButton={"Cargar DispMag"}
                            setFile={setFile}
                            validateExtension={".txt"}
                        />
                    </Col> */}
                     <Col span={12}>
                        <Button>
                            Sincronizar
                        </Button>
                    </Col>
                </Col>
            </Row>

            <Table 
              style={{width:'100%'}} 
              columns={columns} 
              dataSource={documents} 
              size="middle"
              loading = { loading }
              scroll={{ x: true }}
              locale={{
                emptyText: loading ? "Cargando..." : "No se encontraron Documentos.",
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