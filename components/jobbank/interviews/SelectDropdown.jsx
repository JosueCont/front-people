import React, { useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space, Form } from 'antd';
import { useRef, useState } from 'react';
import { ruleEmail, ruleRequired } from '../../../utils/rules';
import { valueToFilter } from '../../../utils/functions';
import { ContentBetween } from './StyledInterview';
import { RiCloseLine } from 'react-icons/ri';

const SelectDropdown = ({
    keyName = 'email_read'
}) => {

    const inputRef = useRef(null);
    const [formSelectDropdown] = Form.useForm();
    const [items, setItems] = useState([]);

    const onFinish = (values) =>{
        let newList = [...items, values[keyName]];
        setItems(newList);
        formSelectDropdown.resetFields();
    }

    const ruleExist = () => ({
        validator(_, value){
            const some_ = row => valueToFilter(row) == valueToFilter(value);
            let exist = items.some(some_);
            if(exist) return Promise.reject('Este correo ya existe');
            return Promise.resolve();
        }
    })

    const deleteItem = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        let newList = [...items];
        newList.splice(index, 1);
        setItems(newList);
    };

    const optionsSelected = useMemo(()=>{
        if(!Array.isArray(items) || items.length <=0) return [];
        return items.map(row => ({value: row, key: row, label: row}));
    },[items])

    // const onDeselect = (value) =>{
    //     const filter_ = row => valueToFilter(row) !== valueToFilter(value);
    //     let newList = [...items].filter(filter_);
    //     setItems(newList);
    // }

    const dropdownRender = (menu) =>(
        <>
            {menu}
            <Divider style={{margin: "8px 0"}}/>
            <Form
                layout='inline'
                id='form-drop-down'
                onFinish={onFinish}
                form={formSelectDropdown}
                style={{padding: '5px 12px'}}
            >
                <Form.Item
                    style={{width: 'calc(100% - 48px)', marginBottom: 0}}
                    name={keyName}
                    rules={[ruleRequired, ruleEmail, ruleExist()]}
                >
                    <Input
                        className='input-jb'
                        maxLength={50}
                        placeholder='Ingrese un correo'
                        ref={inputRef}
                    />
                </Form.Item>
                <Form.Item style={{marginRight: 0}}>
                    <Button form='form-drop-down' htmlType='submit' icon={<PlusOutlined />}/>
                </Form.Item>
            </Form>
        </>
    )

    return (
        <Select
            className='select-jb select-jb-remove'
            mode='multiple'
            maxTagCount={1}
            notFoundContent='No se encontraron resultados'
            placeholder='Correos seleccionados'
            dropdownRender={dropdownRender}
            value={optionsSelected}
        >
            {items.map((item, index) => (
                <Select.Option value={item} key={item}>
                    <ContentBetween>
                        {item}
                        <RiCloseLine
                            style={{marginRight: 8, color: '#1890ff', fontSize: '1.25em'}}
                            onClick={e => deleteItem(e, index)}
                        />
                    </ContentBetween>
                </Select.Option>
            ))}
        </Select>
    )
}

export default SelectDropdown