import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { RootStore } from '../../utils/TypeScript';
import { useSelector, useDispatch } from 'react-redux';
import store from '../../redux/store';
import { logout } from '../../redux/actions/authAction';

const Menu = () => {
    const { authReducer } = useSelector((state: RootStore) => state);
    const { pathname } = useLocation();

    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    const bfLoginLinks = [
        { label: 'Login', path: '/login'},
        { label: 'Register', path: '/register'}
    ]

    const afLoginLinks = [
        { label: 'Home', path: '/'},
        { label: 'CreateBlog', path: '/create_blog'}
    ]

    const navLinks = authReducer.access_token ? afLoginLinks : bfLoginLinks

    const isActive = (pn: string) => {
        if (pn === pathname) return 'active'
    }

    return (
        <ul className="navbar-nav ms-auto">
            {
                navLinks.map((link, index) => (
                    <li key={index} className={`nav-item ${isActive(link.path)}`}>
                        <Link className="nav-link" to={link.path}>{link.label}</Link>
                    </li>
                ))
            }

            {
                authReducer.user?.role === 'admin' &&
                <li className={`nav-item ${isActive('/category')}`}>
                    <Link className='nav-link' to='/category'>Categories</Link>
                </li>
            }

            {
                authReducer.user &&
                <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={authReducer.user.avatar} alt='avatar' className='avatar' />
                </span>

                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to={`/profile/${authReducer.user._id}`}>Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" onClick={() => dispatch(logout())} to="/">Logout</Link></li>
                </ul>
            </li>
            }
        </ul>
    )
}

export default Menu