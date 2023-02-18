import { Request, Response, NextFunction } from 'express'

const validRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { name, account, password } = req.body

    const errors = []

    if(!name) {
        errors.push('Please enter your name')
    }
    if (name.toString().length > 20) {
        errors.push('Name must be up to 20 characters')
    }

    if (!account) {
        errors.push('Please enter your email or phone number')
    }
    if (!validPhone(account.toString()) && !validateEmail(account.toString())) {
        errors.push('Email or phone number format is incorrect')
    }

    if (password.toString().length < 6) {
        errors.push('Password must be at least 6 characters')
    }

    if (errors.length > 0) {
        return res.status(400).json({msg: errors})
    }

    next();
}

export const validPhone = (phone: string) => {
    const re = /^[+]/g
    return re.test(phone)
}
  
export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default validRegister;