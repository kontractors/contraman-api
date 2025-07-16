import express from "express";

const app = express();


app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});