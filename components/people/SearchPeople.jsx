import React, {
    useState,
    useEffect
} from 'react';
import {
    Button,
    Row,
    Col,
    Form,
    Tooltip,
    Card,
    Input
} from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../utils/functions';
import TagFilters from '../jobbank/TagFilters';
import FiltersPeople from './FiltersPeople';
import { useFiltersPeople } from './useFiltersPeople';
import OptionsPeople from './OptionsPeople';
import ModalPeople from './modals/ModalPeople';
import { getCollaborators } from '../../redux/UserDuck';
import { getWorkTitle } from '../../redux/catalogCompany';

const SearchPeople = ({
    currentNode,
    permissions,
    list_collaborators,
    load_collaborators,
    user_page,
    user_filters,
    user_page_size,
    getCollaborators,
    getWorkTitle
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const { listKeys, listAwait } = useFiltersPeople();

    useEffect(() => {
        let value = router.query?.search;
        setValueSearch(value || '')
    }, [router.query?.search])

    const showModal = () => {
        let filters = { ...router.query };
        filters.gender = router.query?.gender ? parseInt(router.query?.gender) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/home/persons',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = createFiltersJB(values);
        setFilters(filters)
    }

    const onGeneralSearch = () => {
        let filters = createFiltersJB({ search: valueSearch });
        setFilters(filters)
    }

    const deleteFilter = () => {
        formSearch.resetFields();
        setFilters()
    }

    const onChangeSearch = ({ target }) => {
        setValueSearch(target.value?.trim())
    }

    const onReadyCreate = () => {
        getWorkTitle(currentNode?.id)
        getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <div className='content_title_requets'>
                                <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                    Personas
                                </p>
                                <Input.Group style={{ width: 300 }} compact>
                                    <Input
                                        allowClear
                                        className='input-jb-clear'
                                        placeholder='Búsqueda general'
                                        value={valueSearch}
                                        onChange={onChangeSearch}
                                        onPressEnter={onGeneralSearch}
                                        style={{
                                            width: 'calc(100% - 32px)',
                                            borderTopLeftRadius: '10px',
                                            borderBottomLeftRadius: '10px'
                                        }}
                                    />
                                    <button
                                        className='ant-btn-simple'
                                        onClick={() => onGeneralSearch()}
                                        style={{
                                            borderTopRightRadius: '10px',
                                            borderBottomRightRadius: '10px'
                                        }}
                                    >
                                        <SearchOutlined />
                                    </button>
                                </Input.Group>
                            </div>
                            <div className='content-end' style={{ gap: 8 }}>
                                <OptionsPeople />
                                <Tooltip title='Configurar filtros'>
                                    <Button onClick={() => showModal()}>
                                        <SettingOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Limpiar filtros'>
                                    <Button onClick={() => deleteFilter()}>
                                        <SyncOutlined />
                                    </Button>
                                </Tooltip>
                                {permissions.person?.create && (
                                    <Button onClick={() => setOpenCreate(true)}>
                                        Agregar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            listAwait={listAwait}
                            discardKeys={['search']}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersPeople
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
            <ModalPeople
                visible={openCreate}
                close={() => setOpenCreate(false)}
                onReady={onReadyCreate}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        permissions: state.userStore.permissions,
        list_collaborators: state.userStore.list_collaborators,
        load_collaborators: state.userStore.load_collaborators,
        user_page: state.userStore.user_page,
        user_filters: state.userStore.user_filters,
        user_page_size: state.userStore.user_page_size
    }
}

export default connect(
    mapState, {
    getCollaborators,
    getWorkTitle
}
)(SearchPeople)