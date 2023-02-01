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
import TabAsign from './TabAsign';

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
  const [ assesments, setAssesments ] = useState([])
  const [asignaments, setAsignaments ] = useState([])

  useEffect(()=>{
    if(router.query.id && action == 'edit'){
      getInfoVacant(router.query.id)
      getAssesmets(router.query.id)
    }
},[router.query?.id])


  useEffect(() => {
    if(router.query?.vacant){
      getEvaluationVacant(router.query?.vacant)
    }
  },[router.query?.vacant])

  const getEvaluationVacant = async (id) => {
    try {
      let response = await WebApiJobBank.getEvaluationsVacant(id)
      if(response && response.data?.results?.length > 0){
        setAssesments(response.data.results)
      }
    } catch (error) {
      console.log('Error', error)
    }
  } 

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
        let noValid = [undefined, null,""," "]
        let cleanComments = infoSelection.comments.filter((comment) => !noValid.includes(comment.comments))
        setComments(cleanComments)
      }
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

  const getAssesmets = async (id) => {
    try {
      let response = await WebApiJobBank.getVacancyAssesmentCandidateVacancy(id)
      console.log('dededed', response)
      if(response){
        setAsignaments(response.data.results)
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  
  

  const actionBack = () =>{
      router.push({
          pathname: '/jobbank/selection',
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
    setFetching(true);
    const bodyData = createData(values);
    onFinisUpdate(bodyData)
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
                  statusProcess = { infoSelection?.status_process }
                />
              </Spin>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab='Asignar evaluación'
              forceRender
              key='2'
            >
              <Spin spinning={fetching}>
                <TabAsign 
                  loading={ fetching }
                  setLoading = { setFetching }
                  assesments = { assesments }
                  processSelection = { infoSelection?.id }
                  asignaments = { asignaments }
                  getAssesmets = { getAssesmets }
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
      user: state.userStore.user,
  }
}

export default connect(mapState)(DetailsPreselection);