import React, {
    useState,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import {
    Form,
    Select,
    AutoComplete,
    Input
} from 'antd';
import {
    getFullName,
    createFiltersJB
} from '../../../utils/functions';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../../api/WebApiPeople';
import { debounce } from 'lodash';
import {
    LoadingOutlined,
    CloseCircleFilled
} from '@ant-design/icons';

const SelectPeople = ({
    name = '',
    label = '',
    dependencies = [],
    rules = [],
    placeholder = 'Buscar...',
    disabled = false,
    onChangeSelect = () => { },
    watchCallback,
    watchParam
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore);

    const noValid = [undefined, null, "", " "];
    const [loading, setLoading] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);
    const [listPeople, setListPeople] = useState([]);

    const getOptions = async (value) => {
        try {
            setLoading(true)
            let params = `&paginate=0&search=${value}`;
            let response = await WebApiPeople.getCollaborators(current_node?.id, params);
            setLoading(false)
            setListPeople(response?.data || [])
        } catch (e) {
            console.log(e)
            setLoading(false)
            setListPeople([])
        }
    }

    const onSearch = (value) => {
        if (noValid.includes(value)) return;
        getOptions(value?.toString().trim())
    }

    const debouncedResults = useMemo(() => {
        return debounce(onSearch, 500)
    }, [])

    useEffect(() => {
        return () => {
            debouncedResults?.cancel();
        }
    }, [])

    const onChange = (value) => {
        onChangeSelect(value)
        if (noValid.includes(value)) return;
        const find_ = item => item.id == value;
        let record = listPeople.find(find_);
        setItemSelected([record])
    }

    const validOptions = () => {
        let ids = itemSelected?.map(item => item.id);
        const filter_ = item => !ids.includes(item.id);
        let results = listPeople.filter(filter_);
        return itemSelected.concat(results)
    }

    const optionsPeople = useMemo(() => {
        let valid = itemSelected?.length <= 0 && watchCallback;
        let check = itemSelected?.length > 0 && !watchCallback;
        if (valid) return watchCallback(listPeople);
        let results = validOptions();
        if (check) return results;
        return watchCallback(results);
    }, [listPeople, watchParam]);

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            dependencies={dependencies}
        >
            <Select
                allowClear
                showSearch
                disabled={disabled}
                placeholder={placeholder}
                filterOption={false}
                clearIcon={loading ? <LoadingOutlined/> : <CloseCircleFilled/>}
                onChange={onChange}
                notFoundContent='No se encontraron resultados'
                onSearch={debouncedResults}
            >

                {optionsPeople.length > 0 && optionsPeople.map(item => (
                    <Select.Option value={item.id} key={item.id}>
                        {getFullName(item)}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    )
}

export default SelectPeople