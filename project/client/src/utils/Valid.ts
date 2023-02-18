import { IUserRegister, IBlog } from "./TypeScript";

export const validRegister = (userRegister: IUserRegister) => {
    const {name, account, password, cf_password} = userRegister;
    const errors: string[] = [];

    if(!name) {
        errors.push('Please enter your name')
    }
    if (name.toString().length > 20) {
        errors.push('Name must be up to 20 characters')
    }

    if (!account) {
        errors.push('Please enter your email or phone number')
    } else if (!validPhone(account.toString()) && !validateEmail(account.toString())) {
        errors.push('Email or phone number format is incorrect')
    }

    const msg = checkPassword(password, cf_password)
    if (msg) errors.push(msg)

    return {
        errMsg: errors,
        errLength: errors.length
    }

}

export const checkPassword = (password: string, cf_password: string) => {
    if (password.length < 6) return ('Password must be at least 6 characters')
    if (password !== cf_password) return ('Passwords do not match')
}

export const validPhone = (phone: string) => {
    const re = /^[+]/g
    return re.test(phone)
}
  
export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validCreateBlog = ({title, content, description, thumbnail, category}: IBlog) => {
    const err: string[] = []

    if (title.trim().length < 10) {
        err.push('Title must be at least 10 characters')
    } else if (title.trim().length > 50) {
        err.push('Title must be up to 50 characters')
    }

    if (content.trim().length < 2000) {
        err.push('Content must be at least 2000 characters')
    }

    if (description.trim().length < 50) {
        err.push('Description must be at least 50 characters')
    } else if (title.trim().length > 200) {
        err.push('Description must be up to 200 characters')
    }

    if (!thumbnail) {
        err.push('Thumbnail cannot be left blank')
    }

    if (!category) {
        err.push('Category cannot be left blank')
    }

    return {
        errMsg: err,
        errLength: err.length
    }
}