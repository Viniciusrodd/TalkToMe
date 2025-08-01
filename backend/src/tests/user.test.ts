
// libs
import request from "supertest";
import { v4 } from "uuid";

// configs
import app from "../app";
const req = request(app);

// variables

// tests
describe('user tests', () =>{
    // user register
    test('Should test a user register', async () =>{
        const userTest = {
            id: v4(), name: 'test', email: `test${Date.now()}gmail.com`, password: 'test123'
        };

        try{
            const res = await req.post('/register').send(userTest);
            if(res.status === 201){
                console.log('USER REGISTER TEST SUCCESS');
            }

            expect(res.status).toEqual(201);
        }
        catch(error){
            console.error('ERROR AT USER REGISTER TEST', error);
            throw error;
        }
    });
});