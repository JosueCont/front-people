import React, {
    useEffect,
    useMemo
} from 'react';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Divider,
    Skeleton,
    Space
} from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const PermissionsFields = ({
    module = {},
    checkedPermissions = {},
    setCheckedPermissions
}) => {

    const isSelectedAll = useMemo(() => {
        let ids = module.perms?.map(item => `${item.id}`);
        let keys = Object.entries(checkedPermissions);
        const filter_ = item => item[1] && ids.includes(item[0]);
        let results = keys.filter(filter_);
        return results.length >= ids.length;
    }, [checkedPermissions])

    const typePerms = useMemo(() => {
        return module?.perms?.reduce((acc, item) => {
            let catalog = acc?.catalog || [];
            let action = acc?.action || [];
            if (item?.perm_type == 1) {
                catalog.push(item);
                return { ...acc, catalog };
            }
            action.push(item);
            return { ...acc, action };
        }, {})
    }, [module?.perms])

    // useEffect(() => {
    //     console.log('typePerms', typePerms)
    // }, [typePerms])

    const onChecked = ({ target: { checked } }, id) => {
        let cheks = { ...checkedPermissions, [id]: checked };
        setCheckedPermissions(cheks);
    }

    const styleHead = {
        width: '100%',
        justifyContent: 'space-between',
        // paddingBottom: 2,
        // borderBottom: '1px solid rgba(0,0,0,0.06)',
    }

    const onSelectAll = ({ target: { checked } }) => {
        const reduce_ = (acc, current) => ({ ...acc, [current.id]: checked });
        let checks = module.perms?.reduce(reduce_, {});
        let all = { ...checkedPermissions, ...checks };
        setCheckedPermissions(all)
    }

    const titleSection = {
        catalog: 'Catálogo',
        action: 'Acción'
    }

    return (
        <Row gutter={[0, 12]} style={{ padding: 12 }}>
            {module?.perms?.length > 0 ? (
                <>
                    <Col span={24}>
                        <Space style={styleHead}>
                            <p style={{ marginBottom: 0 }}>Permisos: {module?.perms?.length}</p>
                            <Checkbox checked={isSelectedAll} onChange={onSelectAll}>Seleccionar todo</Checkbox>
                        </Space>
                    </Col>
                    {Object.entries(typePerms).map(([key, val], index) => (
                        <React.Fragment key={index}>
                            <Col span={24}>
                                <div style={{ background: '#fafafa', padding: '8px 16px', borderRadius: '12px' }}>
                                    <Divider style={{ margin: 0 }} plain>
                                        {titleSection[key]}
                                    </Divider>
                                    <Row gutter={[8, 0]} className='section-list-fields'>
                                        {_.chunk(Array(100).fill(val.at(-1)), Math.ceil(Array(100).fill(val.at(-1)).length / 4)).map((record, idx) => (
                                            <Col
                                                xs={24} md={12} lg={8} xl={6}
                                                key={`record_${idx}`}
                                                style={{ display: 'flex', flexDirection: 'column' }}
                                            >
                                                {record.map((item, index) => (
                                                    <Checkbox
                                                        key={`item_${idx}_${index}`}
                                                        style={{ marginLeft: 0 }}
                                                        checked={checkedPermissions[item.id]}
                                                        onChange={e => onChecked(e, item.id)}
                                                    >
                                                        {item.perm_name} {index} {idx}
                                                    </Checkbox>
                                                ))}
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Col>
                        </React.Fragment>
                    ))}
                </>
            ) : (
                <Col span={24}>
                    <div className='placeholder-list-items'>
                        <p>Ningún permiso encontrado</p>
                    </div>
                </Col>
            )}
        </Row>
        // <Row gutter={[0, 16]} style={{ padding: 12 }}>
        //     {module?.perms?.length > 0 ? (
        //         <>
        // <Col span={24}>
        //     <Space style={styleHead}>
        //         <p style={{ marginBottom: 0 }}>Permisos encontrados: {module?.perms?.length}</p>
        //         <Checkbox checked={isSelectedAll} onChange={onSelectAll}>Seleccionar todo</Checkbox>
        //     </Space>
        // </Col>
        //             <Col span={24}>
        // <Row gutter={[8, 0]} className='section-list-fields'>
        //     {_.chunk(module.perms, Math.ceil(module.perms?.length / 4)).map((record, idx) => (
        //         <Col
        //             xs={24} md={12} lg={8} xl={6}
        //             key={`record_${idx}`}
        //             style={{ display: 'flex', flexDirection: 'column' }}
        //         >
        //             {record.map((item, index) => (
        //                 <Checkbox
        //                     key={`item_${idx}_${index}`}
        //                     style={{ marginLeft: 0 }}
        //                     checked={checkedPermissions[item.id]}
        //                     onChange={e => onChecked(e, item.id)}
        //                 >
        //                     {item.perm_name}
        //                 </Checkbox>
        //             ))}
        //         </Col>
        //     ))}
        // </Row>
        //             </Col>
        //         </>
        //     ) : (
        // <Col span={24}>
        //     <div className='placeholder-list-items'>
        //         <p>Ningún permiso encontrado</p>
        //     </div>
        // </Col>
        //     )}
        // </Row>
    )
}

export default PermissionsFields