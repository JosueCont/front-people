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
  const [itemGroupPeople, setItemGroupPeople] = useState();
  const [groupsToDelete, setGroupsToDelete] = useState([]);
  const [groupsKeys, setGroupsKeys] = useState([]);

  const HandleUpdateGroup = async (item) => {
    /* let resp = await getOnlyGroup(item.group_kuiz_id); */
    setItemGroupPeople(item)
    setItemGroup(item.group_assessment)
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
    console.log('item seleccionado---------->', item)
    if(item.group_assessment.assessments.length > 0){
      setItemGroup(item)
      setShowModalSurveys(true)
    }else{
      setItemGroup({})
      message.error("El grupo aún no tiene encuestas")
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

  useEffect(() => {
    console.log('surveyList', props.surveyList)
  }, [props])
  

  const removeGroups = async (ids) =>{
    props.setLoading(true)
    props.deteleGroup(ids)
    resetValuesDelete();
  }

  const onFinishEdit = async (values) =>{
    props.setLoading(true)
    props.updateGroup(values, itemGroupPeople.id)
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
        key: 'Name',
        dataIndex: ['group_assessment', 'name']
      },
      {
        title: "Encuestas",
        render: (item) => {
          return (
            <div style={{justifyContent:'center', cursor:'pointer'}}>
              {item.group_assessment?.assessments.length > 0 && (
                <Tooltip title='Ver encuenstas'>
                  <Badge onClick={()=>openModalSurveys(item)} 
                    style={{ backgroundColor: '#52c41a' }}
                  count={
                    <>
                      <FileTextOutlined style={{ color: '#52c41a' }} />
                      {item.group_assessment ? item.group_assessment.assessments.length : 0}
                    </>} />

                  {/* <Tag
                    icon={<FileTextOutlined style={{color:'#52c41a'}} />}
                    color={'green'}
                    style={{fontSize: '14px'}}
                    
                  >
                    
                  </Tag> */}
                </Tooltip>
              )}
            </div>
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
          <AssessmentsGroup
              title={'Editar grupo'}
              visible={showModalEdit}
              close={HandleClose}
              loadData={itemGroup}
              actionForm={onFinishEdit}
              surveyList={props.surveyList}
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