const express = require('express');

const app = express();

app.listen(9000,_=>{
  console.log(`server running on port ${9000}`)
})