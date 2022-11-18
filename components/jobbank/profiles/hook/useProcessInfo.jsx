import React from 'react';

export const useProcessInfo = () => {

    const getField = (key, list) =>{
        return list.reduce((prev, current) =>{
            let name = `${key}|${current}`;
            return {...prev, [name]: true };
        }, {});
    }

    const checkValue = (obj, [key, val]) => {
        if(!Array.isArray(val)) return obj;
        return {...obj, ...getField(key, val)};
    }

    const formatData = (values) => {
        return Object.entries(values).reduce(checkValue, {});
    }

    const createData = (values) =>{
        return Object.entries(values).reduce((obj, [key, val])=> {
            if(!val) return obj;
            if(!key.includes('|')) return {...obj, [key]: val == 'open_fields' ? '' : val };
            let fields = obj['fields_name'] ?? {};
            let name = key.split('|');
            let prev = fields[name[0]] ?? [];
            let item = [...prev, name[1]];
            let config = {...fields, [name[0]]: item};
            return {...obj, fields_name: config};
        }, { fields_name: {} });
    }

    return {
        formatData,
        createData
    }
}