// modules
import app from './app';
import connection from './database/connection/connection';
import models from './database/relations';


// database connection
connection.authenticate()
    .then(() =>{
        console.log('Database authenticated');
        return connection.sync();
    })
    .catch((error) =>{
        console.log('Database error at authenticated', error);
    });


const PORT = parseInt(process.env.BACKEND_PORT || '3000', 10); // fallback for 3000 if undefined
app.listen(PORT, '0.0.0.0', () =>{
    console.log(`Server running on port ${PORT}`);
});