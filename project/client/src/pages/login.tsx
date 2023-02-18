import React, { useState, useEffect } from "react";
import LoginPass from "../components/auth/LoginPass";
import LoginSMS from "../components/auth/LoginSMS";
import SocialLogin from "../components/auth/SocialLogin";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootStore } from "../utils/TypeScript";

const Login = () => {
    const [sms, setSms] = useState(false);
    const navigate = useNavigate();

    const { search } = useLocation()

    const { authReducer } = useSelector((state: RootStore) => state);

    useEffect(() => {
        if(authReducer.access_token) {
            let url = search.replace('?', '/')
            return navigate(url);
        }
    }, [authReducer.access_token, navigate])

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h3 className="text-uppercase text-center mb-4">Login</h3>

                <SocialLogin/>
                {sms ? <LoginSMS/> : <LoginPass />}
                
                <small className="row my-2 text-primary" style={{ cursor: 'pointer' }}>
                    <span className="col-6">
                        <Link to='/forgot_password'>
                            Forgot password?
                        </Link>
                    </span>

                    <span className="col-6 text-end" onClick={() => setSms(!sms)}>
                        {sms ? 'Sign in with password' : 'Sign in with SMS'}
                    </span>
                </small>

                <p>
                    {`You don't have an account? `}
                    <Link to={`/register${search}`} style={{color: 'crimson'}}>
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;