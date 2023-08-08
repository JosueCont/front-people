import React, { useState, useMemo } from 'react';
import {
    Tabs,
    Button,
    Space,
    Table,
    Modal,
    Typography,
    message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import ModalFixed from './ModalFixed';
import ModalGroup from './ModalGroup';
import {
    getFixedConcept,
    getGroupFixedConcept
} from '../../../../redux/payrollDuck';
import WebApiPayroll from '../../../../api/WebApiPayroll';
import ListItems from '../../../../common/ListItems';

const TabsFixed = ({
    currentNode,
    getFixedConcept,
    getGroupFixedConcept,
    fixed_concept,
    load_fixed_concept,
    group_fixed_concept,
    load_group_fixed_concept
}) => {

    const router = useRouter();
    const [tab, setTab] = useState('tab1');
    const [openFixed, setOpenFixed] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);

    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const conditions = [
        // {
        //   name: 'applies_to_unjustified_absences',
        //   label: 'Aplica para faltas injustificadas.',
        //   value: false,
        // },
        // {
        //   name: 'applies_to_excused_absences',
        //   label: 'Aplica para faltas justificadas.',
        //   value: false,
        // },
        {
            name: 'not_applies_to_absences',
            label: 'No aplicar para faltas.',
            value: false,
        },
        // {
        //   name: 'applies_to_paid_permit',
        //   label: 'Aplica para permiso con goce.',
        //   value: false,
        // },
        // {
        //   name: 'applies_to_unpaid_permit',
        //   label: 'Aplica para permiso sin goce.',
        //   value: false,
        // },
        {
            name: 'not_applies_to_disabilities',
            label: 'No aplicar aplicar para incapacidades.',
            value: false,
        },
        {
            name: 'applies_to_vacations',
            label: 'No aplicar para vacaciones.',
            value: false,
        },
    ];

    const createFixed = async (values) => {
        try {
            /** Inicializamos el saldo al crear el concepto programado de forma diferida */
            if (values.num_of_periods > 0 &&
                values.discount_type == 2) values.balance = values.datum;
            let body = { ...values, node: currentNode?.id };
            await WebApiPayroll.fixedConcept('post', body);
            message.success('Concepto registrado')
            getFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Concepto no registrado')
        }
    }

    const updateFixed = async (values) => {
        try {
            await WebApiPayroll.fixedConcept(`put`, values, `${itemToEdit?.id}/`);
            message.success('Concepto actualizado')
            getFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Concepto no actualizado')
        }
    }

    const deleteFixed = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPayroll.fixedConcept("delete", null, `${id}/`);
            message.success('Concepto eliminado')
            getFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Conceptp no eliminado')
        }
    }

    const createGroup = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPayroll.groupFixedConcept('post', body);
            message.success('Grupo registrado')
            getGroupFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Grupo no registrado')
        }
    }

    const updateGroup = async (values) => {
        try {
            await WebApiPayroll.groupFixedConcept('put', values, `${itemToEdit?.id}/`)
            message.success('Grupo actualizado')
            getGroupFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Grupo no actualizado')
        }
    }

    const deleteGroup = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPayroll.groupFixedConcept('delete', null, `${id}/`);
            message.success('Grupo eliminado')
            getGroupFixedConcept(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Grupo no eliminado')
        }
    }

    const dataFixed = (item) => {
        let checksValues = conditions.reduce((acc, record) => {
            let key = record.name;
            if (!key) return { ...acc, [key]: false };
            return { ...acc, [key]: true };
        }, {});
        return {
            ...item,
            ...checksValues,
            concept_type: item.perception_type ? 1 : item.deduction_type ? 2 : 3,
            application_date: item.application_date ? moment(item.application_date, 'YYYY-MM-DD') : null
        }
    }

    const dataGroup = (item) => {
        let ids = item.fixed_concept?.map(item => item.id);
        return {
            name: item.name,
            fixed_concept: ids
        }
    }

    const showModal = () => {
        const setOpen = {
            tab1: setOpenFixed,
            tab2: setOpenGroup
        }
        setOpen[tab](true)
    }

    const showEdit = (item) => {
        let values = tab == 'tab1'
            ? dataFixed(item) : dataGroup(item);
        setItemToEdit(values)
        showModal()
    }

    const closeFixed = () => {
        setOpenFixed(false)
        setItemToEdit({})
    }

    const closeGroup = () => {
        setOpenGroup(false)
        setItemToEdit({})
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const Field = ({
        label = '',
        value = ''
    }) => (
        <Space size={[4, 0]}>
            <Typography.Text strong>{label}</Typography.Text>
            <Typography.Text>{value}</Typography.Text>
        </Space>
    )

    const DetailItem = ({ item = {} }) => (
        <Space size={[0, 0]} direction='vertical'>
            <Field label='Nombre:' value={item?.name} />
            {tab == 'tab1' ? conditions.map((record, idx) => (
                <Field
                    key={idx}
                    value={item[record.name] ? 'Sí' : 'No'}
                    label={record.label.replaceAll('.', ':')}
                />
            )) : (
                <>
                    <Typography.Text strong>Conceptos:</Typography.Text>
                    {item.fixed_concept?.map((record, idx) => (
                        <Typography.Text key={idx}>
                            {record.name}
                        </Typography.Text>
                    ))}
                </>
            )}
        </Space>
    )

    const showDetail = (item) => {
        let title = tab == 'tab1'
            ? 'Detalle del concepto'
            : 'Detalle del grupo';
        Modal.info({
            title,
            icon: null,
            closable: true,
            content: <DetailItem item={item} />,
            okText: 'Cerrar',
            bodyStyle: {
                padding: 18
            }
        })
    }

    const ExtraActions = (
        <Space>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/config/catalogs/copy')}
            >
                Regresar
            </Button>
            <Button onClick={() => showModal()}>
                Agregar
            </Button>
        </Space>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Detalle',
            render: (item) => (
                <EyeOutlined onClick={() => showDetail(item)} />
            )
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Space>
                    <EditOutlined onClick={() => showEdit(item)} />
                    <DeleteOutlined onClick={() => showDelete(item)} />
                </Space>
            )
        }
    ]

    const customTable = {
        tab1: {
            data: fixed_concept,
            loading: load_fixed_concept
        },
        tab2: {
            data: group_fixed_concept,
            loading: load_group_fixed_concept
        },
    }

    const propsTable = useMemo(() => {
        return customTable[tab];
    }, [
        tab,
        fixed_concept,
        group_fixed_concept
    ])

    return (
        <>
            <Tabs
                type='card'
                className='tabs-internal'
                defaultActiveKey={tab}
                onChange={setTab}
                tabBarExtraContent={ExtraActions}
            >
                <Tabs.TabPane key='tab1' tab='Conceptos fijos' />
                <Tabs.TabPane key='tab2' tab='Grupos' />
            </Tabs>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={propsTable.data}
                loading={propsTable.loading}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalFixed
                tab={tab}
                visible={openFixed}
                close={closeFixed}
                itemToEdit={itemToEdit}
                conditions={conditions}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                actionForm={isEdit ? updateFixed : createFixed}
                title={isEdit ? 'Editar concepto fijo' : 'Agregar concepto fijo'}
            />
            <ModalGroup
                visible={openGroup}
                close={closeGroup}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? updateGroup : createGroup}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit ? 'Editar grupo' : 'Agregar grupo'}
            />
            <ListItems
                title='¿Estás seguro de eliminar este registro?'
                visible={openDelete}
                keyTitle='name'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={tab == 'tab1' ? deleteFixed : deleteGroup}
                timeLoad={1000}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        fixed_concept: state.payrollStore.fixed_concept,
        load_fixed_concept: state.payrollStore.load_fixed_concept,
        group_fixed_concept: state.payrollStore.group_fixed_concept,
        load_group_fixed_concept: state.payrollStore.load_group_fixed_concept,
        currentNode: state.userStore.current_node,
        permissions: state.userStore.permissions
    }
}

export default connect(
    mapState, {
    getFixedConcept,
    getGroupFixedConcept
}
)(TabsFixed);