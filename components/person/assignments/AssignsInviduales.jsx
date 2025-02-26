import React, {useState, useEffect, useLayoutEffect} from 'react';
import { DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {
    Row,
    Col,
    Modal,
    Tabs,
    List,
    Table,
    message
} from 'antd';
import {
    ButtonDanger,
    CheckAll,
    DeleteAll,
    CustomTable,
    CustomContent
} from '../../assessment/groups/Styled';
import WebApiAssessment from '../../../api/WebApiAssessment';
import DeleteAssigns from './DeleteAssigns';

const AssignsIndividuales = ({
    getAssigns,
    itemId,
    actionDelete,
    loading,
    listAssigns,
    isClosed,
    ...props
}) =>{

    const { confirm } = Modal;
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [copyKeys, setCopyKeys] = useState([]);
    const [copyRows, setCopyRows] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);

    useEffect(()=>{
        if(isClosed) resetValues();
    },[isClosed])

    const rowSelection = {
        columnWidth: 50,
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            let keys = [...copyKeys, ...selectedRowKeys]
            let rows = [...copyRows, ...selectedRows]
            setItemsKeys(keys)
            setItemsSelected(rows)
        }
    }

    const onChangePage = (pagination) => {
        if (pagination.current > 1) {
            const offset = (pagination.current - 1) * 10;
            const queryParam = `&limit=10&offset=${offset}`;
            getAssigns(itemId, queryParam, "")
        } else if (pagination.current == 1) {
            getAssigns(itemId, "", "")
        }
        validateKeysAndRows()
    }

    const validateKeysAndRows = () =>{
        let keys = [];
        let rows = [];
        itemsSelected.map((a)=>{
            let result = copyRows.some(b => a.id === b.id)
            if(!result){
                keys.push(a.id)
                rows.push(a)
            }
        })
        setCopyKeys(keys)
        setCopyRows(rows)
    }

    const resetValues = () =>{
        setCopyRows([])
        setCopyKeys([])
        setItemsKeys([])
        setItemsSelected([])
        setIsSelectAll(false)
        setShowModalDelete(false)
    }

    const onSelectAll = (e) =>{
        if(e.target.checked){
            let keys  = [];
            let items = [];
            listAssigns.results?.map((item)=>{
                keys.push(item.id)
                items.push(item)
            })
            setItemsKeys(keys)
            setIsSelectAll(true)
            setItemsSelected(items)
        }else{
            resetValues()
        }
    }

    const confirmDeleteAssigns = (ids) => {
        actionDelete(ids,"")
    }

    const deleteOneAssign = (item) =>{
        setItemsSelected([item])
        setShowModalDelete(true)
    }

    const deleteAssigns = () =>{
        if(itemsSelected.length > 0){
            setShowModalDelete(true)
        }else{
            setShowModalDelete(false)
            message.error("Selecciona al menos una asignación")
        }
    }

    const columns = [
        {
            title: "Seleccionar lista actual",
            render: (item) => {
                return (
                    <div>
                        {item.assessment?.name}
                    </div>
                );
            },
            
        },
        {
            title: ()=>{
                return(
                    <DeleteOutlined
                        onClick={()=>deleteAssigns()}
                    />
                )
            },
            width: 100,
            render: (item) => {
                return (
                    <DeleteOutlined
                        onClick={()=>deleteOneAssign(item)}
                    />   
                )
            },
        }
    ]

    return(
        <>
            <Row gutter={[8,16]}>
                {/* {!loading && listAssigns && listAssigns.results && listAssigns.results.length > 0 && (
                    <>
                        <Col span={12}>
                            <CheckAll checked={isSelectAll} onChange={onSelectAll}>
                                Seleccionar todos
                            </CheckAll>
                        </Col>
                        <Col span={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            <DeleteAll onClick={()=>deleteAssigns()} size={'small'}>
                                Eliminar <DeleteOutlined/>
                            </DeleteAll>
                        </Col>
                    </>
                )} */}
                <Col span={24}>
                    <CustomTable
                        dataSource={listAssigns?.results}
                        // showHeader={false}
                        columns={columns}
                        loading={loading}
                        scroll={{y:300}}
                        size={'small'}
                        rowKey={'id'}
                        pagination={{
                            pageSize: 10,
                            total: listAssigns?.count,
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                        locale={{
                            emptyText: loading ?
                            "Cargando..." :
                            "No se encontraron resultados."
                        }}
                        onChange={onChangePage}
                        rowSelection={rowSelection}
                    />
                </Col>
            </Row>
            <DeleteAssigns
                visible={showModalDelete}
                close={resetValues}
                items={itemsSelected}
                actionDelete={confirmDeleteAssigns}
            />
        </>
    )
}

export default AssignsIndividuales