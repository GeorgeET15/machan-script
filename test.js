import ps from "prompt-sync";

const prompt = ps();

console.log("I will now ask you for your name.");

var name = prompt("Enter your name: ");

console.log("Hello ".concat(name, ". How are you?"));
