import React, { useEffect, useState } from 'react';
import {Form, Input, Button, Modal, message, Upload} from "antd";
import {PlusOutlined,   LoadingOutlined,} from "@ant-design/icons";
import {connect, useDispatch} from "react-redux";
import {withAuthSync, userCompanyId} from "../../../libs/auth";
import { ruleRequired } from "../../../utils/constant";
import FormItemHTML from "./FormItemHtml";
import { assessmentCreateAction, assessmentUpdateAction } from "../../../redux/assessmentDuck";

const FormAssessment = ({...props}) => {

    const dispatch = useDispatch();
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 }, };
    const [formAssessment] = Form.useForm();
    const nodeId = Number.parseInt(userCompanyId());
    const assessmentId = props.loadData ? props.loadData.id : "";
    const [descripcion, setDescripcion] = useState(props.loadData.description_es ? props.loadData.description_es : '');
    const [instruccions, setInstruccions] = useState(props.loadData.instructions_es ?  props.loadData.instructions_es : '');
    const [imageUrl, setImageUrl] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [loadingLogo, setLoadingLogo] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect( () => {
        if (props.loadData){
            console.log("DATOS::", props.loadData);
            formAssessment.setFieldsValue({
                code: props.loadData.code,
                name: props.loadData.name,
            });
            setImageUrl(props.loadData.image);
        } else {
            onReset();
            setImagen(null);
            setImageUrl(null);
            setDescripcion('');
            setInstruccions('');
        }
    }, []);

    useEffect(() => {
        setLoading(props.assessmentStore.fetching);
    }, [props.assessmentStore]);

    const onFinish = (values) => {
        let data = new FormData();
        imagen && data.append("image", imagen);
        values.code && data.append("code", values.code);
        values.name && data.append("name", values.name);
        descripcion && data.append("description_es", descripcion);
        instruccions && data.append("instructions_es", instruccions);
        if(props.loadData){
            props.assessmentUpdateAction(assessmentId, data).then( response => {
                response ? message.success("Actualizado correctamente") : message.error("Hubo un error"), props.close();
            }).catch( e => {
                message.error("Hubo un error");
                props.close();
            });
            console.log("VALUES::", values);
        } else {
            data.append("companies", [nodeId]);
            props.assessmentCreateAction(data).then((response) => {
                response ? message.success("Agregado correctamente") : message.error("Hubo un error"), props.close();
            }).catch( e => {
                message.error("Hubo un error");
                props.close();
            });
        }  
    };

    const onReset = () => {
        formAssessment.resetFields();
    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
          setLoadingLogo(true);
          return;
        }
        // if (info.fileList.length > 0) {
        if (info.file.status === 'done') {
            setImagen(info.file.originFileObj);
            getBase64(info.file.originFileObj, (imageUrl) => {
            setLoadingLogo(false);
            setImageUrl(imageUrl);
          });
        }
    };

    const uploadButton = (
        <div>
            {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Subir</div>
        </div>
    );

    return (
        <Modal title={props.title} visible={props.visible} footer={null} onCancel={() => props.close() } 
            width={ window.innerWidth > 1000 ? "60%" : "80%"}
            footer={[
                <Button key="back" onClick={() => props.close()}> Cancelar </Button>,
                <Button form="formAssessment" type="primary" key="submit" htmlType="submit" loading={loading}>Guardar</Button>,
            ]}>
            <Form {...layout} initialValues={{ intranet_access: false, }} onFinish={onFinish}  id="formAssessment" form={formAssessment}>
                <Form.Item name="image" label={"Imagen"}>
                    <Upload
                        label="Imagen"
                        listType="picture-card"
                        className="large-uploader"
                        showUploadList={false}
                        onChange={handleChange}
                    >
                    {imageUrl ? (
                        <img src={imageUrl} alt="avatar" style={{ width: "100%", minHeight: "100%" }} />
                    ) : (
                        uploadButton
                    )}
                    </Upload>
                </Form.Item>
                <Form.Item name="code" label={"Código"} rules={[ruleRequired]}>
                    <Input
                    maxLength={200}
                    allowClear={true}
                    placeholder="Código"
                    />
                </Form.Item>
                <Form.Item name="name" label={"Nombre"} rules={[ruleRequired]}>
                    <Input
                    maxLength={200}
                    allowClear={true}
                    placeholder="Nombre"
                    />
                </Form.Item>
                <FormItemHTML
                    html = {descripcion}
                    setHTML={setDescripcion}
                    getLabel = "Descripción"
                    getName = "description_es"
                />
                <FormItemHTML
                    html = {instruccions}
                    setHTML={setInstruccions}
                    getLabel = "Instrucciones"
                    getName = "instructions_es"
                />
            </Form>
        </Modal>
    )
}

const mapState = (state) => {
    return {
      assessmentStore: state.assessmentStore,
    }
}
  
export default connect(mapState,{assessmentCreateAction, assessmentUpdateAction})(withAuthSync(FormAssessment));
