let rect = require('./rectangle');

// synchronous function
// function solveRect(l,b) {
//     console.log("Solving for rectangle l = " + l + " and b = " + b);
    
//     if (l <= 0 || b <= 0){
//         console.log("Rectangle dimesnions should be greater than 0 : " +" l = " + l + " and b = " + b); 
//     } else {
//         console.log("The area of the ractangle is " + rect.area(l,b));
//         console.log("The perimeter of the ractangle is " + rect.perimeter(l,b));
//     }
// }

function solveRect(l,b) {
    console.log("Solving for rectangle l = " + l + " and b = " + b);

    rect(l,b,(err, rectangle) => {
        if(err){
            console.log("ERROR", err.message);
        } else {
            console.log("The area of the rectangle of dimensions l = " + l + " and b = " + b + " is " + rectangle.area() + ".");
            console.log("The perimeter of the rectangle of dimensions l = " + l + " and b = " + b + " is " + rectangle.perimeter() + ".");
        }
    });

    console.log("This statement is after the call to rect()!");    
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);