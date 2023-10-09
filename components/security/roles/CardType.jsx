import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import CardModule from './CardModule';

const CardType = ({
    isSearch = false,
    typeList = [],
    checkedPermissions = {},
    setCheckedPermissions = () => { },
    setCheckedPerms = () => { },
    checkedPerms = []
}) => {

    const [activeKey, setActiveKey] = useState([]);

    useEffect(() => {
        if (!isSearch) {
            setActiveKey([])
            return;
        }
        let keys_ = typeList?.map((_, idx) => idx);
        setActiveKey(keys_)
    }, [isSearch, typeList])


    const Void = ({ type = 2 }) => (
        <div style={{ background: type == 1 ? '#ffff' : '#fafafa', padding: type == 1 ? 24 : 12 }}>
            <div className='placeholder-list-items'>
                <p>No se encontraron resultados</p>
            </div>
        </div>
    )

    // const onCheckModule = ({ target: { checked } }, row) => {
    //     const ids_ = (acc, item) => ({ ...acc, [`${item?.id}`]: checked });
    //     const reduce_ = (acc, record) => ({ ...acc, ...record.perms?.reduce(ids_, {}) })
    //     let checks = row.groups?.reduce(reduce_, {});
    //     let all = { ...checkedPermissions, ...checks };
    //     setCheckedPermissions(all)
    // }

    // const onCheckGroup = ({ target: { checked } }, item) => {
    //     const ids_ = (acc, item) => ({ ...acc, [`${item?.id}`]: checked });
    //     let checks = item.perms?.reduce(ids_, {});
    //     let all = { ...checkedPermissions, ...checks };
    //     setCheckedPermissions(all)
    // }

    // const allModule = (row) => {
    //     if (row?.groups?.length <= 0) return false;
    //     let checks = Object.entries(checkedPermissions);
    //     let ids = row.groups?.reduce((acc, item) => {
    //         let perms = item?.perms?.map(e => e?.id);
    //         return [...acc, ...perms]
    //     }, []);
    //     return ids.every(a => checks.some(b => b[0] == a && b[1]));
    // }

    // const allGroup = (item) => {
    //     let checks = Object.entries(checkedPermissions);
    //     let ids = item.perms?.map(e => e?.id);
    //     return ids.every(a => checks.some(b => b[0] == a && b[1]));
    // }

    // const onChecked = ({ target: { checked } }, id) => {
    //     let cheks = { ...checkedPermissions, [id]: checked };
    //     setCheckedPermissions(cheks);
    // }

    return (
        <>
            {typeList?.length > 0 ? (
                <Collapse
                    ghost
                    activeKey={activeKey}
                    bordered={false}
                    onChange={e => setActiveKey(e)}
                >
                    {typeList?.map((row, idx) => (
                        <CardModule
                            row={row}
                            key={idx}
                            empty={<Void />}
                            isSearch={isSearch}
                            checkedPerms={checkedPerms}
                            setCheckedPerms={setCheckedPerms}
                        />
                    ))}
                </Collapse>
            ) : <Void type={1} />}
        </>
    )
}

export default CardType