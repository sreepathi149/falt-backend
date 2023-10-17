const { s3Uploadv2 } = require('../helpers/s3')
const Tasks = require('../models/tasks-model')
const tasksCltr = {}

tasksCltr.create = async (req, res) => {
    try {
        const body = req.body
        const tasks = new Tasks(body)
        tasks.company = req.user.company
        tasks.assignedBy = req.user.id
        tasks.fieldStatus = req.files
        const tasksDoc = await tasks.save()
        res.json(tasksDoc) 
    } catch(e) {
        res.json(e)
    }
}

tasksCltr.showTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find().populate('client assignedTo company')
        res.json(tasks)
    } catch(e){
        res.json(e)
    }
}

tasksCltr.showTask = async (req, res) => {
    try {
        const id =  req.params.id
        const tasks = await Tasks.findById(id)
        res.json(tasks)
    } catch(e) {
        res.json(e)
    }
}

tasksCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const tasks = await Tasks.findByIdAndUpdate(id, {...body, company:req.user.company}, {runValidators: true, new: true})
        res.json(tasks) 
    } catch(e) {
        res.json(e)
    }
}

tasksCltr.uploads = async (req, res) => {
    try {
        const id = req.params.id
        const files = req.files
        console.log(files, 'files')
        const result = await s3Uploadv2(files)
        console.log(result)
        const tasks = await Tasks.findByIdAndUpdate(id, {fieldStatus: result, status: "completed" }, {runValidators: true, new: true})
        res.json(tasks) 
    } catch(e) {
        res.json(e)
    }
}

tasksCltr.remove = async (req, res) => {
    try {
        const id = req.params.id
        const tasks = await Tasks.findByIdAndDelete(id)
        res.json(tasks)
    } catch(e) {
        res.json(e)
    }
}


module.exports = tasksCltr