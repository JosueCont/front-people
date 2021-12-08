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
} from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";

import {
  getUsersList,
  getGroupList,
} from "../../redux/userAndCompanyFilterDuck";
import { getExcelFileAction } from "../../redux/publicationsListDuck";

const CustomCard = styled(Card)`
  width: 100%;
  min-height: 80px;
  margin: 20px 0px;
`;

const CustomButton = styled(Button)`
  width: 90%;
  margin: auto;
  border-radius: 5px;
  margin-top: 27px;
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
  margin: auto;
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

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const handleChange = (event) => {
    console.log(event);
  };

  function getSelectedDate(value, dateString) {
    // console.log(value);
    if (dateString.length == 2) {
      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
      setDatePickerValue(value);
    }
  }

  useEffect(() => {
    console.log("Respuesta de la api de excel", props.excelFileStatus);
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
      // console.log('Lista de usuarios en vista de tabla', props.usersList);
      setUsersList(props.usersList);
    }
  }, [props.usersList]);

  useEffect(() => {
    if (props.groupList && props.groupList.length > 0) {
      console.log("Lista de grupos en vista de tabla", props.groupList);
      let activeGroups = [];
      props.groupList.map((group) => {
        if (group.is_active) {
          activeGroups.push(group);
        }
        // setGroupList(activeGroups);
      });

      setGroupList(props.groupList);
    }
  }, [props.groupList]);

  const getPostsByFilter = () => {
    let userParam = user && user != "" ? `owner__khonnect_id=${user}` : "";
    let groupParam = group && group != "" ? `&group=${group}` : "";
    let dateRange =
      startDate && endDate
        ? `&start_date=${startDate}&end_date=${endDate}`
        : "";

    // seteamos parámetros globales para el paginado
    props.setParameters(`${userParam}${groupParam}${dateRange}`);
    props.getPostsByFilter("", `${userParam}${groupParam}${dateRange}`);
  };

  const getExcelFile = () => {
    let userParam = user && user != "" ? `&owner__khonnect_id=${user}` : "";
    let groupParam = group && group != "" ? `&group=${group}` : "";
    let dateRange =
      startDate && endDate
        ? `&start_date=${startDate}&end_date=${endDate}`
        : "";

    // seteamos parámetros globales para el paginado
    props.setParameters(`${userParam}${groupParam}${dateRange}`);
    // Genera el pdf
    props.getExcelFileAction(`${userParam}${groupParam}${dateRange}`);
    // Actualiza la tabla con los filtros
    props.getPostsByFilter("", `${userParam}${groupParam}${dateRange}`);
  };
  const clearFilter = () => {
    setGroup("");
    setUser("");
    setStartDate("");
    setEndDate("");
    setDatePickerValue();
    props.getPostsByFilter(1, "", false);
  };

  return (
    <>
      <CustomCard>
        <Row>
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Row>
              <Col span={24}>
                <InputLabel>Grupo</InputLabel>
              </Col>
              <CenterItemsCol span={24}>
                <CustomSelect
                  value={group ? group : null}
                  placeholder="Seleccionar grupo"
                  onChange={(value) => setGroup(value)}
                >
                  {groupList &&
                    groupList.map((group) => (
                      <Option value={group.id}>{group.name}</Option>
                    ))}
                </CustomSelect>
              </CenterItemsCol>
            </Row>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Row>
              <Col span={24}>
                <InputLabel>Fecha</InputLabel>
              </Col>
              <CustomCol style={{ textAlign: "center" }} span={24}>
                <RangePicker
                  value={datePickerValue ? datePickerValue : null}
                  onChange={getSelectedDate}
                  format={"YYYY-MM-DD"}
                />
              </CustomCol>
            </Row>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Row>
              <Col span={24}>
                <InputLabel>Autor</InputLabel>
              </Col>
              <CenterItemsCol span={24}>
                <CustomSelect
                  value={user ? user : null}
                  placeholder="Seleccionar un autor"
                  onChange={(value) => setUser(value)}
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
                {/* <CustomInput onChange={handleChange} placeholder="Nombre del autor"/> */}
              </CenterItemsCol>
            </Row>
          </Col>

          <CenterItemsCol xs={12} sm={8} md={8} lg={3} xl={3}>
            <CustomButton icon={<SearchOutlined />} onClick={getPostsByFilter}>
              Filtrar
            </CustomButton>
          </CenterItemsCol>
          <CenterItemsCol xs={12} sm={8} md={8} lg={3} xl={3}>
            <CustomButton icon={<DownloadOutlined />} onClick={getExcelFile}>
              Excel
            </CustomButton>
          </CenterItemsCol>
          <CenterItemsCol xs={12} sm={8} md={8} lg={3} xl={3}>
            <CustomButton icon={<ClearOutlined />} onClick={clearFilter}>
              Limpiar
            </CustomButton>
          </CenterItemsCol>
        </Row>
      </CustomCard>
    </>
  );
};
const mapState = (state) => {
  return {
    usersList: state.userAndCompanyStore.usersList,
    groupList: state.userAndCompanyStore.groupList,
    excelFileStatus: state.publicationsListStore.excelFileStatus,
  };
};

export default connect(mapState, {
  getUsersList,
  getGroupList,
  getExcelFileAction,
})(PublicationsStatisticsFilters);
