import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import {
    Form,
    Select
} from 'antd';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
    LoadingOutlined,
    CloseCircleFilled,
    SearchOutlined,
    DownOutlined
} from '@ant-design/icons';
import { RiCloseLine } from 'react-icons/ri';

const SelectSearch = ({
    name = '',
    label = '',
    dependencies = [],
    rules = [],
    placeholder = 'Buscar...',
    disabled = false,
    onChangeSelect = () => { },
    itemSelected,
    noStyle = false,
    mode = false,
    preserveHistory = false,
    watchCallback,
    watchParam,
    tooltip = '',
    size = 'middle',
    // Nuevas props
    loading = false,
    listOptions = [],
    getOptions = () => { },
    getLabelOption = () => { }
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore);

    const noValid = [undefined, null, "", " "];
    const modeType = ['multiple', 'tags'];
    const [selected, setSelected] = useState([]);
    const [openDrop, setOpenDrop] = useState(false);

    useEffect(() => {
        if (itemSelected?.length > 0) {
            const map_ = item => ({ ...item, selected: true });
            let items = itemSelected?.map(map_);
            setSelected(items);
            return;
        } else setSelected([]);
    }, [itemSelected])

    const onSearch = (value) => {
        if (loading || noValid.includes(value)) return;
        getOptions(current_node, value?.toString().trim())
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

        let ids = !noValid.includes(value) ? Array.isArray(value)
            ? value : [value] : [];

        // Se filtra las opciones seleccionadas
        const filter_ = item => ids.includes(item.id);
        let selected_ = listOptions.filter(filter_);

        // Se valida si se desea mantener el historial
        if (modeType.includes(mode)) {
            let history_ = getHistory(selected_, ids);
            onChangeSelect(value, history_);
            setSelected(history_);
            return;
        }
        // Continua el flujo sin mantener el historial
        setSelected(selected_)
        onChangeSelect(value, listOptions);
    }

    const validOptions = () => {
        if (selected?.length <= 0) return listOptions;
        let ids = [...selected]?.map(item => item?.id);
        const filter_ = item => !ids.includes(item.id);
        return selected.concat(listOptions.filter(filter_));
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
    }, [listOptions, selected, watchParam]);

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
            tooltip={tooltip}
        >
            <Select
                allowClear
                showSearch
                open={openDrop}
                disabled={disabled}
                placeholder={placeholder}
                filterOption={false}
                mode={mode}
                size={size}
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
                                        {getLabelOption(item)}
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                        {optionsPeople?.history?.length > 0 && (
                            <Select.OptGroup label='Historial'>
                                {optionsPeople?.history?.map((item) => (
                                    <Select.Option value={item.id} key={item.id} className='ant-option-history'>
                                        <>{getLabelOption(item)}</>
                                        <RiCloseLine onClick={e => deleteDefault(e, item)} />
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                        {optionsPeople?.results?.length > 0 && (
                            <Select.OptGroup label='Última búsqueda'>
                                {optionsPeople?.results?.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getLabelOption(item)}
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        )}
                    </>
                ) : optionsPeople?.length > 0 && (
                    <>{optionsPeople?.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                            {getLabelOption(item)}
                        </Select.Option>
                    ))}</>
                )}
            </Select>
        </Form.Item>
    )
}

export default SelectSearch