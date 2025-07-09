import express from 'express';
import { createServer } from 'http';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { setupSocket } from './infrastructure/services/Socket';
import userRouter from './interfaces/routes/userRoutes';
import adminRouter from './interfaces/routes/adminRoutes';
import employeeRouter from './interfaces/routes/empRoutes';
import { connectDatabase } from './infrastructure/config/database'; 
import errorMiddleware from './interfaces/middlewares/globalError';
import { createLoggingMiddleware } from './interfaces/middlewares/logging';
// import './infrastructure/cron/unBanScheduler'
// import './infrastructure/cron/primeCheck'

dotenv.config();

const app = express()
const server = createServer(app);
const port = process.env.PORT || 5000;

//app.use(cors({ origin: process.env.ORIGIN, credentials: true, }));
app.use(cors({
    origin: ["https://appcloser.xyz","https://www.appcloser.xyz" ,"https://api.appcloser.xyz","http://localhost:3000"],
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    
}));

//Logging
app.use(morgan("dev"));
//app.use(createLoggingMiddleware());

//Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15, // 15 minutes, matching access token expiration
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/employee', employeeRouter);
app.use(errorMiddleware);

connectDatabase();
export let io: any;
io = setupSocket(server)

server.listen( port, ()=> {
 console.log(`Server running`);
});