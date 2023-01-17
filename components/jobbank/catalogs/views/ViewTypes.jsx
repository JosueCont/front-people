import React, { useState } from 'react';
import { Row, Col, Select, Form } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { ruleRequired } from '../../../../utils/rules';
import { optionsStatusSelection } from '../../../../utils/constant';

const ViewTypes = ({
    filtersString,
    filtersQuery,
    currentPage
}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const SelectType = () =>{
        return(
            <>
                <Form.Item
                    name='type'
                    label='Estatus'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsStatusSelection}
                    />
                </Form.Item>
                <Form.Item
                    name='notify'
                    label='Mensaje'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={[]}
                    />
                </Form.Item>
            </>
        )
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs actionBtnAdd={()=> setOpenModal(true)}/>
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar notificación'
                    titleEdit='Editar notificación'
                    titleDelete='¿Estas seguro de eliminar esta notificación?'
                    catalogResults={mainData}
                    catalogLoading={loading}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    numPage={currentPage}
                    extraFields={<SelectType/>}
                />
            </Col>
        </Row>
    )
}

export default ViewTypes