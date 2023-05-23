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
    Select,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined,
    DownloadOutlined,
    InboxOutlined
} from "@ant-design/icons";
import AssessmentsGroup from "./AssessmentsGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { API_URL } from "../../../config/config";
import { setErrorFormAdd, setModalGroup } from '../../../redux/assessmentDuck'


const AssessmentsSearch = ({currentNode, getListGroups, setErrorFormAdd, setModalGroup, assessmentStore, ...props}) =>{
    const {Title, Text} = Typography
    const [form] = Form.useForm();
    const permissions = useSelector(state => state.userStore.permissions.person);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalFile, setShowModalFile] = useState(false)
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState(2)
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
    };

    const HandleCreateGroup = () =>{
        /* setShowModalCreate(true) */
        setErrorFormAdd(false)
        setModalGroup(true)
    }

    

    const onFinishAdd = async (values) =>{
        props.setLoading(true)
        props.createGroup(values)
    }

    const onFinishSearch = (values) =>{
        let name = "";
        if((values.name).trim()){
            name = `${values.name}`;
        }else{
            name = "";
            form.resetFields();
        }
        props.searchGroup(name)
    }

    const openMassiveForm = () =>{
        setAction(2)
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

    useEffect(() => {
      console.log('assessmentStore',assessmentStore?.open_modal_create_group)
    }, [assessmentStore.open_modal_create_group])
    

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
                            <Button href={`${API_URL}/static/plantilla_grupo_assessments.xlsx`}  icon={<DownloadOutlined />} />    
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
            {assessmentStore?.open_modal_create_group && (
                <AssessmentsGroup
                    loadData={{}}
                    title={"Crear nuevo grupo"}
                    visible={assessmentStore?.open_modal_create_group}
                    actionForm={onFinishAdd}
                />
            )}
            <Modal
                footer={
                    <Col >
                        <Space>
                            <Button
                                size="large"
                                htmlType="button"
                                onClick={() => closeModalFile()}
                                style={{ paddingLeft: 30, paddingRight: 30 }}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            
                            <Button
                                size="large"
                                htmlType="button"
                                onClick={() => sendFile()}
                                disabled={fileList.length <= 0}
                                style={{ paddingLeft: 30, paddingRight: 30 }}
                            >
                                Enviar
                            </Button>

                        </Space>
                    </Col>
                }
                closable={false} visible={showModalFile} onCancel={() => closeModalFile()}> 
                <Spin tip="Cargando" spinning={loading}>
                    <Upload.Dragger maxCount={1} {...propsUpl}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Selecciona o arrastra un archivo para cargarlo</p>
                    </Upload.Dragger>
                    <Row>
                        <Col span={24}>
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
                    <Row>
                        <Col span={24} style={{ paddingTop:20 }}>
                            <Space direction="vertical" style={{ width:'100%' }}>
                            <b>
                                ¿Qué acción desea realizar si el grupo de evaluaciones ya existe?
                            </b>
                            <Radio.Group
                                onChange={ChangeAction}
                                value={action}
                            >
                                <Space direction="vertical">
                                    <Radio value={2} >Duplicar</Radio>
                                    <Radio value={3}>Omitir</Radio>
                                    <Radio value={1}>Reemplazar</Radio>
                                    
                                </Space>
                            </Radio.Group>
                            </Space>
                            {/* <Select placeholder="Selecciona una opción" options={optionsRadio} style={{ width:200, marginTop:10 }} /> */}
                        </Col>
                        <Col>
                            
                            
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
                </Spin>
            </Modal>
        </>
    )
}

const mapState = (state) => {
    return {
      currentNode: state.userStore.current_node,
      assessmentStore: state.assessmentStore,
    };
};

export default connect(mapState, { setErrorFormAdd, setModalGroup })(AssessmentsSearch);