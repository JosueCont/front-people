import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Table,
    Row,
    Col,
    Tooltip,
    Tag,
    Modal,
    message,
    Menu,
    Dropdown,
    Button,
    Space,
    List,
    Avatar,
    Badge
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EllipsisOutlined,
    UserOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import WebApiAssessment from "../../../api/WebApiAssessment";
import ViewSurveys from "./ViewSurveys";
import DeleteGroups from "./DeleteGroups";
import AssessmentsGroup from "./AssessmentsGroup";

const AssessmentsTable = ({...props}) => {

  const menuDropDownStyle = { background: "#434343", color: "#ffff"};
  const permissions = useSelector(state => state.userStore.permissions.person)
  const currenNode = useSelector(state => state.userStore.current_node)
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalSurveys, setShowModalSurveys] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [itemGroup, setItemGroup] = useState({});
  // const [itemGroupPeople, setItemGroupPeople] = useState();
  const [groupsToDelete, setGroupsToDelete] = useState([]);
  const [groupsKeys, setGroupsKeys] = useState([]);

  const HandleUpdateGroup = async (item) => {
    /* let resp = await getOnlyGroup(item.group_kuiz_id); */
    // setItemGroupPeople(item)
    setItemGroup(item)
    setShowModalEdit(true)
  }

  
  

  const HandleClose = () =>{
      setShowModalEdit(false)
      resetValuesDelete()
  }

  const HandleDeleteGroup = (item) => {
      setGroupsToDelete([item])
      setShowModalDelete(true)
  }

  const openModalSurveys = async (item)=>{
    // let resp = await getOnlyGroup(item.group_kuiz_id);
    if(item.assessments?.length > 0){
      setItemGroup(item)
      setShowModalSurveys(true)
    }else{
      setItemGroup({})
      message.error("El grupo aún no tiene evaluaciones")
    }
  }

  const resetValuesDelete = ()=>{
    setGroupsKeys([])
    setGroupsToDelete([])
    setShowModalDelete(false)
    setOpenModalDelete(false)
  }

  const rowSelectionGroup = {
    selectedRowKeys: groupsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setGroupsKeys(selectedRowKeys)
      setGroupsToDelete(selectedRows)
    }
  }

  /* const onChangePage = (pagination) => {
    if (pagination.current > 1) {
      const offset = (pagination.current - 1) * 10;
      const queryParam = `&limit=10&offset=${offset}`;
      props.getListGroups(currenNode?.id,"",queryParam)
    } else if (pagination.current == 1) {
      props.getListGroups(currenNode?.id,"","")
    }
    props.setNumPage(pagination.current)
  } */

  useEffect(()=>{
    if(openModalDelete){
      if(groupsToDelete.length > 0){
        setShowModalDelete(true)
      }else{
        setOpenModalDelete(false)
        message.error("Selecciona al menos un grupo")
      }
    }
  },[openModalDelete])
  
  const removeGroups = async (ids) =>{
    props.setLoading(true)
    props.deteleGroup(ids)
    resetValuesDelete();
  }

  const onFinishEdit = async (values) =>{
    props.setLoading(true)
    props.updateGroup(values, itemGroup.id)
  }

  const getOnlyGroup = async (id) =>{
    try {
      let response = await WebApiAssessment.getOnlyGroupAssessment(id);
      return response.data;
    } catch (e) {
      console.log(e)
      return e.response;
    }
  }

  const menuTable = () => {
    return (
      <Menu>
        {permissions?.delete && (
          <Menu.Item
            key={1}
            icon={<DeleteOutlined/>}
            onClick={()=>setOpenModalDelete(true)}
          >
            Eliminar
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const menuGroup = (item) => {
    return (
      <Menu>
        {permissions?.edit && (
          <Menu.Item
            key={1}
            icon={<EditOutlined/>}
            onClick={() => HandleUpdateGroup(item)}
          >
            Editar
          </Menu.Item>
        )}
        {permissions?.delete && (
          <Menu.Item
            key={2}
            icon={<DeleteOutlined/>}
            onClick={() => HandleDeleteGroup(item)}
          >
            Eliminar
          </Menu.Item>
        )}
      </Menu>
    )
  }

  const columns = [
      {
        title: "Nombre",
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: "Evaluaciones",
        render: (item) => {
          return (
            <Space>
              {item.assessments?.length > 0 && (
                <Tooltip title='Ver evaluaciones'>
                  <EyeOutlined
                    style={{cursor: 'pointer'}}
                    onClick={()=>openModalSurveys(item)}
                  />
                </Tooltip>
              )}
              <Tag
                icon={<FileTextOutlined style={{color:'#52c41a'}} />}
                color={'green'}
                style={{fontSize: '14px'}}
              >
                {item.assessments ? item.assessments.length : 0}
              </Tag>
            </Space>
          )
        }
      },
      {
        title: () => {
          return (
            <>
              {permissions?.delete && (
                <Dropdown overlay={menuTable}>
                  <Button style={menuDropDownStyle} size="small">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </>
          )
        },
        render: (item) => {
          return (
            <>
              {(permissions?.edit || permissions?.delete) && (
                <Dropdown overlay={() => menuGroup(item)}>
                  <Button style={menuDropDownStyle} size="small">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </>
          )
        }
      },
  ]

  return(
    <>
        <Row>
            <Col span={24}>
                <Table
                  rowKey={'id'}
                  columns={columns}
                  size={'small'}
                  loading={props?.loading}
                  dataSource={props?.dataGroups}
                  locale={{
                    emptyText: props.loading ?
                    "Cargando..." :
                    "No se encontraron resultados."
                  }}
                  rowSelection={rowSelectionGroup}
                />
            </Col>
        </Row>
        {showModalEdit && (
          <AssessmentsGroup
              title={'Editar grupo'}
              visible={showModalEdit}
              close={HandleClose}
              loadData={itemGroup}
              actionForm={onFinishEdit}
          />
        )}
        {showModalSurveys && (
          <ViewSurveys
            title={'Lista de evaluaciones'}
            visible={showModalSurveys}
            setVisible={setShowModalSurveys}
            item={itemGroup}
          />
        )}
        {showModalDelete && (
          <DeleteGroups
            visible={showModalDelete}
            close={resetValuesDelete}
            groups={groupsToDelete}
            actionDelete={removeGroups}
          />
        )}
    </>
  )
}

export default AssessmentsTable