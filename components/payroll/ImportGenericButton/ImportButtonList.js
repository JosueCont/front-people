import {connect} from "react-redux";
import {
    DownloadOutlined,
    DownOutlined, UploadOutlined,FileExcelOutlined
} from "@ant-design/icons";
import {Button, Modal, Form, Input, DatePicker,Space, Alert, Table, Row, Col, Dropdown, Menu, message, Upload} from "antd";
import {downLoadFileBlob, getDomain} from "../../../utils/functions";
import {API_URL_TENANT} from "../../../config/config";
import {useEffect, useState} from "react";


const MOVEMENTS_TYPE={
    UPDATE_SALARY:1
}

const ImportButtonList=({person, node, payrollPerson, personsList,...props})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [fileName, setFileName] = useState(null);
    const [currentMovement, setCurrentMovement] = useState({
        title: 'Actualizar salarios',
        urlDownload: '/person/person/generate_template/?type=1',
        nameTemplate: 'actualizar_salarios.xlsx'
    });
    const [movements, setMovements] = useState([]);





    const openModal=(type=MOVEMENTS_TYPE.UPDATE_SALARY)=>{
            setFileName(null)
        console.log(personsList)

            let objGeneric={}

            switch (type){
                case MOVEMENTS_TYPE.UPDATE_SALARY:
                    objGeneric = {
                        title: 'Actualizar salarios',
                        urlDownload: '/person/person/generate_template/?type=1',
                        nameTemplate: 'actualizar_salarios.xlsx',
                        description: 'Esta sección te permite actualizar salarios de manera masiva, descarga el template, modifica y vuelve a subirlo.'
                    }
                    break;
                default:
                    break;
            }

            setCurrentMovement(objGeneric)
            setShowModal(true)

    }


    const menuGeneric = () => {
        return (
            <Menu>
                <Menu.Item key="1" onClick={() => openModal(MOVEMENTS_TYPE.UPDATE_SALARY)}>
                    Actualizar salarios
                </Menu.Item>
            </Menu>
        );
    };


    return (
        <>
            <Dropdown overlay={menuGeneric} style={{marginTop:'-5'}}>
                <Button style={menuDropDownStyle}>
                    Otros movimientos <DownOutlined />
                </Button>
            </Dropdown>

            <Modal
                title={currentMovement.title}
                visible={showModal}
                onOk={()=> setShowModal(false)}
                onCancel={()=>setShowModal(false)}
                okText="Aceptar"
                cancelText="Cancelar"
            >
                <Row>
                    <Col span={24}>
                        <Alert style={{marginBottom:20}} showIcon message={currentMovement.description} type={"info"}  />
                    </Col>
                    <Col span={24}>
                        <Space align={'start'}>

                            <Space direction={'vertical'} >
                                <Upload
                                    {...{
                                        showUploadList: false,
                                        beforeUpload: (file) => {
                                            const isXlsx = file.name.includes(".xlsx");
                                            if (!isXlsx) {
                                                message.error(`${file.name} no es un xlsx.`);
                                            }
                                            return isXlsx || Upload.LIST_IGNORE;
                                        },
                                        onChange(info) {
                                            const { status } = info.file;
                                            if (status !== "uploading") {
                                                if (info.fileList.length > 0) {
                                                    console.log('hola import', info.fileList[0].originFileObj)
                                                    setFileName(info?.fileList[0]?.originFileObj?.name)
                                                    // importPersonFileExtend(
                                                    //     info.fileList[0].originFileObj
                                                    // );
                                                    // info.file = null;
                                                    // info.fileList = [];
                                                }else{
                                                    setFileName(null)
                                                }
                                            }
                                        },
                                    }}
                                >
                                    <Button
                                        size="middle"
                                        icon={<UploadOutlined />}
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Importar personas
                                    </Button>
                                </Upload>
                                <p>{'     '} {' '} {fileName}</p>
                            </Space>
                            <a
                                href={'.'}
                                className={"ml-20 "}
                                style={buttonLink}
                                onClick={(e) =>
                                {
                                    e.preventDefault();
                                    downLoadFileBlob(
                                        `${getDomain(
                                            API_URL_TENANT
                                        )}${currentMovement.urlDownload}`,
                                        currentMovement.nameTemplate,
                                        "GET"
                                    )
                                }
                                }
                            >
                                <FileExcelOutlined style={{color:'#2682FE'}}/> {' '}
                                Descargar plantilla
                            </a>
                        </Space>

                    </Col>
                    <Col span={24}>



                    </Col>
                </Row>

            </Modal>

        </>



    )
}

const buttonLink ={
    color: '#2682FE'
}

const menuDropDownStyle = {
    background: "#434343",
    color: "#ffff",
};


export default ImportButtonList;
