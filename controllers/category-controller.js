const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');
const category = require('../models/category');

exports.create = (req, res) =>{
    const category = new Category( req.body )
    category.save((err , data) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
            
        }
        res.json({data});
    })
}; 


exports.categoryById = (req, res, next , _id) =>{
    Category.findById(_id).exec((err, category)=>{
        if(err || !category){
            return res.status(400).json({
                error: 'category doesnt exist.'
            })
            
        }
        req.category = category;
        next();
    })
}

exports.read = (req ,res) =>{
    return res.json(req.category);
}


exports.update = (req, res)=>{

    const category = req.category
    category.name = req.body.name
    category.save((err , data) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })

}

exports.remove = (req, res)=>{

    const category = req.category;

    category.remove((err , data) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'category successfully deleted.'
        });
    })

}

exports.list = (req, res)=>{
    category.find().exec((err , data) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })
    
}