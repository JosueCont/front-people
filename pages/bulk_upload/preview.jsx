import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  message,
  Modal,
  Alert,
  Result,
  Space
} from "antd";
import router, { useRouter } from "next/router";
import { connect } from "react-redux";
import { withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";
import {
  EyeOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  WarningOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import WebApiPeople from "../../api/WebApiPeople";

const PreviewBulkUpload = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataUpload, setDataUpload] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [arrColumns, setArrColumns] = useState([]);
  const [messageSave, setMessageSave] = useState(null);
  const [templateType, setTemplateType] = useState(null);
  const [errorImportar, setErrorImportar] = useState(null);

  /* Columns */
  const columns = [
    {
      title: "Nombre",
      key: "name",
      render: (item) => {
        return item.name ? (
          <span>{item.name}</span>
        ) : (
          <span>
            {item.first_name + " " + item.flast_name + " " + item.mlast_name}
          </span>
        );
      },
    },
    {
      title: "Guardado",
      key: "id",
      render: (item) => {
        return item.status && item.status !== "Exists" ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <p>Pendiente</p>
        );
      },
    },
    {
      title: "Detalles",
      key: "actions",
      render: (item) => {
        return (
          item.status_log &&
          (
            <EyeOutlined
              className="icon_actions"
              onClick={() => viewDetails(item.status_log)}
            />
          )
        );
      },
    },
  ];

  const viewDetails = (data, type) => {
    let errors_list = data.split(",")
    setErrors(errors_list);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (props.formData) {
      WebApiPeople.BulkMassivePerson(props.formData)
        .then((response) => {
          
          setArrColumns(columns);
          setDataUpload(response.data.data);
          setTemplateType(response.data.type);
          setLoading(false);
          //message.success("Excel importado correctamente.");
        })
        .catch((e) => {
          setLoading(false);
          setErrorImportar(true)
          message.error("Error al importar.");
          
        });
    }
  }, [props.formData]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const viewErrosDetail = (errorsSection) =>{
    let errors_list = []
    /* Validamos si el error es de khonnect_id */

    if('khonnect_id' in errorsSection){
      errors_list = errorsSection['khonnect_id'] !== "" ? [errorsSection['khonnect_id']] : ["Usuario no generado"]
    }
    
    
    if(errorsSection['message']){
      if(errors_list.length === 0){
        errors_list = [errorsSection['message']]
      }else{
        errors_list.push(errorsSection['message'])
      }
    }
    
    
    setErrors(errors_list);
    setIsModalVisible(true);
    
  }
  
  const shoeDetailsPerson = (info, dataIndex) =>{
    
    for (let i = 0; i < info?.length; i++) {
      if(dataIndex ===  info[i]['section']  && info[i]['saved'] == false){
        return <>
          <WarningOutlined
              className="icon_actions"
              onClick={() => viewErrosDetail(info[i])}
            />
        </>
        break;
      }else if(dataIndex ===  info[i]['section']  && info[i]['saved'] == true){
        return <CheckCircleTwoTone twoToneColor="#52c41a" />
      }
    }
  }


  const addColumns = (dataPerson) =>{
    let currentColumns = [...arrColumns]
    currentColumns = currentColumns.filter(item => item.key !== 'actions')
  
    dataPerson.map(person => {
      person?.sections.map(section => {
        let idx = currentColumns.findIndex(column => column.key === section.section)
        if(idx <= -1){
          let nameColumn =  section.section === "worktitle" ? "Plaza" : 
                            section.section === "khonnect" ? "Usuario" :
                            section.section === "bank account" ? "Cuenta bancaria" :
                            section.section === "payroll" ? "Nomina" :
                            section.section === "fiscal address" ? "Dirección fiscal" :
                            section.section === "infonavit_credit" ? "Infonavit" :
                            section.section === "social_security" ? "Red social" : ""
          currentColumns.push({
            title: nameColumn,
            key: section.section,
            dataIndex: 'sections',
            render: (infoSections) => shoeDetailsPerson(infoSections, section.section)
          })
        }
      })
    })

    setArrColumns(currentColumns)

  }

  const savePersons = () => {
    Modal.confirm({
      title: "¿Está seguro de guardar?",
      content:
        "Los datos importados correctos se guardarán, los que contengan errores serán omitidos ",
      icon: <ExclamationCircleOutlined />,
      okText: "Sí,guardar",
      okButtonProps: {
        danger: true,
      },
      onCancel() {},
      cancelText: "Cancelar",
      onOk() {
        if (dataUpload && dataUpload.length > 0) {
          const user_session = JSON.parse(jsCookie.get("token"));
          setLoading(true);

          const data = {
            persons: dataUpload,
            type: templateType,
            node_id: props?.currentNode?.id
          };
          WebApiPeople.saveMassivePerson(data)
            .then((response) => {
              if(response.status === 200){
                addColumns(response.data.people) 
              }
              setDataUpload(response.data.people);
              setMessageSave(response.data.message);
              message.info(response.data.message);
              setLoading(false);
              setDisabledButton(true);
            })
            .catch((response) => {
              setLoading(false);
              /* setDataUpload(response.data.persons);
              setMessageSave(response.data.message); */
              if(response?.response?.data?.message){
                message.error(response?.response?.data?.message)
              }else{
                message.error("Error al agregar, intente de nuevo");
              }

            });
        } else {
          message.error("No se encontraron datos.");
        }
      },
    });
  };

  return (
    <MainLayout currentKey={["bulk_upload"]} defaultOpenKeys={["uploads"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Registro de log</Breadcrumb.Item>
        <Breadcrumb.Item>Vista previa de carga</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify={"end"} style={{ padding: "1% 0" }}>
          {!disabledButton  && (
            <Button
              onClick={savePersons}
              className={"ml-20"}
              type="primary"
              size={{ size: "large" }}
              icon={<SaveOutlined />}
            >
              Guardar
            </Button>
          )}

          <Button
            onClick={() => router.push("/home/persons")}
            className={"ml-20"}
            type="primary"
            size={{ size: "large" }}
            icon={<ArrowLeftOutlined />}
          >
            Regresar
          </Button>
        </Row>
        <Row justify="center">
          <Col span={10}>
            {messageSave && <Alert message={messageSave} type="info" />}

            <br />
          </Col>
          <Col span={24}>

            {
                errorImportar ? <Result
                    status="warning"
                    title="No se pudo leer correctamente el archivo seleccionado, por favor revisa tu información y vuelve a intentar"
                    extra={

                      <Button
                          onClick={() => router.push("/home/persons")}
                          type="primary" key="console">
                        Regresar
                      </Button>
                    }
                /> :
              <Table
                dataSource={dataUpload}
                key="tableLog"
                loading={loading}
                columns={arrColumns}
                locale={{
                emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
              }}
                ></Table>
            }


          </Col>
        </Row>
      </div>
      <Modal
        title="Errores en la carga"
        visible={isModalVisible}
        onOk={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        
        <Space direction="vertical" >
          {errors &&
          errors.map(item => (
              <Alert message={item} type="warning" showIcon />
          ))
          }
        </Space>
      </Modal>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    formData: state.userStore.data_upload,
    currentNode: state.userStore.current_node
  };
};

export default connect(mapState)(withAuthSync(PreviewBulkUpload));
