import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Space,
  Select,
  Table,
  Checkbox,
  message,
  Radio,
  Tooltip,
  List,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import { ruleRequired } from "../../../utils/rules";
import {
  CustomInput,
  ButtonDanger,
  CompactSelect,
  CompactButton,
} from "./Styled";
import { connect } from "react-redux";
import WebApiAssessment from "../../../api/WebApiAssessment";
import {setErrorFormAdd, setModalGroup, setModalGroupEdit} from '../../../redux/assessmentDuck'

const AssessmentsGroup = ({
  assessmentStore,
  userStore,
  setErrorFormAdd,
  setModalGroup,
  setModalGroupEdit,
  ...props
}) => {
  const [formGroup] = Form.useForm();
  const { Option } = Select;
  const [surveysSelect, setSurveysSelect] = useState([]);
  const [surveysTable, setSurveysTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadAdd, setLoadAdd] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [fetchingAssessment, setFetchingAssessment] = useState(false);

  useEffect(() => {
    if (props.loadData.assessments){
      formGroup.setFieldsValue({name: props.loadData.name})
      setSurveysTable(props.loadData.assessments)
    }
    if (userStore.current_node?.id) {
      getSurveys(userStore.current_node.id, "&is_active=true");
    }
  },[]);


  useEffect(() => {
    if(assessmentStore.error_form_add){
      formGroup.setFields([
        { name: 'name', errors: [assessmentStore.error_form_add] },
      ]);
    }
  }, [assessmentStore.error_form_add])
  

  const getSurveys = async (nodeId, queryParam) => {
    setSurveyList([]);
    setFetchingAssessment(true);
    try {
      let response = await WebApiAssessment.getListSurveys(nodeId, queryParam);
      setSurveyList(response.data);
      setFetchingAssessment(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filterSurveys = () =>{
    let prevList = [...surveyList];
    let newList = [];     
    prevList.map((item)=>{
      let result = surveysTable.some(record => item.id === record.id);
      if(!result){
        newList.push(item)
      }
    })
    return newList;
  }

  const addAssessment = (assessment) => {
    setSurveysTable([...surveysTable, assessment]);
  };

  const onCloseModal = () => {
    if(props.loadData.assessments){
      setModalGroupEdit(false)
    }else{
      setModalGroup(false)
      setErrorFormAdd(false)
    }
  };

  const getOnlyIds = () => {
    let ids = [];
    surveysTable.map((item) => {
      ids.push(item.id);
    });
    return ids;
  };

  const onFinish = (values) => {
    if (surveysTable.length > 1) {
      const ids = getOnlyIds();
      setLoadAdd(true);
      setTimeout(() => {
        props.actionForm({ name: values.name, assessments: ids });
        setLoadAdd(false);
      }, 2000);
    } else {
      message.error("Selecciona al menos dos Evaluaciones");
    }
  };

  const columnsAssessment = [
    {
      title: "Nombre",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Agregar",
      width: 50,
      render: (item, record, index) => {
        return (
          <PlusCircleOutlined
            style={{ cursor: "pointer" }}
            onClick={() => addAssessment(item)}
          />
        );
      },
    },
  ];

  const colums = [
    {
      title: "Nombre",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Acciones",
      width: 50,
      render: (item, record, index) => {
        return <CloseOutlined onClick={() => deleteItem(index)} />;
      },
    },
  ];

  const deleteItem = (index) => {
    let newList = [...surveysTable];
    newList.splice(index, 1);
    setSurveysTable(newList);
  };

  const onChangeCategory = (categoryId) => {
    if (userStore["current_node"] && userStore["current_node"]["id"]) {
      getSurveys(
        userStore.current_node.id,
        categoryId ? `&categories=${categoryId}&is_active=true` : "&is_active=true"
      );
    }
  };

  return (
    <MyModal
      title={props.title}
      visible={props.visible}
      close={onCloseModal}
      widthModal={800}
    >
      <Form
        onFinish={onFinish}
        form={formGroup}
        requiredMark={false}
        layout={"vertical"}
      >
        <Row gutter={[25, 16]}>
          <Col span={12}>
            <Form.Item
              name={"name"}
              label={"Nombre del grupo"}
              style={{ marginBottom: "0px" }}
              rules={[ruleRequired]}
            >
              <CustomInput
                maxLength={50}
                allowClear={true}
                placeholder="Ingresa un nombre"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={"Categoría"}>
              <Select
                placeholder="Seleccionar encuesta"
                onChange={onChangeCategory}
                notFoundContent="No se encontraron resultados"
                optionFilterProp="children"
                defaultValue={""}
              >
                <Option value={""}>Todas</Option>
                {assessmentStore.categories_assessment?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item label={"Agregar evaluaciones"}>
              <Table
                columns={columnsAssessment}
                dataSource={filterSurveys()}
                size={"small"}
                locale={{
                  emptyText: fetchingAssessment
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
                scroll={{ y: 200 }}
                showHeader={false}
                pagination={false}
                loading={fetchingAssessment}
              />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              label={`Evaluaciones seleccionadas (${surveysTable.length})`}
            >
              <Table
                rowKey={"id"}
                columns={colums}
                showHeader={false}
                dataSource={surveysTable}
                size={"small"}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
                scroll={{ y: 200 }}
                pagination={false}
                // className="tableAssesmentsSelected"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row align={"end"}>
          <Space>
            <Button key="back" onClick={onCloseModal}>
              Cancelar
            </Button>
            <Button htmlType="submit" loading={loadAdd}>
              Guardar
            </Button>
          </Space>
        </Row>
      </Form>
    </MyModal>
  );
};
const mapState = (state) => {
  return {
    assessmentStore: state.assessmentStore,
    userStore: state.userStore,
  };
};

export default connect(mapState, { setErrorFormAdd, setModalGroup, setModalGroupEdit })(AssessmentsGroup);
