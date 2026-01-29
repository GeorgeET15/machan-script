Machane!!
ithu i = 0 aanu;

para("Loop starting...");
machane (i < 10) aavane vare {
  i = i + 1;
  
  ipo (i == 3) anengi {
    para("Skipping 3...");
    aavane; // continue
  }
  
  ipo (i == 7) anengi {
    para("Stopping at 7...");
    nirth; // break
  }
  
  para("Count: ", i);
}
para("Loop finished.");
