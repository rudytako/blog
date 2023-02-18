import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite'
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { gapi } from 'gapi-script'
import { googleLogin, facebookLogin } from '../../redux/actions/authAction'
import store from '../../redux/store'

const SocialLogin = () => {
    const clientId = "294804505732-qnvd6uvd0tqhe6j3p0lm3m7dii5453ik.apps.googleusercontent.com"
    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.auth2.init({clientId: clientId})
        })
    }, [])

    const onSuccess = (response: GoogleLoginResponse ) => {
        console.log(response)
        const id_token = response.getAuthResponse().id_token
        dispatch(googleLogin(id_token))
    }

    const onFBSuccess = (response: FacebookLoginAuthResponse) => {
        console.log(response)
        const { accessToken, userID } = response.authResponse
        dispatch(facebookLogin(accessToken, userID))
    }

    return (
        <>
        <div className='my-3'>
            <GoogleLogin
                client_id={clientId}
                onSuccess={onSuccess}
                cookiepolicy={'single_host_origin'}
            />
        </div>
        <div className='my-2'>
            <FacebookLogin 
                appId="1293139908209733"
                onSuccess={onFBSuccess}
            />
        </div>
        </>
    )
}

export default SocialLogin