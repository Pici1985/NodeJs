let rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for rectangle l = " + l + " and b = " + b);
    
    if (l <= 0 || b <= 0){
        console.log("Rectangle dimesnions should be greater than 0 : " +" l = " + l + " and b = " + b); 
    } else {
        console.log("The area of the ractangle is " + rect.area(l,b));
        console.log("The perimeter of the ractangle is " + rect.perimeter(l,b));
    }
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);