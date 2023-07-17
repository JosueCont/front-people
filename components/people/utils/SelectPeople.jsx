import React, {
    useState,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import {
    Form,
    Select
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

const SelectPeople = ({
    name = '',
    label = '',
    dependencies = [],
    rules = [],
    placeholder = 'Buscar...',
    disabled = false,
    onChangeSelect = () => { },
    itemSelected = [],
    watchCallback,
    watchParam
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore);

    const noValid = [undefined, null, "", " "];
    const [loading, setLoading] = useState(false);
    const [option, setOption] = useState([]);
    const [listPeople, setListPeople] = useState([]);
    const [openDrop, setOpenDrop] = useState(false);

    useEffect(()=>{
        if(itemSelected?.length <=0) return;
        setOption(itemSelected)
    },[itemSelected])

    const getOptions = async (node, value) => {
        try {
            setLoading(true)
            let params = `&paginate=0&search=${value}`;
            let response = await WebApiPeople.getCollaborators(node, params);
            setListPeople(response?.data || [])
            setTimeout(()=>{
                setLoading(false)
            },500)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setListPeople([])
        }
    }

    const onSearch = (value) => {
        if (noValid.includes(value) || loading) return;
        getOptions(current_node?.id, value?.toString().trim())
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
        onChangeSelect(value);
        let exist = itemSelected.some(item => item?.id == value);
        if (noValid.includes(value) || exist) return;
        const find_ = item => item.id == value;
        let record = listPeople.find(find_);
        setOption([record])
    }

    const validOptions = () => {
        let ids = option?.map(item => item?.id);
        const filter_ = item => !ids.includes(item.id);
        let results = listPeople.filter(filter_);
        return option.concat(results)
    }

    const optionsPeople = useMemo(() => {
        let valid = option?.length <= 0 && watchCallback;
        let check = option?.length > 0 && !watchCallback;
        if (valid) return watchCallback(listPeople);
        let results = validOptions();
        if (check || !watchCallback) return results;
        return watchCallback(results);
    }, [listPeople, option, watchParam]);

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
                open={openDrop}
                disabled={disabled}
                placeholder={placeholder}
                filterOption={false}
                clearIcon={loading ? <LoadingOutlined /> : <CloseCircleFilled />}
                suffixIcon={loading ? <LoadingOutlined/> : openDrop ? <SearchOutlined/> : <DownOutlined/>}
                onChange={onChange}
                notFoundContent='No se encontraron resultados'
                onSearch={debouncedResults}
                onDropdownVisibleChange={setOpenDrop}
            >
                {optionsPeople?.length > 0 && optionsPeople.map(item => (
                    <Select.Option value={item.id} key={item.id}>
                        {getFullName(item)}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    )
}

export default SelectPeople