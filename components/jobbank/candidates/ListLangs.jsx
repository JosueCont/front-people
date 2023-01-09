import React, { useMemo } from 'react';
import { Form, Input, Button, Cascader} from 'antd';
import { optionsLangVacant, optionsDomainLang } from '../../../utils/constant';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';

const ListLangs = ({
    listLangDomain,
    setListLangDomain,
    setCurrentValue,
    currentValue,
    rule_languages,
    ruleLanguages,
    setRuleLanguages,
    changeColor = false
}) => {


    const getOptionsCascader = () =>{
        const addChildren = (acc, item)=> {
            const some_ = parent => parent.lang == item.value;
            let currentLang = listLangDomain.some(some_);
            if(currentLang) return acc;
            let newItem = {...item, children: optionsDomainLang};
            return [...acc, newItem];
        };
        return optionsLangVacant.reduce(addChildren, []);
    }

    const optionsCascader = useMemo(()=>{
        return getOptionsCascader();
    },[listLangDomain])

    const onChangeLanguaje = (value) =>{
        let item = value ?? [];
        setCurrentValue(item);
    }

    const getNameLang = ({lang}) =>{
        const find_ = item => item.value == lang
        let result = optionsLangVacant.find(find_);
        if(!result) return 'N/A';
        return result.label;
    }

    const getNameDomain = ({domain}) =>{
        const find_ = item => item.value == domain;
        let result = optionsDomainLang.find(find_);
        if(!result) return 'N/A';
        return result.label;
    }

    const deleteLang = (idx) =>{
        let newList = [...listLangDomain];
        newList.splice(idx, 1);
        setListLangDomain(newList)
    }

    const addLang = () =>{
        if(currentValue.length <=0){
            let msg = {text: 'Seleccionar un idioma', status: 'error'};
            setRuleLanguages(msg);
            return;
        }
        setRuleLanguages(rule_languages);
        let newItem = {lang: currentValue[0], domain: currentValue[1]};
        let newList = [...listLangDomain, newItem];
        setListLangDomain(newList)
        setCurrentValue([])
    }

    return (
        <>
            <Form.Item
                label='Idiomas'
                validateStatus={ruleLanguages.status}
                help={ruleLanguages.text}
            >
                <Input.Group compact>
                    <Cascader
                        options={optionsCascader}
                        onChange={onChangeLanguaje}
                        placeholder='Seleccionar idioma y dominio'
                        notFoundContent='No se encontraron resultados'
                        className={currentValue?.length > 0 ? 'custom-cascader':'custom-cascader-empty'}
                        value={currentValue}
                    />
                    {currentValue?.length > 0 && (
                        <Button
                            icon={<PlusOutlined/>}
                            onClick={()=> addLang()}
                            style={{
                                borderTopRightRadius: '10px',
                                borderBottomRightRadius: '10px'
                            }}
                        />
                    )}
                </Input.Group>
            </Form.Item>
            <Form.Item>
                <div className='content-list-items' style={{backgroundColor: changeColor ? '#f0f0f0' : '#ffff'}}>
                    <div className='head-list-items'>
                        <p style={{marginBottom:0}}>Idiomas seleccionados</p>
                    </div>
                    <div className='body-list-items scroll-bar'>
                        {listLangDomain.length > 0 ? listLangDomain.map((item, idx) =>(
                            <div className='item-list-row normal' key={idx}>
                                <p>{getNameLang(item)} / {getNameDomain(item)}</p>
                                <DeleteOutlined onClick={()=> deleteLang(idx)}/>
                            </div>
                        )): (
                            <div className='placeholder-list-items'>
                                <p>Ningún idioma seleccionado</p>
                            </div>
                        )}
                    </div>
                </div>
            </Form.Item>
        </>
    )
}

export default ListLangs