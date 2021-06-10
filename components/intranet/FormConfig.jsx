import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Tabs,
    Form,
    Row,
    Col,
    Layout,
    Input,
    Button,
    Select,
    Spin,
    Table,
    Modal,
    message, Switch, Upload, AutoComplete,
} from "antd";
import {
    PlusOutlined,
    LoadingOutlined,
} from "@ant-design/icons";

const arrayConfigType = [{id: 1, name: 'Me gusta',emoji:"👍🏻"}, {id: 2, name: 'Me enoja',emoji:"😡"}, {id: 3, name: 'Me asombra',emoji:"😮"},
    {id: 4, name: 'Me encanta',emoji:"❤️"}, {id: 5, name: 'Me divierte',emoji:"😂"}, {id: 6, name: 'Me entristece',emoji:"😔"}];
const getConfig = [{id: 1, name: 'Por Wellness Coins'}];

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('¡Solo puede cargar archivos JPG / PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('¡La imagen debe tener un tamaño inferior a 2 MB!');
    }
    return isJpgOrPng && isLt2M;
}

const FormConfig = (props) => {
    const [formConfigIntranet] = Form.useForm();
    const [photo, setPhoto] = useState(props.getImage ? props.getImage+"?"+new Date():null);
    const [imageUpdate, setImageUpdate] = useState(null);

    const [loading, setLoading] = useState(false);


    const [interactionsAPI, setInteractionsAPI] = useState(arrayConfigType);
    const [interactionsSelected, setInteractionsSelected] = useState([]);
    const interactionsFilteredOptions = interactionsAPI.filter(o => !interactionsSelected.includes(o));


    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Cargar</div>
        </div>
    );

    const upImage = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => {
                setPhoto(imageUrl)
                saveImages(info.file.originFileObj)
                setLoading(false)
            });
        }
    };

    useEffect(() => {
        getDataInfo()
    }, [props.config]);


    const getDataInfo = () => {
        if (props.config) {
            formConfigIntranet.setFieldsValue({
                nameIntranet: props.config.intranet_name,
               /// accessIntranet: props.config.intranet_enabled,
                primaryColor: props.config.intranet_primary_color,
                secondaryColor: props.config.intranet_secondary_color,
                intranet_enable_post_reaction: props.config.intranet_enable_post_reaction !== null ? props.config.intranet_enable_post_reaction.map((item) => {
                    return item;
                }) : [],
            })
            if (props.config.intranet_logo) {
                setPhoto(props.config.intranet_logo+"?"+new Date())
            }
        }
    };

    const interactionsChange = (selectedItems) => {
        setInteractionsSelected(selectedItems)
    }

    const onWebsiteChange = (value) => {
        if (!value) {
           // setAutoCompleteResult([]);
        } else {
           /// setAutoCompleteResult(['.com', '.org', '.net'].map(domain => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map(website => ({
        label: website,
        value: website,
    }));

    const onFinish = (values) => {
        saveConfig(values)
    };

    const saveConfig = (data) => {
        let jsoForm={
            intranet_name:data.nameIntranet,
            ///intranet_enabled: data.accessIntranet === true ? true : false,
            intranet_primary_color:data.primaryColor ? data.primaryColor : "#000",
            intranet_secondary_color:data.secondaryColor ? data.secondaryColor : "#000",
            intranet_enable_post_reaction:data.intranet_enable_post_reaction.length>0 ? data.intranet_enable_post_reaction:null,
        }
        let params = new FormData();
        let image = data.image ? data.image.file.originFileObj : "";

        if (image) {
            params.append("intranet_logo", image);
        }

        console.log("parametro:::", data.intranet_enable_post_reaction)

        if (props.config) {
            //update
            props.save(jsoForm, "update", props.config.id)
           /* if (image) {
                params.append("intranet_logo", image);
                props.saveImage(params,  "update", props.config.id)
            }*/
        } else {
            //add
            props.save(jsoForm, "add")
           /* if (image) {
                params.append("intranet_logo", image);
                props.saveImage(params, "add")

            }*/
        }
    };
    const saveImages=(image)=>{
        let params = new FormData();
        let imageSend = image ?image : "";
        if (props.config) {
            //update
            if (imageSend) {
                params.append("intranet_logo", imageSend);
            }
            props.saveImage(params, "update", props.config.id)
        } else {
            //add
            if (image) {
                params.append("intranet_logo", imageSend);
                props.saveImage(params, "add")
            }
        }
    }

    return (<>
        <Layout className="site-layout-background">
            <Spin spinning={props.loading}>
            <Form
                layout={"vertical"}
                form={formConfigIntranet}
                onFinish={onFinish}
            >
                <Row>
                    <Col lg={6} xs={22} offset={1}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Nombre requerido',
                                }]}
                            name="nameIntranet" label="Nombre de intranet">
                            <AutoComplete name="nameIntranet" label="Nombre"
                                          onChange={onWebsiteChange}>
                                <Input/>
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col lg={6} xs={22} offset={1}>
                        <Form.Item
                            name="primaryColor"
                            label="Color primario de intranet"
                        >
                            <Input type={"color"}/>
                        </Form.Item>
                    </Col>
                    <Col lg={6} xs={22} offset={1}>
                        <Form.Item
                            label="Color secundario de intranet"
                            name='secondaryColor'
                        >
                            <Input type={"color"}/>
                        </Form.Item>
                    </Col>
                   {/* <Col lg={6} xs={22} offset={1}>
                        <Form.Item name="accessIntranet" label="Acceso a la intranet" valuePropName="checked">
                            <Switch/>
                        </Form.Item>
                    </Col>*/}

                    <Col lg={6} xs={22} offset={1}>
                        <Form.Item label="Imagen de intranet" name="image"
                                   labelAlign={"left"}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={upImage}
                                    >{
                                        photo ? (
                                        <div
                                            className="frontImage"
                                            style={
                                                photo
                                                    ? {
                                                        width: "190px",
                                                        height: "190px",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        textAlign: "center",
                                                        alignContent: "center",
                                                    }
                                                    : {}
                                            }
                                        >
                                            <img
                                                className="img"
                                                src={photo}
                                                alt="avatar"
                                                preview={false}
                                                style={{width: 100}}
                                            />
                                        </div>
                                    ) : (
                                        uploadButton
                                    )}
                                    </Upload>


                        </Form.Item>
                    </Col>
                    <Col lg={6} xs={22} offset={1}>
                        <Form.Item name="intranet_enable_post_reaction" label="Tipo de reacciones">
                            <Select
                                mode="multiple"
                                value={interactionsSelected}
                                onChange={interactionsChange}
                                placeholder={'Seleccione...'}>
                                {interactionsFilteredOptions.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name} {item.emoji}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row
                    justify={"end"}
                    gutter={20}
                    style={{marginBottom: 20}}
                >
                    <Col>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Form>
            </Spin>
        </Layout>
    </>)
};
export default FormConfig;