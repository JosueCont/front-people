import React, {
    useState,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import {
    Form,
    Select,
    Divider
} from 'antd';
import { getFullName } from '../../../utils/functions';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../../api/WebApiPeople';
import { debounce } from 'lodash';
import {
    LoadingOutlined,
    CloseCircleFilled,
    SearchOutlined,
    DownOutlined
} from '@ant-design/icons';
import { RiCloseLine } from 'react-icons/ri';

const SelectPeople = ({
    name = '',
    label = '',
    dependencies = [],
    rules = [],
    placeholder = 'Buscar...',
    disabled = false,
    onChangeSelect = () => { },
    itemSelected = [],
    noStyle = false,
    mode = false,
    preserveHistory = false,
    watchCallback,
    watchParam
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore);

    const noValid = [undefined, null, "", " "];
    const modeType = ['multiple', 'tags'];
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [listPeople, setListPeople] = useState([]);
    const [openDrop, setOpenDrop] = useState(false);

    useEffect(() => {
        if (itemSelected?.length <= 0) return;
        const map_ = item => ({ ...item, selected: true });
        let items = itemSelected?.map(map_);
        setSelected(items);
    }, [itemSelected])

    const getOptions = async (value) => {
        try {
            setLoading(true)
            let params = `&paginate=0&search=${value}`;
            let response = await WebApiPeople.getCollaborators(current_node?.id, params);
            setListPeople(response?.data || [])
            setTimeout(() => {
                setLoading(false)
            }, 300)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setListPeople([])
        }
    }

    const onSearch = (value) => {
        if (loading || noValid.includes(value)) return;
        getOptions(value?.toString().trim())
    }

    const debouncedResults = useMemo(() => {
        return debounce(onSearch, 500)
    }, [current_node])

    useEffect(() => {
        return () => {
            debouncedResults?.cancel();
        }
    }, [])

    const getHistory = (selected_ = [], prevIds = []) => {
        let ids = [...selected]?.map(item => item?.id);
        const filter_ = item => !ids.includes(item.id);
        const map_ = item => ({ ...item, selected: prevIds.includes(item.id) });
        return selected.concat(selected_.filter(filter_)).map(map_);
    }

    const onChange = (value) => {
        let ids = !noValid.includes(value)
            ? Array.isArray(value) ? value : [value] : [];

        // Se filtra las opciones seleccionadas
        const filter_ = item => ids.includes(item.id);
        let selected_ = listPeople.filter(filter_);

        // Se valida si se desea mantener el historial
        if (modeType.includes(mode)) {
            let history_ = getHistory(selected_, ids);
            onChangeSelect(value, history_);
            setSelected(history_);
            return;
        }
        // Continua el flujo sin mantener el historial
        setSelected(selected_)
        onChangeSelect(value, listPeople);
    }

    const validOptions = () => {
        if (selected?.length <= 0) return listPeople;
        let ids = [...selected]?.map(item => item?.id);
        const filter_ = item => !ids.includes(item.id);
        return selected.concat(listPeople.filter(filter_));
    }

    const clasifOptions = (list = []) => {
        return list?.reduce((acc, item) => {
            let results = acc['results'] ?? [];
            let history = acc['history'] ?? [];
            let selected = acc['selected'] ?? [];
            if (!item?.hasOwnProperty('selected')) {
                results.push(item);
                return { ...acc, results };
            };
            if (!item?.selected) {
                history.push(item);
                return { ...acc, history };
            }
            selected.push(item)
            return { ...acc, selected };
        }, { history: [], results: [], selected: [] });
    }

    const validClasif = (options) => {
        if (!preserveHistory) return options;
        return clasifOptions(options);
    }

    const optionsPeople = useMemo(() => {
        let options = validOptions();
        if (!watchCallback) return validClasif(options);
        let records = watchCallback(options);
        return validClasif(records);
    }, [listPeople, selected, watchParam]);

    // const optionsPeople = useMemo(() => {
    //     let valid = selected?.length <= 0 && watchCallback;
    //     let check = selected?.length > 0 && !watchCallback;
    //     if (valid) return watchCallback(listPeople);
    //     let results = validOptions(listPeople);
    //     if (check || !watchCallback) return results;
    //     return watchCallback(results);
    // }, [listPeople, selected, watchParam]);

    const deleteDefault = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        const filter_ = record => record.id != item.id
        let newList = selected.filter(filter_);
        setSelected(newList)
    };

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            dependencies={dependencies}
            noStyle={noStyle}
        >
            <Select
                allowClear
                showSearch
                open={openDrop}
                disabled={disabled}
                placeholder={placeholder}
                filterOption={false}
                mode={mode}
                maxTagCount='responsive'
                clearIcon={loading ? <LoadingOutlined /> : <CloseCircleFilled />}
                suffixIcon={loading ? <LoadingOutlined /> : openDrop ? <SearchOutlined /> : <DownOutlined />}
                onChange={onChange}
                notFoundContent='No se encontraron resultados'
                onSearch={debouncedResults}
                onDropdownVisibleChange={setOpenDrop}
                className='ant-select-people'
            >
                {preserveHistory && modeType.includes(mode) ? (
                    <>
                        {optionsPeople?.selected?.length > 0 && (
                            <Select.OptGroup label='Seleccionados'>
                                {optionsPeople?.selected?.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getFullName(item)}
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                        {optionsPeople?.history?.length > 0 && (
                            <Select.OptGroup label='Historial'>
                                {optionsPeople?.history?.map((item) => (
                                    <Select.Option value={item.id} key={item.id} className='ant-option-history'>
                                        <>{getFullName(item)}</>
                                        <RiCloseLine onClick={e => deleteDefault(e, item)}/>
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                        {optionsPeople?.results?.length > 0 && (
                            <Select.OptGroup label='Última búsqueda'>
                                {optionsPeople?.results?.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getFullName(item)}
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                    </>
                ) : optionsPeople?.length > 0 && (
                    <>{optionsPeople?.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                            {getFullName(item)}
                        </Select.Option>
                    ))}</>
                )}
            </Select>
        </Form.Item>
    )
}

export default SelectPeople