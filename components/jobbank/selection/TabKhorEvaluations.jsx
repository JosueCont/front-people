import React, {
  useState,
  useEffect,
  useMemo
} from 'react'
import { 
  Row, 
  Col , 
  Form, 
  Input, 
  Select, 
  Button, 
  Table, 
  message, 
  Dropdown,
  Tooltip,
  Modal,
  List,
  Menu } 
  from 'antd'
import { 
  SearchOutlined, 
  EllipsisOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UnorderedListOutlined,
  TeamOutlined
} from '@ant-design/icons';
import ModalAsignament from './ModalAsignment';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import WebApiJobBank from '../../../api/WebApiJobBank';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { optionsStatusAsignament, optionsSourceType } from "../../../utils/constant";
import ListItems from '../../../common/ListItems';
import { valueToFilter } from '../../../utils/functions';

const TabKhorEvaluations = ({
    loading,
    setLoading,
    assesments,
    processSelection,
    asignaments,
    getAssesmets,
    currentNodeId
}) => {

    const [openModal, setOpenModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal ] = useState(false)
    const [visibleGroupModal, setVisibleGroupModal ] = useState(false)
    const [itemToEdit, setItemToEdit] = useState({})
    const [itemsToDelete, setItemsToDelete ] = useState ({})
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [ searchAsignaments, setSearchAsignaments ] = useState([])
    const [khorAssessments, setkhorAssessments] = useState([])
    const [evaluationsGroup, setEvaluationsGroup] = useState([])
    const [listGroupNames, setListGroupName ] = useState([])

    useEffect(() => {
      if(currentNodeId){
        getNodeEvaluationsGroup(currentNodeId)
      }
    },[currentNodeId])
  
    const getNodeEvaluationsGroup = async (id) => {
      let stringId = id.toString()
      try {
        let response = await WebApiAssessment.getOnlyGroupAssessmentByNode(stringId);
        if(response.data.results.length > 0){
          setEvaluationsGroup(response.data.results)
        }
      } catch (e) {
        console.log(e)
        return e.response;
      }
    }
    
    useEffect(()=>{
      if(asignaments.length <= 0) return
      let khorAsignament = asignaments.filter((asign) => asign.vacant_assessment.source === 1)
      setSearchAsignaments(khorAsignament) 
    },[asignaments])

    useEffect(() => {
      if(assesments.length <= 0) return
      let khorAssessments = assesments.filter((as) => as.source === 1)
      setkhorAssessments(khorAssessments)
  },[assesments])

    const isEdit = useMemo(()=> Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
        setMsgHTML("<p></p>")
    }

    const actionCreate = async(values) => {
        setLoading(true)
        values.candidate_vacancy = processSelection
        values.additional_information = msgHTML
        try {
            await WebApiJobBank.addVacancyAssesmentCandidateVacancy(values)
            message.success('Evaluación Asignada')
            getAssesmets(processSelection)
        } catch (error) {
            console.log('Error', error)
            message.error('Error al asignar evaluación')
        } finally {
            setLoading(false)
        }
    }

    const actionEdit = async (values) => {
        setLoading(true)
        let id = itemToEdit.id
        values.additional_information = msgHTML
        try {
            await WebApiJobBank.editVacancyAssesmentCandidateVacancy(id, values)
            message.success('Evaluación Actualizada')
            getAssesmets(processSelection)
        } catch (error) {
            console.log('Error', error)
            message.error('Error al actualizar evaluación')
        } finally {
            setLoading(false)
        }
    }

    const openEditModal = (item) => {
        setOpenModal(true)
        setItemToEdit(item)
        if(!item.additional_information) return;
        setMsgHTML(item.additional_information);
        let convert = convertFromHTML(item.additional_information);
        let htmlMsg = ContentState.createFromBlockArray(convert);
        let template = EditorState.createWithContent(htmlMsg);
        setEditorState(template);
    }

    const openDeleteModal = (item) => {
        setVisibleDeleteModal(true)
        setItemsToDelete(item)
    }

  
    const closeModalDelete = () => {
        setVisibleDeleteModal(false)
        setItemsToDelete({})
        setMsgHTML("<p></p>")
    }

    const openGroupModal = (list) => {
      setVisibleGroupModal(true)
      setListGroupName(list)
    }

    const handleOk = () => {
      setVisibleGroupModal(false);
    };
  
    const handleCancel = () => {
      setVisibleGroupModal(false);
    };



    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openEditModal(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openDeleteModal(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        )
    }

    const actionDelete = async () =>{
        setLoading(true)
        try {
            await WebApiJobBank.deleteVacancyAssesmentCandidateVacancy(itemsToDelete.id);
            message.success('Evaluación eliminada');
            getAssesmets(processSelection);
        } catch (e) {
            console.log(e)
            message.error('Evaluación no eliminada');
        } finally{
            setLoading(false)
        }
    }

    const onFilter = ({ target: { value } }) =>{
        if(value.trim()){
            const filter_ = item => valueToFilter(item.vacant_assessment?.name).includes(valueToFilter(value));
            let results = asignaments.filter(filter_);
            setSearchAsignaments(results)
            return;
        }
        setSearchAsignaments(asignaments)
    }

    const columns = [
        {
            title: 'Evaluación',
            render: (item) => item.vacant_assessment? item.vacant_assessment.name : ""
        },
        {
            title: 'Grupo de evaluaciones',
            render: (item) => {

              let { group_assessment } = item?.vacant_assessment
              let listIds = group_assessment.map((gs) => gs.id)
              let listNames = []
              listIds.length > 0 && evaluationsGroup.forEach((gr) => {
                listIds.forEach((ids) => {
                  if(ids === gr.people_group_assessment_id){
                    let { name } = gr
                    listNames.push(name)
                  }
                })
              })

              let listGroup = <>
                {
                  listNames.length >= 1 &&
                  <Tooltip title="Ver grupos de evaluaciones">
                    <UnorderedListOutlined style={{color:"#F99543", marginLeft:"8px"}} onClick={()=> openGroupModal(listNames)} />
                  </Tooltip>
                }
              </>
              
              return listGroup
              
            }
        },
        {
            title: 'Estatus',
            render: (status) => {
                let labelStatus = optionsStatusAsignament.find((item) => item.value === status)?.label || ""
                return labelStatus
            }
        },
        {
            title: 'Progreso',
            render: (item) => {
                let labelSource = optionsSourceType.find((op) => op.value == item.vacant_assessment.source)?.label || ""
                return labelSource
            }
        },
        {
            title: 'Acciones',
            render: (item) => {
                return( 
                    <Dropdown overlay={ () => menuItem(item)}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Row gutter={[0,24]} className='tab-client'>
                <Col span={24} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Col span={12}>
                        <Input
                            placeholder='Buscar...'
                            suffix={<SearchOutlined />}
                            onChange={onFilter}
                        />
                    </Col>
                    <Col span={12} style={{display: 'flex'}}>
                        <Button
                            onClick={ () => setOpenModal(true)}
                            style={{marginLeft: 'auto'}}
                        >
                            Agregar
                        </Button>
                    </Col>
                </Col>
                <Col span={24}>
                    <Table 
                        rowKey='id'
                        size='small'
                        className='table-custom'
                        columns={ columns }
                        dataSource = { searchAsignaments }
                        pagination = {{
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                    />
                </Col>
            </Row>
            <ModalAsignament 
                title= { isEdit? 'Editar evaluación' : 'Asignar evaluación' }
                visible = { openModal }
                close = { closeModal }
                textSave = { isEdit? 'Actualizar' : 'Asignar' }
                assesments = { khorAssessments }
                actionForm = { isEdit? actionEdit : actionCreate }
                itemToEdit = { itemToEdit }
                setMsgHTML = { setMsgHTML }
                setEditorState = {setEditorState}
                editorState = { editorState }
            />
            <ListItems
                title={'¿Estás seguro de eliminar este asignación?'}
                visible={visibleDeleteModal}
                keyTitle='vacant_assessment, name'
                close={closeModalDelete}
                itemsToList={[itemsToDelete]}
                actionConfirm={actionDelete}
            />
            <Modal title={"Grupos asignados"} footer={[]} visible={visibleGroupModal} onOk={handleOk} onCancel={handleCancel}>
              <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                  size="small"
                  dataSource={listGroupNames}
                  renderItem={(item) => <><div style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}><TeamOutlined /><List.Item>{item}</List.Item></div></>}
                />
              </Col>
            </Modal>
        </>
    )
}

export default TabKhorEvaluations