import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button } from "antd";

const InabilityReport = (props) => {
  const route = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const [personList, setPersonList] = useState([]);
  const [collaboratorList, setCollaboratorList] = useState([]);

  /* Columnas de tabla */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "Colaborador",
      key: "Colaborador",
    },
    {
      title: "Empresa",
      dataIndex: "Empresa",
      key: "Empresa",
    },
    {
      title: "Departamento",
      dataIndex: "Departamento",
      key: "Departamento",
    },
    {
      title: "Fecha inicio de incapacidad",
      dataIndex: "Fecha inicio de incapacidad",
      key: "Fecha inicio de incapacidad",
    },
    {
      title: "Fecha fin de incapacidad",
      dataIndex: "Fecha fin de incapacidad",
      key: "Fecha fin de incapacidad",
    },
    {
      title: "Estatus",
      dataIndex: "Estatus",
      key: "Estatus",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const getAllPersons = async () => {
    try {
      let response = await axiosApi.get(`/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
        <Col>
          <Form
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
          >
            <Row gutter={[24, 8]}>
              <Col>
                <Form.Item
                  key="collaborator"
                  name="collaborator"
                  label="Colaborador"
                >
                  <Select
                    key="selectPerson"
                    showSearch
                    /* options={personList} */
                    style={{ width: 150 }}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {personList
                      ? personList.map((item) => {
                          return (
                            <Option key={item.key} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item key="company" name="company" label="Empresa">
                  <Select style={{ width: 150 }}></Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  key="department_select"
                  name="department"
                  label="Departamento"
                >
                  <Select style={{ width: 150 }}></Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="send_date"
                  label="Fecha de envio"
                  key="send_date"
                  labelCol={24}
                >
                  <RangePicker /* onChange={onchangeRange} */ />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
                <Button
                  style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                    marginTop: "auto",
                  }}
                  key="buttonFilter"
                  htmlType="submit"
                >
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="columnRightFilter">
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => route.push("holidays/new")}
            key="btn_new"
          >
            Descargar
          </Button>
        </Col>
      </Row>
      <Row style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Table
            scroll={{ x: 1500 }}
            dataSource={collaboratorList}
            key="tableHolidays"
            columns={columns}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default InabilityReport;
