  /*
        so the schema we given for validation validates the schema we requested throuh postman or request body
        {
        campground:{
        title:String required,
        price:Number required min(0),
        location:String req,
        description:String req,
        image:String req
        }
        
        campground:{
        tile:'..'
        price:-5,
        location:'String' ,
        description:'String' ,
        image:'String req'
        
        we validate the upper next schema with upper schema to check if they all are correct 
        if the have any error the validate(req.body) return an object in that object it has 
        error object if they dont have any error the returned object doesnt contain any error property
        in that error object it has details property which is array 
         
        errors:{
        details:[{
            name:String,
           message:String,
           stack:String
        }]
        }
        const a = error.details.map(e => e.message).join('.')
        so what ever we return with this it stores it in array like this
        a = [error.message]
        with join method we can convert an array in to string
         }
        
        }
so pull operator is used to remove any ghing inside of the array
like
{$pull :{key:value}}









        */