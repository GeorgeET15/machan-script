Machane!!
ithu x = 10 aanu;
ithu y = 20 aanu;

// Comparison and If-Else (ipo ... anengi ... alengi)
ipo (x < y) anengi {
  para("x is smaller than y");
} alengi ipo (x == y) anengi {
  para("x is equal to y");
} alengi {
  para("x is larger than y");
}

// Logical Operators
ipo (x > 5 && y > 15) anengi {
  para("Both conditions true");
}

ipo (x == 100 || y == 20) anengi {
  para("One condition true");
}

ipo (! (x == 5)) anengi {
  para("Not x == 5 is true");
}
