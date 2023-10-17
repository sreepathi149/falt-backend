const Company = require('../models/company-model')

const companyCltr = {}

companyCltr.create = async (req, res) => {
    try {
        const body = req.body
        const company = new Company(body)
        company.owner = req.user.id
        const companyDoc = await company.save()
        res.json(companyDoc)
    } catch(e) {
        res.json(e)
    }
}

companyCltr.showList = async (req, res) => {
    try {
        const company = await Company.find({owner: req.user.id}).populate('owner')
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

companyCltr.showCompany = async (req, res) => {
    try {
        const id = req.params.id
        const company = await Company.findById(id)
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

companyCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const company = await Company.findByIdAndUpdate(id, body, {runValidators: true, new: true})
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

companyCltr.remove = async (req, res) => {
    try {
        const id = req.params.id
        const company = await Company.findByIdAndDelete(id)
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

module.exports = companyCltr