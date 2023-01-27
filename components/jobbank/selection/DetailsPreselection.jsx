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
import TabDetail from './TabDetail';

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
  const [disableTab, setDisabledTab] = useState(true);
  const [infoSelection, setInfoSelection] = useState({})
  const [comments, setComments] = useState([])


  useEffect(()=>{
    if(router.query.id && action == 'edit'){
      getInfoVacant(router.query.id)
    }
},[router.query?.id])

  useEffect(() => {
    if(Object.keys(infoSelection).length > 0){
      formPreselection.setFieldsValue(({
        candidate: infoSelection?.candidate?.fisrt_name + infoSelection?.candidate?.last_name,
        vacant: infoSelection?.vacant?.job_position,
        email: infoSelection?.candidate?.email,
        telephone: infoSelection?.candidate?.telephone || infoSelection?.candidate?.cell_phone,
        status_process: infoSelection?.status_process
      }))
      if (infoSelection.comments && infoSelection.comments.length > 0){
        setComments(infoSelection.comments)
      }
      // if (!infoSelection.main_comments) return
      // setMsgHTML(infoSelection.main_comments);
      // let convert = convertFromHTML(infoSelection.main_comments);
      // let htmlMsg = ContentState.createFromBlockArray(convert);
      // let template = EditorState.createWithContent(htmlMsg);
      // setEditorState(template);
    }
  }, [infoSelection])
  


  const getInfoVacant = async (id) => {
    try {
      setFetching(true)
      let response = await WebApiJobBank.getInfoSelection(id)
      if(response && response.data){
        setInfoSelection(response.data)
      }
    } catch (error) {
      console.log('Error', error)
    } finally {
      setFetching(false)
    }
  }
  

  const actionBack = () =>{
      router.push({
          pathname: '/jobbank/selection',
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
    idForm: 'form-selection',
    titleCard: action == 'add'
        ? 'Registrar nuevo cliente'
        : 'Información del proceso de selección',
    }

    const createData = (obj) =>{
      console.log('object', obj)
      let noValid = [undefined, null,""," "];
      let dataClient = new FormData();
      dataClient.append('person', user.id)
      dataClient.append('status_process', obj.status_process)
      // Object.entries(obj).map(([key, val])=>{
      //     let value = noValid.includes(val) ? "" : val;
      //     dataClient.append(key, value);
      // });
      return dataClient;
  }

  const onFinisUpdate = async (values) =>{
    setFetching(true)
    try {
        await WebApiJobBank.updateDetailSelection(router?.query?.id, values);
        message.success('Proceso de selección actualizada');
        getInfoVacant(router.query.id)
    } catch (e) {
        console.log(e)
        message.error('Proceso de selección no actualizada');
    } finally {
      setFetching(false);
    }        
}

  const onFinish = (values) => {
    console.log('values', values)
    setFetching(true);
    const bodyData = createData(values);
    onFinisUpdate(bodyData)
    // const actionFunction = {
    //     edit: onFinisUpdate,
    //     add: onFinishCreate
    // };
    // actionFunction[action](bodyData);
  }

  const onFinishFailed = () =>{
    setLoading({})
}
    
    return (
      <DetailsCustom {...propsCustom}>
        <Form
          className='tabs-vacancies'
          form={formPreselection}
          id='form-selection'
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{is_active: true}}
        >
          <Tabs
            type='card'
            activeKey={action == 'edit' ? router.query?.tab ?? '1' : currentKey}
            onChange={onChangeTab}
          >
            <Tabs.TabPane
              tab='Detalle del proceso de selección'
              forceRender
              key='1'
            >
              <Spin spinning={fetching}>
                <TabDetail 
                  listComments = { comments }
                  loading = { fetching }
                  setLoading = { setFetching }
                  id = { router?.query.id }
                  person = { user?.id }
                  getInfoVacant = { getInfoVacant }
                />
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