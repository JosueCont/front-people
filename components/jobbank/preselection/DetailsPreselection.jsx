import React, {
  useEffect,
  useState
} from 'react';
import {
  Tabs,
  Form,
  Spin,
  message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DetailsCustom from '../DetailsCustom';

const DetailsPreselection = ({
  action,
  user,
  currentNode,
  newFilters = {},
  isAutoRegister = false
}) => {
  const router = useRouter();
  const [formPreselection] = Form.useForm();
  const [loading, setLoading] = useState({});
  const [actionType, setActionType] = useState('');
  const [fetching, setFetching] = useState(false);
  const [currentKey, setCurrentKey] = useState('1');

  const actionBack = () =>{
    router.push({
        pathname: '/jobbank/preselection',
        query: newFilters
    })
  }

  const onChangeTab = (tab) =>{
    if(action == 'add'){
        setCurrentKey(tab)
        return;
    }
    let querys = {...router.query, tab};
    if(querys['tab'] == '1') delete querys['tab'];
    router.replace({
        pathname: router.asPath.split('?')[0],
        query: querys
    }, undefined, {shallow: true})
}

  const propsCustom = {
    action,
    loading,
    fetching,
    setLoading,
    actionBack,
    setActionType,
    isAutoRegister,
    idForm: 'form-preselection',
    titleCard: action == 'add'
        ? 'Registrar nuevo cliente'
        : 'Información de la preselección',
    }

    return (
      <DetailsCustom {...propsCustom}>
        <Form
          className='tabs-vacancies'
          form={formPreselection}
          id='form-clients'
          layout='vertical'
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          initialValues={{is_active: true}}
        >
          <Tabs
            type='card'
            activeKey={action == 'edit' ? router.query?.tab ?? '1' : currentKey}
            onChange={onChangeTab}
          >
            <Tabs.TabPane
              tab='Información del cliente'
              forceRender
              key='1'
            >
              <Spin spinning={fetching}>
                Hola
              </Spin>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </DetailsCustom>
    )


}

const mapState = (state) =>{
  return{
      currentNode: state.userStore.current_node,
      user: state.userStore.user
  }
}

export default connect(mapState)(DetailsPreselection);