import React, { useState, useEffect, Fragment } from 'react';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Divider,
    Skeleton
} from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const PermissionsFields = ({
    permissions = [],
    checkedPermissions = {},
    setCheckedPermissions
}) => {

    const onChecked = ({target: {checked}}, id) =>{
        let cheks = {...checkedPermissions, [id]: checked};
        setCheckedPermissions(cheks);
    }

    return (
        <Row gutter={[8,0]} className='section-list-fields'>
            {permissions?.length > 0 ? _.chunk(permissions, Math.ceil(permissions.length/4)).map((record, idx) => (
                <Col
                    xs={24} md={12} lg={8} xl={6}
                    key={`record_${idx}`}
                    style={{display: 'flex', flexDirection: 'column'}}
                >
                    {record.map((item, index) => (
                        <Checkbox
                            key={`item_${idx}_${index}`}
                            style={{marginLeft: 0}}
                            checked={checkedPermissions[item.id]}
                            onChange={e=> onChecked(e, item.id)}
                        >
                            {item.perm_name}
                        </Checkbox>
                    ))}
                </Col>
            )) :(
                <div className='placeholder-list-items'>
                    <p>Ningún permiso encontrado</p>
                </div>
            )}
        </Row>
    )
}

export default PermissionsFields