const Category = require('../models/category-model')

const categoryCltr = {}

categoryCltr.create = async (req, res) => {
    try {
        const body = req.body
        const category = new Category(body)
        category.company = req.user.company
        const categoryDoc = await category.save()
        res.json(categoryDoc)
    } catch(e) {
        res.json(e)
    }
}

categoryCltr.showCategories = async (req, res) => {
    try {
        const categories = await Category.find({company: req.user.company}).populate('company')
        res.json(categories)
    } catch(e) {
        res.json(e)
    }
}

categoryCltr.showCategory = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)
        res.json(category)
    } catch(e) {
        res.json(e)
    }
}

categoryCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const category = await Category.findByIdAndUpdate(id, {...body, company:req.user.company}, {runValidators: true, new: true})
        res.json(category)
    } catch(e) {
        res.json(e)
    }
}

categoryCltr.remove = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findByIdAndDelete(id)
        res.json(category)
    } catch(e) {
        res.json(e)
    }
}

module.exports = categoryCltr