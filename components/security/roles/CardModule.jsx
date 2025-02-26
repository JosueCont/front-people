import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    Collapse,
    Checkbox
} from 'antd';
import CardGroup from './CardGroup';

const CardModule = ({
    empty,
    row = {},
    isSearch,
    checkedPerms = [],
    setCheckedPerms = () => { },
    ...props
}) => {

    const [activeKey, setActiveKey] = useState([]);

    useEffect(() => {
        if (!isSearch) {
            setActiveKey([])
            return;
        }
        let keys_ = row?.groups?.map((_, idx) => idx);
        setActiveKey(keys_)
    }, [isSearch, row])


    const isAll = useMemo(() => {
        const reduce_ = (acc, item) => ([...acc, ...item?.perms]);
        let perms = row.groups?.reduce(reduce_, []);
        let ids = checkedPerms?.map(e => e?.id);
        return perms.every(row => ids.includes(row?.id))
    }, [checkedPerms])

    const onCheckModule = ({ target: { checked } }) => {
        const reduce_ = (acc, item) => ([...acc, ...item?.perms]);
        let perms = row.groups?.reduce(reduce_, []);
        let ids = perms?.map(e => e?.id);
        const filter_ = item => !ids.includes(item?.id);
        let all = checked
            ? checkedPerms?.filter(filter_).concat(perms)
            : checkedPerms?.filter(filter_);
        setCheckedPerms(all)
    }

    return (
        <Collapse.Panel
            {...props}
            header={row?.khorplus_module?.name}
            collapsible='header'
            extra={row?.groups?.length > 0 && row?.groups?.some(e => e?.perms?.length > 0) ? (
                <Checkbox
                    checked={isAll}
                    onChange={onCheckModule}
                >
                    Todo
                </Checkbox>
            ) : <></>}
        >
            {row?.groups?.length > 0 ? (
                <Collapse
                    activeKey={activeKey}
                    bordered={false}
                    onChange={e => setActiveKey(e)}
                >
                    {row?.groups?.map((item, index) => (
                        <CardGroup
                            key={index}
                            checkedPerms={checkedPerms}
                            setCheckedPerms={setCheckedPerms}
                            empty={empty}
                            item={item}
                        />
                    ))}
                </Collapse>
            ) : empty}
        </Collapse.Panel>
    )
}

export default CardModule