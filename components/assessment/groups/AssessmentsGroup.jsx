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
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import { ruleRequired } from "../../../utils/rules";
import {
  CustomInput,
  ButtonDanger,
  CompactSelect,
  CompactButton,
} from "./Styled";

const AssessmentsGroup = ({ ...props }) => {
  const [formGroup] = Form.useForm();
  const { Option } = Select;
  const [surveysSelect, setSurveysSelect] = useState([]);
  const [surveysTable, setSurveysTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadAdd, setLoadAdd] = useState(false);

  useEffect(() => {
    if (props.surveyList && props.loadData.assessments) {
      formGroup.setFieldsValue({ name: props.loadData.name });
      filterSurveys(props.loadData.assessments);
    } else if (props.surveyList) {
      setSurveysSelect(props.surveyList);
    }
  }, []);

  const filterSurveys = (dataTable) => {
    let select = [];
    let table = [];
    props.surveyList.map((a) => {
      let result = dataTable?.some((b) => a.id === b.id);
      if (result) {
        table.push(a);
      } else {
        select.push(a);
      }
    });

    setSurveysSelect(select);
    setSurveysTable(table);
  };

  const onCloseModal = () => {
    props.close();
    setSurveysSelect([]);
    setSurveysTable([]);
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
      message.error("Selecciona al menos dos encuestas");
    }
  };

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
        return <DeleteOutlined onClick={() => deleteItem(index)} />;
      },
    },
  ];

  const onChangeSurvey = async (value) => {
    let result = props.surveyList.filter((item) => item.id === value);
    let newList = [...surveysTable, result.at(-1)];
    console.log("newList", newList);
    filterSurveys(newList);
    formGroup.setFieldsValue({ assessment: null });
  };

  const deleteItem = (index) => {
    let newList = [...surveysTable];
    newList.splice(index, 1);
    filterSurveys(newList);
  };

  return (
    <MyModal title={props.title} visible={props.visible} close={onCloseModal}>
      <Form
        onFinish={onFinish}
        form={formGroup}
        requiredMark={false}
        layout={"vertical"}
      >
        <Row gutter={[8, 16]}>
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
            <Form.Item
              name={"assessment"}
              label={"Seleccionar encuesta"}
              style={{ marginBottom: "0px" }}
            >
              <Select
                showSearch
                placeholder="Seleccionar encuesta"
                onChange={onChangeSurvey}
                notFoundContent="No se encontraron resultados"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {surveysSelect.length > 0 &&
                  surveysSelect.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Encuestas seleccionadas"}>
              <Table
                rowKey={"id"}
                columns={colums}
                showHeader={false}
                dataSource={surveysTable}
                size={"small"}
                loading={loading}
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

export default AssessmentsGroup;
