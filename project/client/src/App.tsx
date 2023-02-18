import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageRender from './PageRender'
import Header from './components/global/Header'
import Footer from './components/global/Footer'
import { Alert } from './components/alert/Alert'
import { refreshToken } from './redux/actions/authAction'
import { getCategories } from './redux/actions/categoryAction'
import { getHomeBlogs } from './redux/actions/blogAction'
import store from './redux/store'
import { io } from 'socket.io-client'
import SocketClient from './SocketClient'

export const socket = io()

const App = () => {
  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(refreshToken())
    dispatch(getCategories())
    dispatch(getHomeBlogs())
  }, [dispatch])

  return (
    <div className="container">
      <SocketClient/>
      <Router>
        <Alert/>
        <Header/>
        <Routes>
          <Route path="/" element={<PageRender/>}/>
          <Route path="/:page" element={<PageRender/>} />
          <Route path="/:page/:slug" element={<PageRender/>} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  )
}

export default App;