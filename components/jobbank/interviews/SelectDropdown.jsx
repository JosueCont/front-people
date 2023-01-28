import React, { useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space, Form } from 'antd';
import { useRef, useState } from 'react';
import { ruleEmail, ruleRequired } from '../../../utils/rules';
import { valueToFilter } from '../../../utils/functions';
import { OptionJB, ContentBetween } from './StyledInterview';
import { RiCloseLine } from 'react-icons/ri';

const SelectDropdown = ({
    keyName = 'email_read',
    newList = [],
    defaultList = [],
    setNewList,
    setDefaultList
}) => {

    const inputRef = useRef(null);
    const [formSelectDropdown] = Form.useForm();

    const onFinish = (values) =>{
        let list = [...newList, values[keyName]];
        setNewList(list);
        formSelectDropdown.resetFields();
    }

    const ruleExist = () => ({
        validator(_, value){
            let list = [...newList, ...defaultList];
            const some_ = row => valueToFilter(row) == valueToFilter(value);
            let exist = list.some(some_);
            if(exist) return Promise.reject('Este correo ya existe');
            return Promise.resolve();
        }
    })

    const deleteNew = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        let list = [...newList];
        list.splice(index, 1);
        setNewList(list);
    };

    const deleteDefault = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        let list = [...defaultList];
        list.splice(index, 1);
        setDefaultList(list);
    };

    const optionsSelected = useMemo(()=>{
        let list = [...newList, ...defaultList];
        if(!Array.isArray(list) || list.length <=0) return [];
        return list.map(row => ({value: row, key: row, label: row}));
    },[newList, defaultList])

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
            {defaultList.map((item, index) => (
                <OptionJB value={item} key={item}>
                    <ContentBetween>
                        <span>{item}</span>
                        <RiCloseLine
                            style={{marginRight: 8, color: '#1890ff', fontSize: '1.25em'}}
                            onClick={e => deleteDefault(e, index)}
                        />
                    </ContentBetween>
                </OptionJB>
            ))}
            {newList.map((item, index) => (
                <OptionJB value={item} key={item}>
                    <ContentBetween>
                        <span>{item}</span>
                        <RiCloseLine
                            style={{marginRight: 8, color: '#1890ff', fontSize: '1.25em'}}
                            onClick={e => deleteNew(e, index)}
                        />
                    </ContentBetween>
                </OptionJB>
            ))}
        </Select>
    )
}

export default SelectDropdown