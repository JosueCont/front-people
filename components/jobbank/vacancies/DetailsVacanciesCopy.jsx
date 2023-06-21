import React, {
    useState,
    useEffect
} from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    Spin,
    Tabs,
    Form
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DetailsCustom from '../DetailsCustom';
import TabFeatures from './TabFeatures';
import TabEducation from './TabEducation';
import TabSalary from './TabSalary';

const DetailsVacancies = ({
    currentNode,
    action,
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [currentKey, setCurrentKey] = useState('1');
    const [infoVacant, setInfoVacant] = useState({});
    //formularios
    const [formFeatures] = Form.useForm();
    const [formEducation] = Form.useForm();
    const [formBenefits] = Form.useForm();
    const [formEvaluatios] = Form.useForm();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoVacant(router.query.id)
            // getEvaluationsVacant(router.query.id)
            // setIdVacant(router.query.id)
        }
    },[router.query?.id])

    const getInfoVacant = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setInfoVacant(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const onFinish = async (values) => {
        setLoading({})
    }

    const onFailed = () => {
        setLoading({})
    }

    const actionBack = () => {

    }

    const propsCustom = {
        action,
        loading,
        fetching,
        setLoading,
        actionBack,
        setActionType,
        childrenIsTabs: true,
        idForm: 'form-vacancies',
        titleCard: action == 'add'
            ? 'Registrar nueva vacante'
            : 'Información de la vacante',
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Tabs
                type='card'
                onChange={e => setCurrentKey(e)}
            >
                <Tabs.TabPane
                    tab='Características del puesto'
                    // forceRender
                    key='1'
                >
                    {/* <Spin spinning={fetching}>
                        <TabFeatures
                            formVacancies={formFeatures}
                        />
                    </Spin> */}
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Educación, competencias y habilidades'
                    // forceRender
                    key='2'
                >
                    {/* <Spin spinning={fetching}>
                        <TabEducation formVacancies={formFeatures} />
                    </Spin> */}
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Sueldo y prestaciones'
                    // forceRender
                    key='3'
                >
                </Tabs.TabPane>
            </Tabs>
            <Spin spinning={fetching}>
                <Form layout='vertical'>
                    <section style={{display: currentKey == '1' ? 'block' : 'none' }}>
                        <TabFeatures
                            formVacancies={formFeatures}
                        />
                    </section>
                    <section style={{ display: currentKey == '2' ? 'block' : 'none' }}>
                        <TabEducation formVacancies={formFeatures} />
                    </section>
                    <section style={{ display: currentKey == '3' ? 'block' : 'none' }}>
                        <TabSalary formVacancies={formFeatures} />
                    </section>
                </Form>
            </Spin>
        </DetailsCustom>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsVacancies);