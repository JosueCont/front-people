import React, { useEffect } from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    Button
} from 'antd';
import { useSelector } from 'react-redux';
import {
    SearchFields,
    ButtonPrimary,
    SearchBtn,
    ContentBeetwen
} from './SearchStyled';
import { createFiltersJB } from '../../../utils/functions';
import { useRouter } from 'next/router';

const SearchForm = () => {

    const {
        list_states,
        load_states,
        load_main_categories,
        list_main_categories,
    } = useSelector(state => state.jobBankStore);
    
    const router = useRouter();
    const [formSearch] = Form.useForm();

    useEffect(()=>{
        let values = {...router.query};
        values.location = router.query?.location
            ? parseInt(router.query?.location) : null;
        formSearch.resetFields()
        formSearch.setFieldsValue(values)
    },[router?.query])

    const setFilters = (obj = {}) =>{
        router.replace({
            pathname: '/jobbank/search',
            query: obj
        }, undefined, {shallow: true})
    }

    const onFinish = (values) =>{
        let filters = createFiltersJB(values);
        setFilters(filters)        
    }

    const onReset = () =>{
        if(!Object.keys({...router.query})?.length > 0) return;
        setFilters()
    }

    return (
        <SearchFields>
            <Form
                form={formSearch}
                layout='vertical'
                onFinish={onFinish}
            >
                <Form.Item
                    name='name'
                    label='Nombre'
                >
                    <Input
                        allowClear
                        placeholder='Nombre de la vacante'
                        style={{ border: '1px solid black' }}
                        maxLength={100}
                    />
                </Form.Item>
                <Form.Item
                    name='description'
                    label='Descripción'
                >
                    <Input
                        allowClear
                        placeholder='Descripción de la vacante'
                        maxLength={100}
                        style={{ border: '1px solid black' }}
                    />
                </Form.Item>
                <Form.Item
                    label='Categoría'
                    name='category'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_main_categories}
                        loading={load_main_categories}
                        optionFilterProp='children'
                    >
                        {list_main_categories?.length > 0 && list_main_categories.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='location'
                    label='Estado'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_states}
                        loading={load_states}
                        optionFilterProp='children'
                    >
                        {list_states?.length > 0 && list_states.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <ContentBeetwen>
                    <SearchBtn
                        type='button'
                        onClick={()=> onReset()}
                    >
                        Reiniciar
                    </SearchBtn>
                    <ButtonPrimary
                        type='submit'
                    >
                        Buscar
                    </ButtonPrimary>
                </ContentBeetwen>
            </Form>
        </SearchFields>
    )
}

export default SearchForm