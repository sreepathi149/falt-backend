const { S3 } = require('aws-sdk')
const {v4 : uuidv4} = require('uuid')
uuidv4()

exports.s3Uploadv2 = async(files)=>{
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    const params = files.map(file=>{
        return {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`uploads/${uuidv4()}-${file.originalname}`,
            Body:file.buffer
        }
   })
   return await Promise.all(params.map(param=>s3.upload(param).promise())) 
}