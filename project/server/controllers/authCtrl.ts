import { Request, Response } from 'express';
import Users from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../config/generateToken';
import sendEmail from '../config/sendMail';
import { validateEmail, validPhone } from '../middleware/valid';
import { sendSMS, smsOTP, smsVerify } from '../config/sendSMS';
import { IDecodedToken, IUser, IGgPayload, IUserParams, IFbPayload } from '../config/interface';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)

const CLIENT_URL = `${process.env.BASE_URL}`

const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body;

            const user = await Users.findOne({account})
            if (user) return res.status(400).json({msg: 'Email or phone number already exists'})

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = {
                name, account, password: passwordHash
            }

            const active_token = generateActiveToken({newUser});
            const url = `${CLIENT_URL}/active/${active_token}`;

            if (validateEmail(account)) {
                sendEmail(account, url, 'Verify your email adress')
                res.json({msg: 'Success! Please check your email.'})
            } else if (validPhone(account)) {
                console.log('sending SMS to: ' + account)
                sendSMS(account, url, 'Click the link below to verify phone number')
                return res.json({msg: 'Success! Please check your phone.'})
            }

        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message})
        }
    },
    activeAccount: async (req: Request, res: Response) => {
        try {
            const { active_token } = req.body;

            const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

            const { newUser } = decoded;
            if (!newUser) return res.status(400).json({msg: "Invalid authentication"})

            const user = await Users.findOne({account: newUser.account});
            if (user) return res.status(400).json({msg: 'Account already exists.'})

            const new_user = new Users(newUser);
            await new_user.save();

            res.json({msg: "Account has been activated"});
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { account, password } = req.body;

            const user = await Users.findOne({account});
            if (!user) return res.status(400).json({msg: 'This user does not exist'})

            loginUser(user, password, res);

        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            return res.json({msg: "Logged out!"})
        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({msg: 'Please login now'});

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
            if (!decoded) return res.status(400).json({msg: 'Please login now'});

            const user = await Users.findById(decoded.id).select('-password');
            if (!user) return res.status(400).json({msg: 'This account does not exist'});

            const access_token = generateAccessToken({id: user._id});
            res.json({ access_token, user })
        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    googleLogin: async (req: Request, res: Response) => {
        try {
            const { id_token } = req.body;
            const verify = await client.verifyIdToken({
                idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
            });

            const { email, email_verified, name, picture } = <IGgPayload>verify.getPayload();

            if(!email_verified) return res.status(500).json({msg: "Email verification failed"});

            const password = email +'your google secret password';
            const passwordHash = await bcrypt.hash(password, 12)
            
            const user = await Users.findOne({account: email})

            if(user) {
                loginUser(user, password, res);
            } else {
                const user = {name, account: email, password: passwordHash, avatar: picture, type: 'google'}
                registerUser(user, res)
            }
        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    facebookLogin: async (req: Request, res: Response) => {
        try {
            const { access_token, userID } = req.body;
            console.log(access_token, userID)

            const URL = `
                https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${access_token}
            `

            const data = await fetch(URL).then(res => res.json()).then(res => { return res} )

            const { email, name, picture } = <IFbPayload>data

            const password = email +'your facebook secret password';
            const passwordHash = await bcrypt.hash(password, 12)
            
            const user = await Users.findOne({account: email})

            if(user) {
                loginUser(user, password, res);
            } else {
                console.log('elo')
                const user = {name, account: email, password: passwordHash, avatar: picture.data.url, type: 'facebook'}
                registerUser(user, res)
            }

        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    loginSMS: async (req: Request, res: Response) => {
        try {
            const { phone } = req.body;
            const data = await smsOTP(phone, 'sms')
            res.json({data})
        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    },
    smsVerify: async (req: Request, res: Response) => {
        try {
            const { phone, code } = req.body;
            const data = await smsVerify(phone, code)
            if (!data?.valid) return res.status(400).json({msg: "Invalid Authentication"});

            const password = phone +'your google secret password';
            const passwordHash = await bcrypt.hash(password, 12)
            
            const user = await Users.findOne({account: phone})

            if(user) {
                loginUser(user, password, res);
            } else {
                const user = {name: phone, account: phone, password: passwordHash, type: 'mobile'}
                registerUser(user, res)
            }

        } catch (err) {
            if (err instanceof Error) return res.status(500).json({msg: err.message});
        }
    }
}

const loginUser = async (user: IUser, password: string, res: Response) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        let msgErr = user.type === 'register'
        ? 'Password is incorrect'
        : `Password is incorrect. This account logins with ${user.type}`
        return res.status(400).json({msg: msgErr});
    }

    const access_token = generateAccessToken({id: user._id});
    const refresh_token = generateRefreshToken({id: user._id});

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30*24*60*60*1000
    })

    res.json({
        msg: 'Login success',
        access_token,
        user: { ...user._doc, password: '' }
    })
}

const registerUser = async (user: IUserParams, res: Response) => {
    const newUser = new Users(user);
    await newUser.save();

    const access_token = generateAccessToken({id: newUser._id});
    const refresh_token = generateRefreshToken({id: newUser._id});

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30*24*60*60*1000
    })

    res.json({
        msg: 'Login success',
        access_token,
        user: { ...newUser._doc, password: '' }
    })
}

export default authCtrl;