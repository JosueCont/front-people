export const useInfoConnection = () =>{

    const noValid = [undefined, null, '', ' '];

    const getField = (keyParent, list) =>{
        return Object.entries(list).reduce((obj, [key, val])=>{
            if(noValid.includes(val)) return obj;
            let name = `${keyParent}|${key}`;
            return {...obj, [name]: val };
        }, {})
    }

    const checkValue = (obj, [key, val]) => {
        if(noValid.includes(val)) return obj;
        if(typeof val == 'object') return {...obj, ...getField(key, val)};
        return {...obj, [key]: val};
    }

    const formatData = (values) => {
        return Object.entries(values).reduce(checkValue, {});
    }

    const createData = (values) =>{
        return Object.entries(values).reduce((obj, [key, val])=> {
            if(noValid.includes(val)) return obj;
            if(!key.includes('|')) return {...obj, [key]: val};
            let fields = obj['data_config'] ?? {};
            let name = key.split('|');
            let item = {...fields, [name[1]]: val};
            return {...obj, data_config: item };
        }, { data_config: {} });
    }

    return {
        formatData,
        createData
    }

}