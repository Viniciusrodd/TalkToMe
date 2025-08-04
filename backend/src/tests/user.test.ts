
// libs
import request from "supertest";
import { v4 } from "uuid";

// connection sql
import connection from "../database/connection/connection";

// configs
import app from "../app";
const req = request(app);

// variables

// tests
describe('user tests', () =>{
    // user register
    test('Should test a user register', async () =>{
        const userTest = {
            id: v4(), name: 'test2', email: `test${Date.now()}@gmail.com`, password: '123fdsfds'
        };

        try{
            const res = await req.post('/register/').send(userTest);
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


    // close connection after tests
    afterAll(async () =>{
        await connection.close();
    });
});