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
/* import {getListSurveys} from '../../../redux/assessmentDuck'; */
import WebApiAssessment from "../../../api/WebApiAssessment";

const AssessmentsGroup = ({ assessmentStore, userStore, ...props }) => {
  const [formGroup] = Form.useForm();
  const { Option } = Select;
  const [surveysSelect, setSurveysSelect] = useState([]);
  const [surveysTable, setSurveysTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadAdd, setLoadAdd] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [fetchingAssessment, setFetchingAssessment] = useState(false);

  /* useEffect(() => {
        if(props.surveyList && props.loadData.assessments){
            formGroup.setFieldsValue({name: props.loadData.name})
            filterSurveys(props.loadData.assessments)
        }else if(props.surveyList){
            setSurveysSelect(props.surveyList)
        }
    },[]); */

  /* const filterSurveys = (dataTable) =>{
        let select = [];
        let table = [];        
        props.surveyList.map((a)=>{
            let result = dataTable?.some(b => a.id === b.id);
            if(result){
                table.push(a)
            }else{
                select.push(a)
            }
        })

        setSurveysSelect(select)
        setSurveysTable(table)
    } */

  const onCloseModal = () => {
    props.close();
    /* setSurveysSelect([])
        setSurveysTable([]) */
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
        onCloseModal();
        setLoadAdd(false);
        props.actionForm({ name: values.name, assessments: ids });
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

  const addAssessment = (assessment) => {
    setSurveysTable([...surveysTable, assessment]);
  };

  useEffect(() => {
    console.log(surveysTable);
  }, [surveysTable]);

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

  const onChangeSurvey = async (value) => {
    let result = props.surveyList.filter((item) => item.id === value);
    let newList = [...surveysTable, result.at(-1)];
    filterSurveys(newList);
    formGroup.setFieldsValue({ assessment: null });
  };

  const deleteItem = (index) => {
    let newList = [...surveysTable];
    newList.splice(index, 1);
    setSurveysTable(newList);
  };

  useEffect(() => {
    if (userStore.current_node?.id) {
      getSurveys(userStore.current_node.id, "");
    }
  }, []);

  const onChangeCategory = (categoryId) => {
    if (userStore["current_node"] && userStore["current_node"]["id"]) {
      getSurveys(
        userStore.current_node.id,
        categoryId ? `&categories=${categoryId}` : ""
      );
    }
  };

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

  const getFilterAssessments = () => {
    let prevList = [...surveyList];
    let newList = [];

    prevList.map((item) => {
      let found = false;
      if (surveysTable.length < 1) {
        found = false;
      } else {
        surveysTable.map((record) => {
          if (record.id === item.id) {
            found = true;
          }
        });
      }
      if (!found) {
        newList.push(item);
      }
    });
    return newList;
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
            <Form.Item label={"Categoria"}>
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
            {/* <Form.Item name={'assessment'} label={'Seleccionar encuesta'} style={{marginBottom: '0px'}}>
                            <Select
                                showSearch
                                placeholder="Seleccionar encuesta"
                                onChange={onChangeSurvey}
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                {surveysSelect.length > 0 && surveysSelect.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> */}
          </Col>
          <Col md={12}>
            <Form.Item label={"Agregar evaluaciones"}>
              <Table
                columns={columnsAssessment}
                dataSource={getFilterAssessments()}
                /* dataSource={
                                    surveyList.filter(item => !surveysTable.includes(item))
                                } */
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
                pagination={{
                  position: ["bottomLeft"],
                  hideOnSinglePage: true,
                }}
                className="tableAssesmentsSelected"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row align={"end"}>
          <Space>
            <Button key="back" onClick={() => props.close()}>
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

export default connect(mapState)(AssessmentsGroup);
