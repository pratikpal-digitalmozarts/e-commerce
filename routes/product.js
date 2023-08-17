const express = require('express');
const router = express.Router();
const { getProducts, getCategoryProducts } = require('../models/product');



router.get('/?', (req, res) => {
    const productId = req.query.id;
    const category = req.query.category;
    const user = req.user;

    if(productId && category){
        
        getCategoryProducts(category)
        .then(products => {
            if (products) {
                // console.log('Retrieved products:', (products));
                let productWithId;
                products.forEach(element => {
                    if(element['id'].toString() === productId.toString()){
                        productWithId = element;
                        products.splice(products.indexOf(element), 1);
                    }
                });
                // console.log("Product with specific id", products);
                const message = undefined;
                res.render('product_detail', { user, products, productWithId, message });
            } else {
                console.log('Failed to retrieve products.');
            }
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });

    }
    else if(category){
        
        getProducts()
            .then(products => {
                if (products) {
                    let categorySet = new Set();
                    let categoryProduct = [];
                    products.forEach(element => {
                        if(element["category"] === category) categoryProduct.push(element);
                        categorySet.add(element["category"]);
                    });
                    let diffCategory = Array.from(categorySet);
                    let strcategoryProduct = JSON.stringify(categoryProduct);
                    res.render("product", { user, products, strcategoryProduct, diffCategory });

                } else {
                    console.log('Failed to retrieve products.');
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
            });

    }
    else{
        getProducts()
            .then(products => {
                if (products) {
                    // console.log('Retrieved products:', JSON.stringify(products));
                    // const user = req.user;
                    shuffle(products);
                    //console.log("suffeled")
                    
                    let j=15;
                    let categorySet = [];
                    let categoryProduct = [];
                    while(categorySet.length <= 3){
                        if(!(categorySet.includes(products[j]["category"]))){
                            categorySet.push(products[j]["category"])
                            categoryProduct.push(products[j]);
                            j++;
                        }
                    }
                    
                    res.render('index', { user, products, categoryProduct });
                } else {
                    console.log('Failed to retrieve products.');
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
            });
    }

});

router.get('/category', (req, res) => {
    const user = req.user;

    getProducts()
    .then(products => {
        let uniqueCategory = [];
        let categoryArr = [];
        products.forEach(element => {
            if(!uniqueCategory.includes(element['category'])){
                uniqueCategory.push(element["category"]);
                categoryArr.push(element);
            }
            
        });
        res.render('category', { user, categoryArr } );
    })
    .catch(error => {
        console.log('Error: ', error);
    })
});

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

module.exports = router