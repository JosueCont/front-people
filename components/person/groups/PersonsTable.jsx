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
    Avatar
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import ViewMembers from "./ViewMembers";
import DeleteGroups from "../../assessment/groups/DeleteGroups";
import PersonsGroup from "./PersonsGroup";
import AssignAssessments from "../assignments/AssignAssessments";
import ViewAssigns from "../assignments/ViewAssigns";
import WebApiAssessment from "../../../api/WebApiAssessment";

const PersonsTable = ({...props}) => {

  const permissions = useSelector(state => state.userStore.permissions.person)
  const currenNode = useSelector(state => state.userStore.current_node)
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAssign, setOpenModalAssign] = useState(false);
  const [showModalAssign, setShowModalAssign] = useState(false);
  const [itemGroup, setItemGroup] = useState({});
  const [groupsToDelete, setGroupsToDelete] = useState([]);
  const [groupsKeys, setGroupsKeys] = useState([]);
  const [modalViewAssign, setModalViewAssign] = useState(false);
  const [listAssignGroup, setListAssignGroup] = useState([]);

  const HandleUpdateGroup = async (item) => {
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

  const openModalMembers = (item) =>{
    setShowModalMembers(true)
    setItemGroup(item)
  }

  const HandleModalAssign = (item) =>{
    setGroupsToDelete([item])
    setShowModalAssign(true)
  }

  const OpenModalAssigns = (item) =>{
    setItemGroup(item)
    getAssigns(item.id, "")
  }

  const getAssigns = async (id, queryParam) =>{
    try {
      let response = await WebApiAssessment.getAssignByGroup(id, queryParam)
      setListAssignGroup(response.data)
      setModalViewAssign(true)
    } catch (e) {
      setListAssignGroup([])
      setModalViewAssign(false)
      console.log(e)
    }
  }

  const getOnlyIds = () =>{
    let ids = [];
    groupsToDelete.map((item)=>{
      ids.push(item.id)
    })
    return ids;
  }

  const resetValuesDelete = ()=>{
    setGroupsKeys([])
    setGroupsToDelete([])
    setShowModalDelete(false)
    setOpenModalDelete(false)
    setShowModalAssign(false)
    setOpenModalAssign(false)
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
      props.getListGroups(currenNode?.id,"",queryParam)
    } else if (pagination.current == 1) {
      props.getListGroups(currenNode?.id,"","")
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

  useEffect(()=>{
    if(openModalAssign){
      if(groupsToDelete.length > 0){
        setShowModalAssign(true)
      }else{
        setOpenModalAssign(false)
        message.error("Selecciona al menos una grupo")
      }
    }
  },[openModalAssign])

  const removeGroups = async (ids) =>{
    props.setLoading(true)
    props.deteleGroup(ids)
    resetValuesDelete();
  }

  const onFinishEdit = async (values) =>{
    props.setLoading(true)
    props.updateGroup(values, itemGroup.id)
  }

  const onFinishAssign = async (values) =>{
    const ids = getOnlyIds();
    props.setLoading(true)
    props.onFinishAssign(values, ids)
    resetValuesDelete();
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
        {permissions.create && (
          <Menu.Item
            key={3}
            onClick={() => HandleModalAssign(item)}>
            Asignar evaluaciónes
          </Menu.Item>
        )}
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
        title: "Integrantes",
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
        title: "Asignaciones",
        render: (item) => {
          return (
            <Tooltip title='Ver asignaciones'>
              <EyeOutlined
                style={{cursor: 'pointer'}}
                onClick={()=>OpenModalAssigns(item)}
              />
            </Tooltip>
          )
        },
      },
      {
        title: () => {
          return (
            <>
              {permissions?.delete && (
                <Dropdown overlay={menuTable}>
                  <Button size="small">
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
                  <Button size="small">
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
                  loading={props.loading}
                  dataSource={props.dataGroups?.results}
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
          <PersonsGroup
              title={'Editar grupo'}
              visible={showModalEdit}
              close={HandleClose}
              loadData={itemGroup}
              actionForm={onFinishEdit}
              personList={props.personList}
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
        <AssignAssessments
          title={'Asignar evaluaciones'}
          visible={showModalAssign}
          close={resetValuesDelete}
          actionForm={onFinishAssign}
        />
        <ViewAssigns
          visible={modalViewAssign}
          setVisible={setModalViewAssign}
          itemList={listAssignGroup}
          itemSelected={itemGroup}
          getAssigns={getAssigns}
        />
    </>
  )
}

export default PersonsTable