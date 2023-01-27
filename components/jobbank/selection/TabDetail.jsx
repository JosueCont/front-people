import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, Button, Table, message, Dropdown, Menu} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleEmail,
    rulePhone
} from '../../../utils/rules';
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { optionsStatusSelection } from '../../../utils/constant';
import ModalComments from './ModalComment';
import { EditorState } from 'draft-js';
import ListItems from '../../../common/ListItems';


const TabDetail = ({ listComments, loading, setLoading, id, person, getInfoVacant }) => {

    const [openModal, setOpenModal] = useState(false);
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [itemsToDelete, setItemsToDelete] = useState({});
    const [itemToEdit, setItemToEdit] = useState({})
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const closeModal = () =>{
        setOpenModal(false)
        setMsgHTML('<p></p>');
        setEditorState(EditorState.createEmpty())
    }


    const actionCreate = async () => {
        setLoading(true)
        let data = new FormData()
        data.append('person', person)
        data.append('comments', msgHTML)
        try {
            let response = await WebApiJobBank.updateDetailSelection(id, data)
            console.log('Response', response)
            getInfoVacant(id)
            message.success('Comentario agregado')
            
        } catch (error) {
            console.log('Error', error)
            message.error('No se guardó el comentario')
        } finally {
            setLoading(false)
        }
    }

    const openModalRemove = (item) =>{
        item.comments = item.comments?.replace(/<[^>]*>?/g, '') || ''
        setItemsToDelete(item)
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete({})
    }

    const actionDelete = async () => {
        try {
            let response = await WebApiJobBank.deleteProcessSelection(itemsToDelete.id)
            getInfoVacant(id)
            message.success('Comentario eliminado')
            
        } catch (error) {
            console.log('Error', error)
            message.error('Error al eliminar comentario')
        }
    }

    const menuItem = (item) => {
        return (
            <Menu>
                {/* <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)} 
                >
                    Editar
                </Menu.Item> */}
                <Menu.Item
                    key='1'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const colums = [
        {
            title: 'Comentario',
            dataIndex: 'comments',
            render: (comments) => (
                <div dangerouslySetInnerHTML={{ __html: comments }}>

                </div>
            )
        },
        {
            title: ()=> (
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <Button 
                      size='small' 
                      onClick={()=> setOpenModal(true)}
                    >
                        Agregar
                    </Button>
                </div>
            ),
            render: (item) => 
{                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )}
        }
    ]

  return(
        <>
            <Row gutter={[24,0]} className='tab-client'>
                <Col xs={24} xl={24} xxl={24}>
                    <Row gutter={[24,0]}>
                        <Col xs={24} md={12} xl={12} xxl={12}>
                            <Form.Item
                                name='candidate'
                                label='Candidato'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input maxLength={50} disabled={true}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={12} xxl={12}>
                            <Form.Item
                                name='vacant'
                                label='Vacante'
                                rules={[
                                    ruleRequired,
                                ]}
                            >
                                <Input maxLength={13} disabled/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={12} xxl={12}>
                            <Form.Item 
                                name='email'
                                label='Correo electrónico'
                                rules={[ruleEmail]}
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={12} xxl={8}>
                            <Form.Item
                                name='telephone'
                                label='Telefono'
                                rules={[rulePhone]}
                            >
                            <Input maxLength={10} disabled/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} xl={12} xxl={8}>
                            <Form.Item label='Estatus' name='status_process' rules={[ruleRequired]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder='Seleccionar un sector'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {optionsStatusSelection.length > 0 && optionsStatusSelection.map(item => (
                                        <Select.Option value={item.value} key={item.key}>
                                            {item.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} xl={24} xxl={24}>
                    <Row gutter={[24,0]}>
                        <Col span={24}>
                            <Table 
                                rowKey='id'
                                className='table-custom'
                                loading={loading}
                                locale={{ emptyText: listComments?.length > 0
                                    ? 'Cargando...'
                                    : 'No se encontraron resultados'
                                }}
                                size='small'
                                dataSource={listComments}
                                columns = { colums }
                                pagination={{
                                    hideOnSinglePage: true,
                                    showSizeChanger: false
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ModalComments 
                title='Agregar comentario'
                visible={openModal}
                close={closeModal}
                actionForm={actionCreate}
                textSave={'Guardar'}
                setMsgHTML = { setMsgHTML }
                setEditorState = {setEditorState}
                editorState = { editorState }
            />

            <ListItems
                title={'¿Estás seguro de eliminar este comentario?'}
                visible={openModalDelete}
                keyTitle='comments'
                close={closeModalDelete}
                itemsToList={[itemsToDelete]}
                actionConfirm={actionDelete}
            />
        </>
  )
}


export default TabDetail