import mongoose, { mongo } from 'mongoose';

const URI = process.env.URI;

mongoose.connect(`${URI}`, (err) => {
    if (err) throw err;
    console.log('Mongodb connected')
})