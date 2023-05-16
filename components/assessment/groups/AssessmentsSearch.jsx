import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Space,
    Modal,
    Upload,
    Divider,
    Typography,
    Spin,
    Tooltip,
    Radio,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import AssessmentsGroup from "./AssessmentsGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { API_URL } from "../../../config/config";


const AssessmentsSearch = ({currentNode, getListGroups, ...props}) =>{
    const {Title, Text} = Typography
    const [form] = Form.useForm();
    const permissions = useSelector(state => state.userStore.permissions.person);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalFile, setShowModalFile] = useState(false)
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState(null)
    const [showErrorAction, setShowErrorAction] = useState(false)
    const [showErrorFile, setShowErrorFile] = useState(false)

    const propsUpl = {
        onRemove: (file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        },
        beforeUpload: (file) => {
          setFileList([file]);
    
          return false;
        },
        fileList,
      };


    const HandleFilterReset = () => {
        form.resetFields();
        props.searchGroup("")
        props.setNumPage(1)
    };

    const HandleCreateGroup = () =>{
        setShowModalCreate(true)
    }

    const HandleClose = ()=>{
        setShowModalCreate(false)
    }

    const onFinishAdd = async (values) =>{
        props.setLoading(true)
        props.createGroup(values)
    }

    const onFinishSearch = (values) =>{
        let name = "";
        if((values.name).trim()){
            name = `&name=${values.name}`;
        }else{
            name = "";
            form.resetFields();
        }
        props.searchGroup(name)
    }

    const openMassiveForm = () =>{
        setShowModalFile(true)
    }

    const closeModalFile = () => {
        setShowModalFile(false)
        setAction(null)
        setShowErrorAction(false)
        setShowErrorFile(false)
        setFileList([])
    }

    const sendFile = async () => {
        setShowErrorAction(false)
        setShowErrorFile(false)
        if (!action){
            setShowErrorAction(true)
            return;
            
        }
        if (fileList.length <= 0){
            setShowErrorFile(true);
            return
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('file', fileList[0])
        formData.append('node', currentNode.id)
        formData.append('action', action)

        try {
            let resp = await WebApiAssessment.uploadMassiveGroups(formData);
            if(resp?.status === 201){
                getListGroups(currentNode?.id, "", "");
                setFileList([])
                message.success(resp?.data?.message);
                closeModalFile()
            }
            setLoading(false)
        } catch (e) {
            console.log('error ==>', e);
            message.error("Información no actualizada");
            setLoading(false)
            }
    }
    

    const optionsRadio = [
        { label: 'Reemplazar', value: 1 },
        { label: 'Duplicar', value: 2 },
        { label: 'Omitir', value: 3},
    ]

    const ChangeAction = (val) => {
        console.log('action',val)
        setAction(val?.target?.value)
    }

    return(
        <>
            <Row>
                <Col span={18}>
                    <Form form={form} scrollToFirstError onFinish={onFinishSearch}>
                        <Row>
                            <Col span={16}>
                                <Form.Item name="name" label="Filtrar">
                                    <Input
                                        placeholder={'Nombre del grupo'}
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button htmlType="submit">
                                            <SearchOutlined />
                                        </Button>
                                    </Form.Item>
                                </div>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button onClick={()=>HandleFilterReset()}>
                                            <SyncOutlined />
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Space>
                        <Tooltip title="Descargar layout para carga masiva">
                            <Button href={`${API_URL}/static/PERFILES CON PRUEBAS Y NIVELES DE COMPETENCIAS.xlsx`}  icon={<DownloadOutlined />} />    
                        </Tooltip>
                        <Tooltip title="Cargar archivo">
                            <Button onClick={() => openMassiveForm()} icon={<UploadOutlined />} />    
                        </Tooltip>
                        {permissions.create && (
                            <Button
                                onClick={() => HandleCreateGroup()}
                            >
                                <PlusOutlined /> Agregar grupo
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
            {showModalCreate && (
                <AssessmentsGroup
                    loadData={{}}
                    title={"Crear nuevo grupo"}
                    visible={showModalCreate}
                    close={HandleClose}
                    actionForm={onFinishAdd}
                />
            )}
            <Modal closable={false} visible={showModalFile} footer="" onCancel={() => closeModalFile()}>
                <Spin spinning={loading}>
                    <Row>
                        <Col>
                            <b>
                                Cargar grupos
                            </b>
                        </Col>
                        <Col span={24}>
                            <Upload maxCount={1} {...propsUpl}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                            {
                                showErrorFile &&
                                <><br/>
                                <Text type='danger'>
                                    Debes elegir un archivo
                                </Text>
                                </>
                            }
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col style={{ paddingTop:20, textAlign:'center' }}>
                            <b>
                                Que accion desea realizar si el grupo ya existe 
                            </b>
                        </Col>
                        <Col >
                            <Radio.Group
                                options={optionsRadio}
                                onChange={ChangeAction}
                                value={action}
                                optionType="button"
                                buttonStyle="solid"
                            />
                            {
                                showErrorAction &&
                                <><br/>
                                <Text type='danger'>
                                    Selecciona una acción
                                </Text>
                                </>
                            }
                        </Col>
                    </Row>
                    <Divider/>
                    <Row justify="center" gutter={20}>
                        <Col>
                            <Button onClick={() => closeModalFile()} >
                                Cancelar
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => sendFile()}>
                                Enviar_
                            </Button>
                        </Col>
                    </Row>
                </Spin>
            </Modal>
        </>
    )
}

const mapState = (state) => {
    return {
      currentNode: state.userStore.current_node,
    };
};

export default connect(mapState, { })(AssessmentsSearch);