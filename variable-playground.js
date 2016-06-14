var person = {
    name: 'Jason',
    age: 28
};

function updatePerson(obj){
    obj.age = 21;
}

updatePerson(person);
console.log(person);

var grades = [15, 27];
function addArray(arr){
    //arr.push(65);
    arr = [15, 27, 65];
}

addArray(grades);
console.log(grades);