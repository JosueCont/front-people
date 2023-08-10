import React, { useEffect, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import {
    Modal, Col, Space, Button, message,
    Spin, Upload, List, Typography
} from "antd";
import { ruleRequired } from "../../utils/rules";
import WebApiPayroll from "../../api/WebApiPayroll";
import WebApiPeople from "../../api/WebApiPeople";
import Router, { useRouter } from "next/router";
import { getCollaborators } from '../../redux/UserDuck'
import { connect } from "react-redux";
import { withAuthSync } from "../../libs/auth";
import {
    verifyMenuNewForTenant,
    getFiltersJB
} from '../../utils/functions';


const { Dragger } = Upload;

const ModalAddPersonCFI = ({
    visible,
    setVisible,
    node_id,
    getCollaborators,
    currentNode
}) => {

    const router = useRouter();

    useEffect(() => {
        setFile(null);
    }, [visible])

    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false);
    const [successMany, setSuccessMany] = useState(false)
    const [successPersonList, setSuccessPersonList] = useState([])

    const props = {
        name: 'file',
        multiple: true,
        accept: ["application/pdf", "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"],
        beforeUpload(file) {
            const isValid = (file.name.includes(".pdf") || file.name.includes(".zip"));
            if (!isValid) {
                message.error(`${file.name} no es un pdf ni .zip.`);
            }
            return isValid || Upload.LIST_IGNORE;
        },
        onChange(info) {
            console.log('=========')
            console.log(info)
            const { status } = info.file;
            if (status === 'done') {
                setFileList(info.fileList)
            } else if (status === 'error') {
                message.error(`${info.file.name} error al cargar archivo`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },

    };

    useEffect(() => {
        setSuccessPersonList([])
        setSuccessMany(false)
    }, [visible])
    


    const sendClose = async () => {
        if(successMany){
            setVisible(false);
            
        }
        try {
            setSuccessMany(false)
            setSuccessPersonList([])
            setLoading(true)
            // console.log(node_id, file)
            let formData = new FormData();
            formData.append("node_id", node_id);

            fileList.map(file => {
                formData.append("Files", file.originFileObj);
            })

            const addPerson = await WebApiPeople.sendFilesToAddPerson(formData);
            setLoading(false)
            if (addPerson?.status === 200) {
                let filters = getFiltersJB({...router.query});
                let page = router.query.page ? parseInt(router.query.page) : 1;
                let size = router.query.size ? parseInt(router.query.size) : 10;
                getCollaborators(currentNode.id, filters, page, size)
                if( addPerson.data.length === 1 ){
                    let person = addPerson.data[0]
                    message.success('Se agregó correctamente a ' + person?.first_name + person?.flast_name);
                    setVisible(false);
                    setTimeout(() => {
                        Router.push(`/home/persons/${person?.id}`)
                    }, 2000)
                }else{
                    
                    setSuccessPersonList(addPerson.data)
                    setSuccessMany(true)
                }
            }
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Intenta nuevamente')
        }
    }
    return (
        <Modal
            title='Crear persona utilizando comprobante de situación fiscal'
            visible={visible}
            onCancel={()=> setVisible(false)}
            maskClosable={false}
            footer={[
                <Space>
                    <Button
                        onClick={() => setVisible(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={() => sendClose()}
                        disabled={fileList.length  < 1}
                    >
                        {
                            successMany === true ? "Aceptar" : "Enviar"
                        }
                        
                    </Button>

                </Space>
            ]}
        >
            <Spin tip="Cargando..." spinning={loading}>
                {
                    successMany === true ?
                    <>
                        <Typography.Text>
                            Se crearon exitosamente {successPersonList.length} persona(s)
                        </Typography.Text>
                        <List 
                            dataSource={successPersonList}
                            renderItem={(item) => (
                                <List.Item>
                                    {item?.first_name}
                                </List.Item>
                              )}
                        />
                    </>
                    :
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Selecciona o arrastra un archivo para cargarlo</p>
                        <p className="ant-upload-hint">
                            Soporte para una carga única o masiva. Prohibir estrictamente la carga de datos de la empresa u otros
                            archivos sensibles.
                        </p>
                    </Dragger>
                }
            </Spin>
        </Modal>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}


export default connect(mapState, { getCollaborators })(withAuthSync(ModalAddPersonCFI));