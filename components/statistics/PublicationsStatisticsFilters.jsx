import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Form
} from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { statusActivePost } from "../../utils/constant";
import SelectCollaborator from '../selects/SelectCollaborator'

import {
  getUsersList,
  getGroupList,
} from "../../redux/userAndCompanyFilterDuck";
import { getExcelFileAction } from "../../redux/IntranetDuck";

const CustomCard = styled(Card)`
  width: 100%;
  min-height: 80px;
  margin: 20px 0px;
`;

const CustomButton = styled(Button)`
  width: 100%;
  margin: auto;
  border-radius: 5px;
  //margin-top: 27px;
  max-width: 140px;
  & :hover {
    background-color: var(--primaryColor) !important;
  }
`;
const CustomSelect = styled(Select)`
  width: 90%;
  margin: auto;
  & .ant-select-single:hover {
    border: 1px solid var(--primaryColor);
  }
  & .ant-select-selector:hover,
  .ant-select-selector:focus-within {
    border: 1px solid var(--primaryColor);
  }
  /* border-radius: 5px; */
`;
const InputLabel = styled.p`
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 5px;
  margin-left: 5.5%;
`;
const CustomCol = styled(Col)`
  & .ant-picker-range {
    width: 90% !important;
    margin: auto;
    border-radius: 5px;
    & .ant-picker:hover,
    .ant-picker-focused {
      border: 1px solid var(--primaryColor) !important;
    }
  }
`;
const CenterItemsCol = styled(Col)`
  text-align: center;
  & .ant-btn:hover {
    background-color: var(--primaryColor) !important;
  }
`;

const PublicationsStatisticsFilters = (props) => {
  const [group, setGroup] = useState("");
  const [user, setUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const [form] = Form.useForm();

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const optionsActions = [
    {
      label: "Pendiente",
      value: '2',
    },
    {
      label: "Publicada",
      value: '1',
    },
    {
      label: "Bloqueada",
      value: '0',
    },
  ];

  function getSelectedDate(value, dateString) {
    if (dateString.length == 2) {
      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
      setDatePickerValue(value);
    }
  }

  useEffect(() => {
    if (props.excelFileStatus == "failed") {
      message.warning("No existen datos con los filtros establecidos");
    } else if (props.excelFileStatus == "loading") {
      message.loading({
        content: "Cargando archivo, por favor espere",
        key: "updatable",
      });
    }
  }, [props.excelFileStatus]);

  useEffect(() => {
    if (props.companyId) {
      props.getUsersList(props.companyId);
      props.getGroupList(props.companyId);
    }
  }, [props.companyId]);

  useEffect(() => {
    if (props.usersList && props.usersList.length > 0) {
      setUsersList(props.usersList);
    }
  }, [props.usersList]);

  useEffect(() => {
    if (props.groupList && props.groupList.length > 0) {
      let activeGroups = [];
      props.groupList.map((group) => {
        if (group.is_active) {
          activeGroups.push(group);
        }
      });

      setGroupList(props.groupList);
    }
  }, [props.groupList]);

  const getPostsByFilter = () => {

    const values = form.getFieldValue();

    let userParam = values.user && values.user != "" ? `&owner__khonnect_id=${values.user}` : "";
    let groupParam = values.group && values.group != "" ? `&group=${values.group}` : "";
    let dateRange = "";
    if(values.datePickerValue){
      dateRange = `&start_date=${moment(values.datePickerValue[0]).format('YYYY-MM-DD')}&end_date=${moment(values.datePickerValue[1]).format('YYYY-MM-DD')}`
    }

    let statusParam =
      values.status && values.status !== undefined
        ? `&status=${values.status}`
        : "";

    // seteamos parámetros globales para el paginado
    props.setParameters(`${userParam}${groupParam}${dateRange}${statusParam}`);
    props.getPostsByFilter( props.companyId, "", `${userParam}${groupParam}${dateRange}${statusParam}&is_moderator_view=true` );

    console.log(`${userParam}${groupParam}${dateRange}${statusParam}`);
  };

  const getExcelFile = () => {
    const values = form.getFieldValue();

    let userParam = values.user && values.user != "" ? `&owner__khonnect_id=${values.user}` : "";
    let groupParam = values.group && values.group != "" ? `&group=${values.group}` : "";
    let dateRange = "";
    if(values.datePickerValue){
      dateRange = `&start_date=${moment(values.datePickerValue[0]).format('YYYY-MM-DD')}&end_date=${moment(values.datePickerValue[1]).format('YYYY-MM-DD')}`
    }

    let statusParam =
      values.status && values.status !== undefined
        ? `&status=${values.status}`
        : "";

    // seteamos parámetros globales para el paginado
    /* props.setParameters(`${userParam}${groupParam}${dateRange}`); */
    // Genera el pdf
    props.getExcelFileAction(
      props.companyId,
      `${userParam}${groupParam}${dateRange}${statusParam}&is_moderator_view=true`
    );
    // Actualiza la tabla con los filtros
    /* props.getPostsByFilter(
      props.companyId,
      "",
      `${userParam}${groupParam}${dateRange}`
    ); */
  };
  const clearFilter = () => {
    form.resetFields();
    /* setGroup("");
    setUser(null);
    setStartDate("");
    setEndDate("");
    setDatePickerValue();
    setStatusFilter("") */
    props.getPostsByFilter(props.companyId, 1, "?is_moderator_view=true", false);
  };



  return (
    <>
      <CustomCard>
        <Row gutter={10}>
          <Form form={form} name="name_form" layout="inline">
            <Form.Item name={'group'}>
              <CustomSelect
                  /* value={group ? group : null} */
                  placeholder="Seleccionar grupo"
                  /* onChange={(value) => setGroup(value)} */
                  allowClear
              >
                {groupList &&
                    groupList.map((group) => (
                        <Option value={group.id}>{group.name}</Option>
                    ))}
              </CustomSelect>
            </Form.Item>

            <Form.Item name={'datePickerValue'}>
              <RangePicker
                  /* value={datePickerValue ? datePickerValue : null} */
                  /* onChange={getSelectedDate} */
                  format={"YYYY-MM-DD"}
              />
            </Form.Item>

            
              <SelectCollaborator
                name={'user'}
                  showLabel={false}
                  /* value={user ? user : null} */
                  placeholder="Seleccionar un autor"
                  /* onChange={(value) => setUser(value)} */
                  val='khonnect_id'
                  showSearch
             />
              
            <Form.Item name={'status'}>
              <CustomSelect
                  allowClear
                  placeholder="Seleccionar un status"
                  /* value={statusFilter} */
                  /* onChange={(value) => setStatusFilter(value)} */
                  options={optionsActions}
              />
            </Form.Item>



            <Form.Item>
              <CustomButton
                  icon={<SearchOutlined />}
                  onClick={getPostsByFilter}
              >
                Filtrar
              </CustomButton>
            </Form.Item>


            <Form.Item>
              <CustomButton
                  icon={<DownloadOutlined />}
                  onClick={getExcelFile}
              >
                Excel
              </CustomButton>
            </Form.Item>

            <Form.Item>
              <CustomButton  icon={<ClearOutlined />} onClick={clearFilter}>
                Limpiar
              </CustomButton>
            </Form.Item>



          </Form>
        </Row>

        <Row gutter={10} style={{display:'none'}}>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Grupo">
              <CustomSelect
                  /* value={group ? group : null} */
                  placeholder="Seleccionar grupo"
                  /* onChange={(value) => setGroup(value)} */
                >
                  {groupList &&
                    groupList.map((group) => (
                      <Option value={group.id}>{group.name}</Option>
                    ))}
                </CustomSelect>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Form.Item label="Grupo">
                <RangePicker
                  /* value={datePickerValue ? datePickerValue : null}
                  onChange={getSelectedDate} */
                  format={"YYYY-MM-DD"}
                />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Autor">
              <CustomSelect
                  /* value={user ? user : null} */
                  placeholder="Seleccionar un autor"
                  /* onChange={(value) => setUser(value)} */
                >
                  {usersList &&
                    usersList.map((user) => (
                      <Option
                        value={user.khonnect_id}
                      >{`${user.first_name} ${user.flast_name}`}</Option>
                    ))}
                  {/* <Option value="HiumanLab">HiumanLab</Option>
                                <Option value="Pakal">Pakal</Option> */}
                </CustomSelect>
            </Form.Item>
            {/* <Row>
              <Col span={24}>
                <InputLabel>Autor</InputLabel>
              </Col>
              <CenterItemsCol span={24}>
                
              </CenterItemsCol>
            </Row> */}
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={3}>
            
            {/* <Form.Item label="Estatus">
              <CustomSelect
                  allowClear
                  placeholder="Seleccionar un autor"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  options={optionsActions}
                />
            </Form.Item> */}
            {/* <Row>
              <Col span={24}>
                <InputLabel>Estatus</InputLabel>
              </Col>
              <CenterItemsCol span={24}>
                
                
              </CenterItemsCol>
            </Row> */}
          </Col>

          <Col xs={24} sm={24} md={24} lg={15} xl={8}>
            <Row gutter={10}>
              <CenterItemsCol xs={24} sm={8} md={8} lg={8} xl={8}>
                <CustomButton
                  icon={<SearchOutlined />}
                  onClick={getPostsByFilter}
                >
                  Filtrar
                </CustomButton>
              </CenterItemsCol>
              <CenterItemsCol xs={12} sm={8} md={8} lg={8} xl={8}>
                <CustomButton
                  icon={<DownloadOutlined />}
                  onClick={getExcelFile}
                >
                  Excel
                </CustomButton>
              </CenterItemsCol>
              <CenterItemsCol xs={12} sm={8} md={8} lg={8} xl={8}>
                <CustomButton icon={<ClearOutlined />} onClick={clearFilter}>
                  Limpiar
                </CustomButton>
              </CenterItemsCol>
            </Row>
          </Col>
        </Row>
      </CustomCard>
    </>
  );
};
const mapState = (state) => {
  return {
    usersList: state.userAndCompanyStore.usersList,
    groupList: state.userAndCompanyStore.groupList,
    excelFileStatus: state.intranetStore.excelFileStatus,
  };
};

export default connect(mapState, {
  getUsersList,
  getGroupList,
  getExcelFileAction,
})(PublicationsStatisticsFilters);
