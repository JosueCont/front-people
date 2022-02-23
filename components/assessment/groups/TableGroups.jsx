import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
    Avatar
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    FileTextOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import FormGroup from "./FormGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import ViewSurveys from "./ViewSurveys";
import ViewMembers from "./ViewMembers";
import DeleteGroups from "./DeleteGroups";

const TableGroups = ({hiddenMembers = true, hiddenSurveys = true, ...props}) => {

  const menuDropDownStyle = { background: "#434343", color: "#ffff"};
  const permissions = useSelector(state => state.userStore.permissions.person)
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalSurveys, setShowModalSurveys] = useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [itemGroup, setItemGroup] = useState({});
  const [groupsToDelete, setGroupsToDelete] = useState([]);
  const [groupsKeys, setGroupsKeys] = useState([]);
  const router = useRouter();
  const { confirm } = Modal;

  const HandleChangeStatus = (value) => {
      console.log(value)
  }

  const HandleUpdateGroup = (item) => {
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

  const openModalSurveys = (item)=>{
    setShowModalSurveys(true)
    setItemGroup(item)
  }

  const openModalMembers = (item) =>{
    setShowModalMembers(true)
    setItemGroup(item)
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

  const onChangePage = (pagination) => {
    if (pagination.current > 1) {
      const offset = (pagination.current - 1) * 10;
      const queryParam = `&limit=10&offset=${offset}`;
      props.getListGroups(queryParam)
    } else if (pagination.current == 1) {
      props.getListGroups("")
    }
  }

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
        render: (item) => {
          return (
            <div>
              {item.name}
            </div>
          );
        },
      },
      {
        title: "Encuestas",
        hidden: hiddenSurveys,
        render: (item) => {
          return (
            <Space>
              <Tag
                  icon={<FileTextOutlined style={{color:'#096dd9'}} />}
                  color={'blue'}
                  style={{fontSize: '14px'}}
                >
                  {item.assessments ? item.assessments.length : 0}
              </Tag>
              {item.assessments?.length > 0 &&(
                <Tooltip title='Ver encuestas'>
                    <EyeOutlined
                      style={{cursor: 'pointer'}}
                      onClick={()=>openModalSurveys(item)}
                    />
                </Tooltip>
              )}
            </Space>
          )
        }
      },
      {
        title: "Integrantes",
        hidden: hiddenMembers,
        render: (item) => {
          return (
            <Space>
              <Tag
                icon={<UserOutlined style={{color:'#52c41a'}} />}
                color={'green'}
                style={{fontSize: '14px'}}
              >
                {item.persons ? item.persons.length : 0}
              </Tag>
              {item.persons?.length > 0 && (
                <Tooltip title='Ver integrantes'>
                  <EyeOutlined
                    style={{cursor: 'pointer'}}
                    onClick={()=>openModalMembers(item)}
                  />
                </Tooltip>
              )}
            </Space>
          )
        },
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
  ].filter(col => !col.hidden)

  return(
    <>
        <Row>
            <Col span={24}>
                <Table
                  rowKey={'id'}
                  columns={columns}
                  loading={props.loading}
                  dataSource={
                    props.filterActive ?
                    props.filterValues :
                    props.dataGroups?.results
                  }
                  locale={{
                    emptyText: props.loading ?
                    "Cargando..." :
                    "No se encontraron resultados."
                  }}
                  pagination={{
                      pageSize: 10,
                      total: props.dataGroups?.count,
                  }}
                  onChange={onChangePage}
                  rowSelection={rowSelectionGroup}
                />
            </Col>
        </Row>
        {showModalEdit && (
          <FormGroup
              title={'Editar grupo'}
              visible={showModalEdit}
              close={HandleClose}
              loadData={itemGroup}
              actionForm={onFinishEdit}
              hiddenMembers={hiddenMembers}
              hiddenSurveys={hiddenSurveys}
          />
        )}
        {showModalSurveys && (
          <ViewSurveys
            title={'Lista de encuestas'}
            visible={showModalSurveys}
            setVisible={setShowModalSurveys}
            item={itemGroup}
          />
        )}
        {showModalMembers && (
          <ViewMembers
            title={'Lista de integrantes'}
            visible={showModalMembers}
            setVisible={setShowModalMembers}
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

export default TableGroups