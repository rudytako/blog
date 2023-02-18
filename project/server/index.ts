import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { SocketServer } from './config/socket';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Socket.io
const http = createServer(app)
export const io = new Server(http)

io.on("connection", (socket: Socket) => {
  SocketServer(socket)
})

// Routes
app.use('/api', routes.authRouter);
app.use('/api', routes.userRouter);
app.use('/api', routes.categoryRouter);
app.use('/api', routes.blogRouter);
app.use('/api', routes.commentRouter);

// Database
import './config/database';
import { create } from 'domain';

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log('SERVER IS RUNNING ON PORT ' + PORT)
})