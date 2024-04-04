import React, { useEffect } from 'react'
import logo from "../Images/logo.png"
import GIcon from "../Images/googleIcon.png"
import light from "../Images/light.png"
import man from "../Images/man.png"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../ConfigFirebase'
import { useNavigate } from 'react-router-dom'
import styles from "./Login_Signup.module.css"

function Login_Signup() {

  const handleClick = () => {
    signInWithPopup(auth,provider).then((res)=>{
      console.log(res,"userData");
      navigate("/dashboard")
    }).catch((err)=>{
      console.log(err,"error");
    })
  }

  const navigate = useNavigate()

  useEffect(()=>{
    auth.onAuthStateChanged((userData)=>{
      console.log(userData);
      if(userData?.email){
        navigate("/dashboard")  
      }
    })
  })


  return (
    <>
      <div className='row'>

        {/* left */}
        <div className={`col-lg-6 col-md-6 ${styles.left}`}>
          <div className='row'>
            <a href='/'>
              <img src={logo} alt="logo" className={`${styles.logo} mt-5 ms-5`}></img>
            </a>
          </div>
          <div className={`row ${styles.loginContent}`}>
            <div className='col-lg-2 col-2'></div>
            <div className='col-lg-7 col-8 d-flex flex-column justify-content-center align-items-center'>
              <h3 className='text-center'>LOGIN</h3>
              <p className='text-center mt-3 opacity-50'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquet at eleifend feugiat vitae faucibus nibh dolor dui. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquet at eleifend feugiat vitae faucibus nibh dolor dui. 
              </p>
              <div type="button" className={`${styles.gButton} d-flex justify-content-center align-items-center`} onClick={handleClick}>
                <div className={`${styles.gIconbgm} m-1 d-flex justify-content-center align-items-center`}>
                  <img src={GIcon} className={`${styles.gIcon}`} alt='GIcon'></img> 
                </div>
                <p className={`${styles.signIntext}`}>Sign in using Google</p>
              </div>
            </div>
            <div className='col-lg-3'></div>
          </div>
        </div>

        {/* right */}
        <div className={`col-lg-6 col-md-6 ${styles.right}`}>
          <img src={light} alt='light' className={`${styles.light}`}></img>
          <img src={man} alt="man" className={`${styles.man}`}></img>
        </div>
      </div>
    </>
  )
}

export default Login_Signup