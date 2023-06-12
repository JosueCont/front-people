import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    Card,
    Row,
    Col,
    Button
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const DetailsCustom = ({
    children,
    idForm = '',
    action = '',
    titleCard = '',
    isAutoRegister = false,
    loading = {},
    setLoading,
    fetching = false,
    ExtraActions = ()=> <></>,
    actionBack = ()=>{},
    setActionType,
    onlyOptions = false,
    showOptions = true,
    borderTitle = false,
    childrenIsTabs = false,
    showBack = false
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const btnSave = useRef(null);

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    const Options = () =>(
        <>
            {action == 'add' && !isAutoRegister ? (
                <>
                    <button
                        type='submit'
                        form={idForm}
                        ref={btnSave}
                        style={{display:'none'}}
                    />
                    <Button
                        onClick={()=>getSaveAnd('back')}
                        disabled={loading['back']?.disabled}
                        loading={loading['back']?.loading}
                    >
                        Guardar y regresar
                    </Button>
                    <Button
                        onClick={()=>getSaveAnd('create')}
                        disabled={loading['create']?.disabled}
                        loading={loading['create']?.loading}
                    >
                        Guardar y registrar otro
                    </Button>
                    <Button
                        onClick={()=>getSaveAnd('edit')}
                        disabled={loading['edit']?.disabled}
                        loading={loading['edit']?.loading}
                    >
                        Guardar y editar
                    </Button>
                </>
            ):(
                <Button
                    form={idForm}
                    htmlType='submit'
                    loading={fetching}
                >
                    {isAutoRegister && action == 'add' ? 'Guardar' : 'Actualizar'}
                </Button>
            )}
        </>
    )

    return !onlyOptions ? (
        <Card bodyStyle={{padding: '18px'}}>
            <Row gutter={[16,16]}>
                <Col span={24} className='header-card'>
                    <div className={`title-action-content ${borderTitle ? 'title-action-border' : ''}`}>
                        <p className='title-action-text'>
                            {titleCard}
                        </p>
                        {(!isAutoRegister || showBack) && (
                            <div className='content-end' style={{gap: 8}}>
                                <ExtraActions/>
                                <Button
                                    onClick={()=> actionBack()}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Regresar
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
                <Col span={24} className={childrenIsTabs ? 'tabs-vacancies' : ''}>
                    {children}
                </Col>
                {showOptions && (
                    <Col span={24} className='tab-vacancies-btns'>
                        <Options/>
                    </Col>
                )}
            </Row>
        </Card>
    ) : (
        <Options/>
    )
}

export default DetailsCustom;