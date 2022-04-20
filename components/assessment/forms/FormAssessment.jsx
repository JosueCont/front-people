import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message, Upload, Select,Col } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { connect, useDispatch } from "react-redux";
import { withAuthSync, userCompanyId } from "../../../libs/auth";
import FormItemHTML from "./FormItemHtml";
import WebApiAssessment from "../../../api/WebApiAssessment";
import {
  assessmentCreateAction,
  assessmentUpdateAction,
} from "../../../redux/assessmentDuck";
import { ruleRequired } from "../../../utils/rules";

const FormAssessment = ({assessmentStore,  ...props }) => {
  const dispatch = useDispatch();
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
  const [formAssessment] = Form.useForm();
  const nodeId = Number.parseInt(userCompanyId());
  const assessmentId = props.loadData ? props.loadData.id : "";
  const [descripcion, setDescripcion] = useState(
    props.loadData.description_es ? props.loadData.description_es : ""
  );
  const [instruccions, setInstruccions] = useState(
    props.loadData.instructions_es ? props.loadData.instructions_es : ""
  );
  // const currentNode = useSelector(state => state.userStore.current_node)
  const [imageUrl, setImageUrl] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.loadData) {
      formAssessment.setFieldsValue({
        code: props.loadData.code,
        name: props.loadData.name,
        categories: props.loadData.categories,
      });
      setImageUrl(props.loadData.image);
    } else {
      onReset();
      setImagen(null);
      setImageUrl(null);
      setDescripcion("<p></p>");
      setInstruccions("<p></p>");
    }
  }, [props.loadData]);

  useEffect(() => {
    console.log('descripcion',descripcion)
  }, [descripcion])
  

  useEffect(() => {
    console.log('assessmentStore',assessmentStore)
    setLoading(assessmentStore.fetching);
  }, [assessmentStore]);
  
  const createData = (obj )=>{
    let newObj = Object.assign(obj)
    if(!newObj.image || newObj.image == "" ){
      delete newObj.image
    }
    if(!newObj.description_es || newObj.description_es == "" ){
      delete newObj.description_es
    }
    if(!newObj.instructions_es || newObj.instructions_es == "" ){
      delete newObj.instructions_es
    }
    return newObj;
  }

  const onFinish = (values) => {
    // let data = new FormData();
    // imagen && data.append("image", imagen);
    // values.code && data.append("code", values.code);
    // values.name && data.append("name", values.name);
    // values.categories && data.append("categories", values.categories);
    // descripcion && data.append("description_es", descripcion);
    // instruccions && data.append("instructions_es", instruccions);
    const body = {
      ...values,
       image: imagen, 
       companies: [nodeId],
       description_es: descripcion, 
       instructions_es: instruccions 
      }
    const params = createData(body);
    if (props.loadData) {
      props
        .assessmentUpdateAction(assessmentId, params)
        .then((response) => {
          if(response.status === 201){
            message.success("Agregado correctamente")
          }else if(response.status === 200){
            if(response.data && response.data['code']){
              message.error(response.data['code'][0]);
            }else{
              message.error("Hubo un error");
            }
          }else{
            message.error("Hubo un error");
          }
            formAssessment.resetFields();
            setDescripcion("<p></p>");
            setInstruccions("<p></p>");
            props.close();
            
        })
        .catch((e) => {
          message.error("Hubo un error");
          props.close();
        });
    } else {
      // data.append("companies", [nodeId]);
      props
        .assessmentCreateAction(params)
        .then((response) => {
          console.log('response',response)
          if(response.status === 201){
            message.success("Agregado correctamente")
          }else if(response.status === 200){
            if(response.data && response.data['code']){
              message.error(response.data['code'][0]);
            }else{
              message.error("Hubo un error");
            }
          }else{
            message.error("Hubo un error");
          }
            setDescripcion("<p></p>");
            setInstruccions("<p></p>");
            props.close();
        })
        .catch((e) => {
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
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoadingLogo(true);
      return;
    }
    // if (info.fileList.length > 0) {
    if (info.file.status === "done") {
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
    <Modal
      title={props.title}
      visible={props.visible}
      footer={null}
      onCancel={() => props.close()}
      // width={window.innerWidth > 1000 ? "60%" : "80%"}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          {" "}
          Cancelar{" "}
        </Button>,
        <Button
          form="formAssessment"
          type="primary"
          key="submit"
          htmlType="submit"
          loading={loading}
        >
          Guardar
        </Button>,
      ]}
    >
      <Form
        {...layout}
        initialValues={{ intranet_access: false }}
        onFinish={onFinish}
        id="formAssessment"
        form={formAssessment}
      >
        <Form.Item name="image" label={"Imagen"}>
          <Upload
            label="Imagen"
            listType="picture-card"
            className="large-uploader"
            showUploadList={false}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{ width: "100%", minHeight: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="code" label={"Código"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="Código" />
        </Form.Item>
        <Form.Item name="name" label={"Nombre"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="Nombre" />
        </Form.Item>
        
        <Form.Item name="categories" label={"Categoría"} rules={[ruleRequired]}>
        <Select
          mode="multiple"
          allowClear
          showSearch
          placeholder={'Seleccionar categoría'}
          notFoundContent='No se encontraron resultados'
          optionFilterProp="children"
          filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
        >
          {assessmentStore.categories_assessment?.map(item =>(
              <Option key={item.id} value={item.id}>
                  {item.name}
              </Option>
          ))}
        </Select>
        </Form.Item>
        
        <FormItemHTML
          html={descripcion}
          setHTML={setDescripcion}
          getLabel="Descripción"
          getName="description_es"
        />
        <FormItemHTML
          html={instruccions}
          setHTML={setInstruccions}
          getLabel="Instrucciones"
          getName="instructions_es"
        />
      </Form>
    </Modal>
  );
};

const mapState = (state) => {
  return {
    assessmentStore: state.assessmentStore,
  };
};

export default connect(mapState, {
  assessmentCreateAction,
  assessmentUpdateAction,
})(withAuthSync(FormAssessment));
