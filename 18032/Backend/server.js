const express=require('express');
const cors=require('cors');
const app=express();
const {userRouter}=require('./routes/auth.routes');
const {transactionRouter}=require('./routes/transaction.routes')
const {merchantRouter}=require('./routes/merchant.routes');
const PORT= process.env.PORT;

// Middleware
app.use(cors(
    {origin:'*'}
));
app.use(express.json());

//Routes
app.use('/user',userRouter);
app.use('/transaction',transactionRouter);
app.use('/merchant',merchantRouter);

app.listen(PORT,()=>{
    console.log('Server started on PORT:','0.0.0.0',PORT);
})