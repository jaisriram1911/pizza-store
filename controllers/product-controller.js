const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')

const Product = require('../models/product-schema');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.productById = (req, res, next, _id) =>{
    Product.findById(_id).exec((err, product)=>{
        if(err || !product){
            return res.status(400).json({
                error: 'product not found!'
            })
        }
        req.product = product
        next();
    });
};

	exports.read = async (req, res) => {
    	  let category = await Category.find({ product: req.params.product }).exec();
    	  Product.find({ category })
    	    .populate("product", "_id name product")
    	    .populate("postedBy", "_id name username")
    	    .exec((err, products) => {
    	      if (err) {
	        return res.status(400).json({
    	          error: errorHandler(err),
    	        });
    	      }
    	      res.json({ category, products });
    	    });
	};
    


exports.create = (req, res ) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err , fields , files)=>{
        if(err){
            return res.status(400).json({
                error: 'image could not be uploaded'
            })
        }

        const { name ,
            description , 
            price , 
            category , 
            quantity , 
            shipping} = fields;

        if(!name || 
            !description || 
            !price || 
            !category || 
            !quantity || 
            !shipping ){
            return res.status(400).json({
                error: "fields cannot be empty."
            })
        }

        let product = new Product(fields)

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "image cant be of size more than 1mb."
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err , result) =>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(error) 
                })
            }
 
            res.json(result);
        })

    })
}


exports.remove = (req, res) =>{
    let product = req.product
    product.remove((err, deletedProduct)=>{
        if( err){
            return res.status(400).json({
                error: errorHandler(error) 
            })
        }
        res.json({
            message: "product deleted." 
        })
    })
}

exports.update = (req, res ) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err , fields , files)=>{
        if(err){
            return res.status(400).json({
                error: 'image could not be uploaded'
            })
        }

        const { name ,
            description , 
            price , 
            category , 
            quantity , 
            shipping} = fields;

        if(!name || 
            !description || 
            !price || 
            !category || 
            !quantity || 
            !shipping ){
            return res.status(400).json({
                error: "fields cannot be empty."
            })
        }

        let product = req.product
        product = _.extend(product , fields);

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "image cant be of size more than 1mb."
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err , result) =>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(error) 
                })
            }

            res.json(result);
        }) 
 
    })
}
 
exports.list = (req, res) =>{
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : 'category._id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy , order]])
    .limit(limit)
    .exec((err , products)=>{
        if(err){
            return res.status(400).json({
                error: 'products not found'
            })
        }
        res.json(products);
    })
};


exports.listRelated = (req, res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) :20;

    Product.find({_id: { $ne: req.product} , category: req.product.category})
    .limit(limit)
    .populate('category' , '_id name')
    .exec((err , products) =>{
        if(err){
            return res.status(400).json({
                error: 'products not found'
            })
        }
        res.json(products);

    })
}

exports.listCategories = (req, res) =>{
    Product.distinct('category' , {} , (err , Categories) =>{
        if(err){
            return res.status(400).json({
                error: 'Categories not found'
            })
        }

        res.json(Categories);
    })
}  
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo=(req, res, next) =>{
    if(req.product.photo.data){
        res.set('Content-Type' , req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}