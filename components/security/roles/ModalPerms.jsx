import React, { useCallback, useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Col, Input, Row, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { valueToFilter } from '../../../utils/functions';

const ModalPerms = ({
    visible = false,
    close = () => { },
    checkedPerms = [],
    setCheckedPerms = () => { }
}) => {

    const [listPerms, setListPerms] = useState([]);
    const [valueSearch, setValueSearch] = useState(null);

    useEffect(() => {
        setListPerms(checkedPerms);
    }, [checkedPerms])

    const onSearch = ({ target: { value } }) => {
        if (![undefined, null, "", " "].includes(value)) {
            const filter_ = item => valueToFilter(item?.perm_name).includes(valueToFilter(value));
            setListPerms(checkedPerms.filter(filter_))
            return;
        }
        setListPerms(checkedPerms)
    }

    const debounceSearch = useCallback(debounce(onSearch, 500), [checkedPerms]);

    const onChangeSearch = (e) =>{
        setValueSearch(e?.target?.value)
        debounceSearch(e)
    }

    const onClose = () =>{
        close()
        setValueSearch(null)
        setListPerms(checkedPerms);
    }

    const deleteItem = (index) => {
        let newList = [...checkedPerms];
        newList.splice(index, 1);
        setCheckedPerms(newList);
    }

    return (
        <MyModal
            title={`Permisos seleccionados (${checkedPerms?.length || 0})`}
            visible={visible}
            close={onClose}
            widthModal={500}
        >
            <Row gutter={[0, 8]}>
                <Col span={24}>
                    <Input
                        allowClear
                        className='input-jb-clear'
                        placeholder='Buscar'
                        value={valueSearch}
                        onChange={onChangeSearch}
                        disabled={checkedPerms?.length <= 0}
                    />
                </Col>
                <Col span={24}>
                    {listPerms?.length > 0 ? (
                        <div className='items-selected scroll-bar'>
                            {listPerms.map((item, idx) => (
                                <div key={idx}>
                                    <p>{item?.perm_name}</p>
                                    <DeleteOutlined
                                        onClick={() => deleteItem(idx)}
                                        style={{ color: 'red' }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ background: '#ffff', padding: 12, borderRadius: 10 }}>
                            <div className='placeholder-list-items'>
                                <p>Ningún permiso seleccionado</p>
                            </div>
                        </div>
                    )}
                </Col>
                <Col span={24}>
                    <Space style={{justifyContent: 'flex-end', width: '100%'}}>
                        <Button onClick={()=> onClose()}>
                            Cerrar
                        </Button>
                    </Space>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalPerms