import React, {
  useEffect,
  useState,
  useMemo
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
import WebApiAssessment from '../../../api/WebApiAssessment';
import DetailsCustom from '../DetailsCustom';
import TabDetail from './TabDetail';
import TabAsign from './TabAsign';
import TabKhorEvaluations from './TabKhorEvaluations';

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
  const [fetchingCliente, setFetchingCliente] = useState(false);
  const [currentKey, setCurrentKey] = useState('1');
  const [disableTab, setDisabledTab] = useState(true);
  const [infoSelection, setInfoSelection] = useState({})
  const [comments, setComments] = useState([])
  const [ assesments, setAssesments ] = useState([])
  const [asignaments, setAsignaments ] = useState([])
  const [personalAsignament, setPersonalAsignament] = useState([])

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

  useEffect(() => {
    if(!router.query.user_person) return
    getAsignamentByPerson(router.query?.user_person)
  },[router.query?.user_person])

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

  const getAsignamentByPerson = async (id, type = '') => {
    let data = {
      person: id
    }
    try {
      let response = await WebApiAssessment.getAssignListPersonal(data)
      if(response?.data.length <= 0) return
      setPersonalAsignament(response.data)
    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {
    if(Object.keys(infoSelection).length > 0){
      formPreselection.setFieldsValue(({
        candidate: infoSelection?.candidate?.first_name + infoSelection?.candidate?.last_name,
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
      setFetchingCliente(true)
      let response = await WebApiJobBank.getVacancyAssesmentCandidateVacancy(id)
      let results = response.data?.results ?? [];
      setAsignaments(results)
      setFetchingCliente(false)
    } catch (error) {
      setFetchingCliente(false)
      console.log('Error', error)
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
    router.replace({
        pathname: '/jobbank/selection/details',
        query: {...router.query, tab}
    }, undefined, {shallow: true})
}

  const activeKey = useMemo(()=>{
    let tab = router.query?.tab;
    return action == 'edit'
      ? tab ? tab : '1'
      : currentKey;
  },[router.query, currentKey, action])

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
            activeKey={activeKey}
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
              tab='Evaluaciones cliente'
              forceRender
              key='2'
            >
              <TabAsign 
                loading={ fetchingCliente }
                setLoading = { setFetchingCliente }
                assesments = { assesments }
                processSelection = { infoSelection?.id }
                asignaments = { asignaments }
                getAssesmets = { getAssesmets }
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab='Evaluaciones KHOR+'
              forceRender
              key='3'
            >
              <Spin spinning={fetching}>
                <TabKhorEvaluations 
                  loading={ fetching }
                  setLoading = { setFetching }
                  assesments = { assesments }
                  processSelection = { infoSelection?.id }
                  asignaments = { asignaments }
                  getAssesmets = { getAssesmets }
                  currentNodeId = { currentNode?.id }
                  personAssignament = { personalAsignament }
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