const mongoose = require('mongoose');

async function Database() {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.mongodb).then(async () => {
        console.log(`[ The Database Has Been Registered ]`);
    }).catch(async () => {
        console.log(`[ I can't Access The Database ]`);
    })
} Database();