Machane!!

// Arrays
ithu list = [10, 20, 30] aanu;
para("Initial array: ", list);
para("Item at 1: ", list[1]);

array_push(list, 40);
para("After push: ", list);
para("Length: ", array_length(list));

// Objects
ithu person = {
  per: "George",
  vayas: 25
} aanu;

para("Person Obj: ", person);
para("Person Name: ", person.per);

person.job = "Developer";
para("After update: ", person);
