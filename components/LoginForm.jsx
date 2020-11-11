import { Form, Input, Button, Checkbox } from 'antd';
import Router from 'next/router'

const LoginForm = () => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
    login(values.username, values.password)
  };

  const login = async (username,password)=>{    
    try{
        console.log(username, username)        
        Router.push("/home");      
    }catch(e){
        alert('Hubo un  problema al iniciar sesión, por favor verifica tus credenciales')
        console.log(e)
    }finally{
        
    }

}

  return (
    <>  
    <Form 
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >       
      <Form.Item
        name="username"
        label="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >        
        <Input  placeholder="Username" />
      </Form.Item>         
      <Form.Item
        name="password"
        label="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >       
        <Input          
          type="password"
          placeholder="Password"
        />
      </Form.Item>      
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" className="ckeck-khor" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>        
      </Form.Item>

      <Form.Item>
        <Button style={{width:'100%!important'}} type="primary" htmlType="submit" className="login-form-button">
          Log in 
        </Button>       
      </Form.Item>
    </Form>    
     </>
    );
};

export default LoginFom;