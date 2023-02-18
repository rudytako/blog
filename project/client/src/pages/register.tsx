import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import { Link, useLocation } from 'react-router-dom';

const Register = () => {
    const { search } = useLocation()

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h3 className="text-uppercase text-center mb-4">Register</h3>
                <RegisterForm/>
                <p className="mt-2">
                    {`Already have an account? `}
                    <Link to={`/login${search}`} style={{color: 'crimson'}}>
                        Login Now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register;