import React, {
    useMemo
} from 'react';
import {
    Collapse,
    Checkbox,
    Row,
    Col
} from 'antd';
import { chunk } from 'lodash';

const CardGroup = ({
    empty,
    item = {},
    checkedPerms = [],
    setCheckedPerms = () => { },
    ...props
}) => {

    const isAll = useMemo(() => {
        let ids = checkedPerms?.map(e => e?.id);
        const every_ = row => ids.includes(row?.id);
        return item?.perms?.every(every_);
    }, [checkedPerms])

    const onCheckGroup = ({ target: { checked } }) => {
        let ids = item?.perms?.map(e => e?.id);
        const filter_ = item => !ids.includes(item?.id);
        let all = checked
            ? checkedPerms?.filter(filter_).concat(item?.perms)
            : checkedPerms?.filter(filter_);
        setCheckedPerms(all)
    }

    const onChecked = ({ target: { checked } }, check) => {
        const filter_ = item => item?.id !== check?.id;
        let all = checked
            ? checkedPerms?.filter(filter_).concat([check])
            : checkedPerms?.filter(filter_);
        setCheckedPerms(all)
    }

    return (
        <Collapse.Panel
            {...props}
            header={item?.group?.name || item.group}
            collapsible='header'
            extra={item?.perms?.length > 0 ? (
                <Checkbox
                    checked={isAll}
                    onChange={onCheckGroup}
                >
                    Todo
                </Checkbox>
            ) : <></>}
        >
            {item?.perms?.length > 0 ? (
                <Row gutter={[8, 0]} className='section-list-fields'>
                    {chunk(item.perms, Math.ceil(item?.perms?.length / 4)).map((record, pos) => (
                        <Col
                            xs={24} md={12} lg={8} xl={6}
                            key={`record_${pos}`}
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {record.map((check, num) => (
                                <Checkbox
                                    key={`item_${pos}_${num}`}
                                    style={{ marginLeft: 0 }}
                                    checked={checkedPerms?.some(e => e?.id == check?.id)}
                                    onChange={e => onChecked(e, check)}
                                >
                                    {check.perm_name}
                                </Checkbox>
                            ))}
                        </Col>
                    ))}
                </Row>
            ) : empty}
        </Collapse.Panel>
    )
}

export default CardGroup