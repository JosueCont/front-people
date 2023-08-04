import React, {
    useState,
    useEffect,
    useMemo
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
    Checkbox
} from 'antd';
import { useRouter } from 'next/router';
import ModalInternal from './ModalInternal';

const TabsInternal = () => {

    const router = useRouter();
    const [tab, setTab] = useState('tab1');
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

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
            render: (item) => (
                <Space>
                    <EditOutlined onClick={() => showEdit(item)} />
                    <DeleteOutlined onClick={() => showDelete(item)} />
                </Space>
            )
        }
    ]

    const ExtraActions = (
        <>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/config/catalogs')}
            >
                Regresar
            </Button>
        </>
    )

    return (
        <>
            <Tabs
                type='card'
                className='tabs-internal'
                defaultActiveKey={tab}
                onChange={setTab}
                tabBarExtraContent={ExtraActions}
            >
                <Tabs.TabPane key='tab1' tab='Percepciones' />
                <Tabs.TabPane key='tab2' tab='Deducciones' />
                <Tabs.TabPane key='tab3' tab='Otros pagos' />
            </Tabs>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input placeholder='Buscar' allowClear />
                        <Checkbox>Ver conceptos del sistema</Checkbox>
                    </Space>
                    <Button onClick={()=> setOpenModal(true)}>
                        Agregar
                    </Button>
                </div>
                <Table
                    rowKey='id'
                    size='small'
                    columns={columns}
                    dataSource={[]}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                    }}
                />
            </div>
            <ModalInternal
                visible={openModal}
                // close={closeModal}
                // itemToEdit={itemToEdit}
                // actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
        </>
    )
}

export default TabsInternal