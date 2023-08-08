import React, {
    useState,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    Tabs,
    Button,
    Table,
    Space,
    Input,
    Checkbox,
    message
} from 'antd';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import ModalInternal from './ModalInternal';
import WebApiFiscal from '../../../../api/WebApiFiscal';
import { doFiscalCatalogs } from '../../../../redux/fiscalDuck';
import ListItems from '../../../../common/ListItems';
import { valueToFilter } from '../../../../utils/functions';

const TabsInternal = ({
    currentNode,
    permissions,
    version_cfdi,
    doFiscalCatalogs,
    perceptions_int,
    deductions_int,
    other_payments_int,
    load_perceptions_int,
    load_deductions_int,
    load_other_payments_int
}) => {

    const listLoading = {
        tab1: load_perceptions_int,
        tab2: load_deductions_int,
        tab3: load_other_payments_int
    }

    const router = useRouter();
    const [tab, setTab] = useState('tab1');
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(null);
    const [param, setParam] = useState(null);
    const [page, setPage] = useState(1);

    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [urlBase, setUrlBase] = useState('internal-perception-type/');
    const [intConcept, setIntConcept] = useState(false);

    const noValid = [undefined, null, '', ' '];
    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    useEffect(() => {
        setLoading(listLoading[tab])
    }, [
        tab,
        load_perceptions_int,
        load_deductions_int,
        load_other_payments_int
    ])

    const actionCreate = async (values) => {
        try {
            await WebApiFiscal.crudInternalConcept(urlBase, 'post', values);
            doFiscalCatalogs(currentNode?.id, version_cfdi)
            message.success('Información registrada')
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            let msg = txt ? txt : 'Información no registrada';
            message.error(msg)
        }
    }

    const actionUpdate = async (values) => {
        try {
            const url = `${urlBase}/${itemToEdit?.id}/`;
            await WebApiFiscal.crudInternalConcept(url, 'put', values);
            doFiscalCatalogs(currentNode?.id, version_cfdi)
            message.success('Información actualizada')
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            let msg = txt ? txt : 'Información no actualizada';
            message.error(msg)
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiFiscal.crudInternalConcept(`${urlBase}/${id}/`, 'delete');
            doFiscalCatalogs(currentNode?.id, version_cfdi)
            message.success('Registro eliminado')
        } catch (e) {
            console.log(e)
            message.error('Registro no eliminado')
        }
    }

    const onChangeTab = (key) => {
        const list = {
            tab1: 'internal-perception-type/',
            tab2: 'internal-deduction-type/',
            tab3: 'internal-other-payment-type/'
        }
        setTab(key)
        setIntConcept(false)
        setUrlBase(list[key])
        setSearch(null)
        setParam(null)
        setPage(1)
    }

    const createData = (item) => {
        let values = {
            id: item.id,
            code: item.code,
            show: item.show,
            data_type: item.data_type,
            description: item.description,
            apply_assimilated: item.apply_assimilated,
        }
        if (tab == 'tab1') {
            values.perception_type = item.perception_type?.id;
            values.is_salary = item.is_salary;
            values.is_holiday = item.is_holiday;
            values.is_rest_day = item.is_rest_day;
            values.is_seventh_day = item.is_seventh_day;
        }
        if (tab == 'tab2') values.deduction_type = item.deduction_type?.id;
        if (tab == 'tab3') values.other_type_payment = item.other_type_payment?.id;
        return values;
    }

    const showEdit = (item) => {
        let values = createData(item);
        setItemToEdit(values)
        setOpenModal(true)
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const closeModal = () => {
        setItemToEdit({})
        setOpenModal(false)
    }

    const onChangePage = ({ current }) => {
        setPage(current)
    }

    const columns = [
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Nombre',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Código SAT'
        },
        {
            title: 'Estatus',
            render: (item) => item.is_active
                ? 'Activo' : 'Inactivo'
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => item.node != null ? (
                <Space>
                    {permissions?.edit && <EditOutlined onClick={() => showEdit(item)} />}
                    {permissions?.delete && <DeleteOutlined onClick={() => showDelete(item)} />}
                </Space>
            ) : <></>
        }
    ]

    const ExtraActions = (
        <>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/config/catalogs/copy')}
            >
                Regresar
            </Button>
        </>
    )

    const listTitleAdd = {
        tab1: 'Agregar percepción',
        tab2: 'Agregar deducción',
        tab3: 'Agregar otro pago'
    }

    const listTitleEdit = {
        tab1: 'Editar percepción',
        tab2: 'Editar deducción',
        tab3: 'Editar otro pago'
    }

    const onSearch = ({ target: { value } }) => {
        setLoading(true)
        let value_ = noValid.includes(value) ? null : value?.trim();
        setTimeout(() => {
            setSearch(value_)
            setLoading(false)
        }, 500)
    }

    const debouncedResults = useMemo(() => {
        return debounce(onSearch, 500);
    }, []);

    useEffect(() => {
        debouncedResults.cancel();
    }, [])

    const onChangeSearch = useCallback((e) => {
        setParam(e?.target?.value)
        debouncedResults(e)
    }, [])

    const onFilter = (data) => {
        let value = valueToFilter(search);
        return data.filter(item => {
            return valueToFilter(item.description).includes(value) ||
                valueToFilter(item.other_type_payment?.code).includes(value) ||
                valueToFilter(item.perception_type?.code).includes(value) ||
                valueToFilter(item.deduction_type?.code).includes(value) ||
                valueToFilter(item.code).includes(value);
        })
    }

    const results = useMemo(() => {
        const list = {
            tab1: perceptions_int,
            tab2: deductions_int,
            tab3: other_payments_int
        }
        const filter_ = item => item.node != null;
        let records = list[tab] ?? [];
        let rows = intConcept ? records : records.filter(filter_);
        return search ? onFilter(rows) : rows;
    }, [
        tab, intConcept, search,
        perceptions_int,
        deductions_int,
        other_payments_int
    ])

    return (
        <>
            <Tabs
                type='card'
                className='tabs-internal'
                defaultActiveKey={tab}
                onChange={onChangeTab}
                tabBarExtraContent={ExtraActions}
            >
                <Tabs.TabPane key='tab1' tab='Percepciones' />
                <Tabs.TabPane key='tab2' tab='Deducciones' />
                <Tabs.TabPane key='tab3' tab='Otros pagos' />
            </Tabs>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input
                            allowClear
                            value={param}
                            placeholder='Buscar'
                            disabled={loading}
                            onChange={onChangeSearch}
                        />
                        <Checkbox
                            checked={intConcept}
                            onChange={e => setIntConcept(e.target?.checked)}
                        >
                            Ver conceptos del sistema
                        </Checkbox>
                    </Space>
                    {permissions?.create && (
                        <Button onClick={() => setOpenModal(true)}>
                            Agregar
                        </Button>
                    )}
                </div>
                <Table
                    rowKey='id'
                    size='small'
                    columns={columns}
                    dataSource={results}
                    loading={loading}
                    onChange={onChangePage}
                    pagination={{
                        current: page,
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                    }}
                />
            </div>
            <ModalInternal
                tab={tab}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                actionForm={isEdit ? actionUpdate : actionCreate}
                title={isEdit ? listTitleEdit[tab] : listTitleAdd[tab]}
            />
            <ListItems
                title='¿Estás seguro de eliminar este registro?'
                visible={openDelete}
                keyTitle='description'
                keyDescription='code'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
                timeLoad={1000}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        perceptions_int: state.fiscalStore.perceptions_int,
        load_perceptions_int: state.fiscalStore.load_perceptions_int,
        deductions_int: state.fiscalStore.deductions_int,
        load_deductions_int: state.fiscalStore.load_deductions_int,
        other_payments_int: state.fiscalStore.other_payments_int,
        load_other_payments_int: state.fiscalStore.load_other_payments_int,
        cat_perceptions: state.fiscalStore.cat_perceptions,
        cat_deductions: state.fiscalStore.cat_deductions,
        cat_other_payments: state.fiscalStore.cat_other_payments,
        currentNode: state.userStore.current_node,
        version_cfdi: state.fiscalStore.version_cfdi,
        permissions: state.userStore.permissions.document_type
    };
};

export default connect(
    mapState, {
    doFiscalCatalogs
}
)(TabsInternal);