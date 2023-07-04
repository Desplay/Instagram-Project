let Arr = [1, 2, 3];
let Arr2 = Arr;
Arr2.push(...Arr.splice(2, 1));
console.log(Arr2);