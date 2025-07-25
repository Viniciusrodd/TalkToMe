// modules
import express from 'express';
const router = express.Router();

router.get('/test', (req, res) =>{
    return res.status(200).send({ msg: 'Routes test success!' });
});

export default router; 