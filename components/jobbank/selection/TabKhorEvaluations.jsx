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
    currentNodeId,
    personAssignament
}) => {

    const [ searchAsignaments, setSearchAsignaments ] = useState([])

    useEffect(() => {
        if(personAssignament.lenght <= 0) return
        setSearchAsignaments(personAssignament)
    },[personAssignament])

    const onFilter = ({ target: { value } }) =>{
        if(value.trim()){
            const filter_ = item => valueToFilter(item.name).includes(valueToFilter(value));
            let results = personAssignament.filter(filter_);
            setSearchAsignaments(results)
            return;
        }
        setSearchAsignaments(personAssignament)
    }

    const columns = [
        {
            title: 'Evaluación',
            dataIndex: 'name'
        },
        {
            title: 'Grupo de evaluaciones',
            dataIndex: ['group', 'name'],
        },
        {
            title: 'Estatus',
            render: (record) => {
                if(record?.applys[0]?.status == 0){
                  return(
                    <span>Pendiente</span>
                  )
                }else if(record?.applys[0]?.status == 1) {
                  return(
                    <span>Iniciada</span>
                  )
                }else if(record?.applys[0]?.status ==2) {
                  return(
                    <span>Finalizada</span>
                  )
                }
              }
        },
        {
            title: 'Progreso',
            render: (record) => {
                return record?.applys[0] ? <span>{record.applys[0].progress}%</span> : <span></span>;
              }
        },
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
                    {/* <Col span={12} style={{display: 'flex'}}>
                        <Button
                            onClick={ () => setOpenModal(true)}
                            style={{marginLeft: 'auto'}}
                        >
                            Agregar
                        </Button>
                    </Col> */}
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
        </>
    )
}

export default TabKhorEvaluations