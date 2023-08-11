import React, {
    useState,
    useMemo,
    useEffect
} from 'react';
import MyModal from '../../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Input,
    TreeSelect
} from 'antd';
import { useSelector } from 'react-redux';
import { ruleRequired } from '../../../../utils/rules';

const ModalLevels = ({
    visible = false,
    textSave = 'Guardar',
    title = '',
    itemToEdit = {},
    close = () => { },
    actionForm = () => { },
}) => {

    const {
        list_org_levels_options,
        list_org_levels_tree,
        load_org_levels_options
    } = useSelector(state => state.orgStore);
    const [formLevel] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.parent = itemToEdit?.parent ? itemToEdit?.parent?.id : null;
        formLevel.setFieldsValue(values)
    }, [itemToEdit])

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            actionForm(values)
            onClose()
            setLoading(false)
        }, 2000)
    }

    const onClose = () => {
        close()
        formLevel.resetFields()
    }

    const optionsBoolean = [
        { value: true, key: '1', label: 'Sí' },
        { value: false, key: '2', label: 'No' }
    ]

    const GetName = ({ item }) => {
        let color = 'rgba(0, 0, 0, 0.25)';
        return (
            <>{item.name} {!item?.is_active &&
                <span style={{ color }}>
                    (Inactivo)
                </span>
            }</>
        )
    }

    // const formatOptions = (item) => {
    //     const some_ = record => record.id == itemToEdit?.id;
    //     const format = record => (formatOptions(record));

    //     const reduce_ = (acc, record) => {
    //         if (record?.id == itemToEdit?.id) return acc;
    //         return [...acc, {
    //             value: record?.id,
    //             title: record?.name,
    //             children: []
    //         }]
    //     }

    //     let exist = item?.children?.some(some_);

    //     let results = exist
    //         ? item?.children?.reduce(reduce_, [])
    //         : item?.children?.map(format);

    //     return {
    //         value: item?.id,
    //         title: item?.name,
    //         children: results
    //     }
    // }

     // const formatOptions = (item) => {
    //     let equals = itemToEdit?.id == item.id;
    //     const filter_ = record => record?.id != itemToEdit?.id;
    //     let parent = !equals ? item?.children?.filter(filter_) : [];
    //     // let disabled = equals || !item?.is_active;
    //     const map_ = record => (formatOptions(record));
    //     let children = parent?.length > 0 ? parent.map(map_) : [];

    //     return {
    //         value: item?.id,
    //         title: item?.name,
    //         // disabled,
    //         children
    //     }
    // }

    const formatEdit = (item, depth, pos) => {
        const some_ = record => record.id == itemToEdit?.id;
        const filter_ = record => record?.id != itemToEdit?.id;
        const format = record => (formatEdit(record, depth, pos + 1));

        let exist = item?.children?.some(some_);
        let parent = exist ? item?.children?.filter(filter_) : item?.children;
        let results = depth == pos ? [] : parent?.map(format);

        return {
            value: item?.id,
            title: item?.name,
            children: results
        }
    }

    const getOptionsEdit = () => {
        let depth = null;

        // Obtenemos la profundidad del nivel a editar
        const getDepth = (item, idx = []) => {
            let valid = item?.id == itemToEdit?.id;
            if (valid) return depth = idx;
            return item?.children?.forEach((record, index) => {
                return getDepth(record, [...idx, index]);
            })
        }

        list_org_levels_tree.forEach((item, idx) => {
            let valid = item?.id == itemToEdit?.id;
            if (!valid) return getDepth(item, [idx]);
            return depth = [idx];
        })

        return list_org_levels_tree.reduce((acc, item) => {
            if (item?.id == itemToEdit?.id) return acc;
            return [...acc, formatEdit(item, depth?.length, 1)]
        }, [])
    }

    const formatAdd = (item) => {
        const map_ = record => (formatAdd(record));
        let children = item?.children?.length > 0
            ? item?.children?.map(map_) : [];
        return {
            value: item?.id,
            title: item?.name,
            children
        }
    }

    const optionsParent = useMemo(() => {
        if (list_org_levels_tree.length <= 0 || !visible) return [];
        let exist = Object.keys(itemToEdit).length > 0;
        if (exist) return getOptionsEdit();
        return list_org_levels_tree.reduce((acc, item) => {
            let option = formatAdd(item);
            return [...acc, option]
        }, [])
    }, [list_org_levels_tree, itemToEdit, visible])

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onClose}
            // widthModal={700}
            closable={!loading}
        >
            <Form
                form={formLevel}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[ruleRequired]}
                        >
                            <Input maxLength={400} placeholder='Nombre' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='description'
                            label='Descripción'
                        >
                            <Input placeholder='Descripción' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='enable_assign_worktitle'
                            label='¿Permite asignar plazas?'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsBoolean}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='enable_custom_catalogs'
                            label='¿Permite catálogos personalizados?'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsBoolean}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='parent'
                            label='Precede'
                        >
                            <TreeSelect
                                allowClear
                                showSearch
                                treeLine={{ showLeafIcon: false }}
                                treeData={optionsParent}
                                loading={load_org_levels_options}
                                disabled={load_org_levels_options}
                                placeholder='Seleccionar una opción'
                                treeNodeFilterProp='title'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                        >
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalLevels