import React, { useMemo } from 'react';
import { Form, Select} from 'antd';
import {
    optionsLangVacant,
    optionsDomainLang
} from '../../../utils/constant';

const ListLangs = ({
    label = 'Idiomas',
    keyName = 'languages',
    listSelected = []
}) => {

    const getDomain = (item) =>{
        return optionsDomainLang.map(record => ({
            value: `${item.value}-${record.value}`,
            label: `${item.label} / ${record.label}`,
            key: `${item.value}-${record.value}`
        }))
    }

    const getOptions = (item, currentList) =>{
        let equals = currentList.some(record => record == item.value);
        const some_ = option => option.split('-')[0] == item.value?.split('-')[0];
        let rest = currentList.some(some_);
        let disabled = equals ? !equals : rest;
        return {...item, disabled};
    }

    const optionsPrueba = useMemo(()=>{
        let languages = Array.isArray(listSelected) ? listSelected : [];
        const reduce_ = (acc, item) => ([...acc, ...getDomain(item)]);
        let results = optionsLangVacant.reduce(reduce_, []);
        if(languages.length <=0) return results;
        return results?.map(item => getOptions(item, languages));
    },[listSelected])

    return (
        <Form.Item
            label={label}
            name={keyName}
        >
            <Select
                showSearch
                mode='multiple'
                maxTagCount={1}
                options={optionsPrueba}
                placeholder='Seleccionar idioma y dominio'
                notFoundContent='No se encontraron resultados'
                optionFilterProp='label'
            />
        </Form.Item>
    )
}

export default ListLangs