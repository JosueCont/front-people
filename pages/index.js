import Head from 'next/head'
import React, {useEffect} from 'react'
import LoginForm from '../components/LoginForm'

export default function Home() {   
  return (
   <>
   <div className="containerPrincipal">
        <div className="loginContainer">
            <div style={{textAlign:'left'}}>
                <h1 className="font-color-khor">KHOR+</h1>
                <p className="font-color-khor">A new people management experience</p>
            </div>            
            <LoginForm/>
        </div>
   </div> 
  
   </>
  )  
}
