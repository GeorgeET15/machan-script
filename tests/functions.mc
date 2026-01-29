Machane!!

// Function declaration (machane pani <name>)
machane pani sangathi(a, b) {
  return a + b;
}

para("Sum: ", sangathi(10, 20));

// Recursive function
machane pani factorial(n) {
  ipo (n <= 1) anengi {
    return 1;
  }
  return n * factorial(n - 1);
}

para("Factorial of 5: ", factorial(5));
