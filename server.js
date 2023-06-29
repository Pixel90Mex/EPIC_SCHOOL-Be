import express from "express";
import mongoose from "mongoose";
import studentsRoute from "./routes/students/students.js";
import teachersRoute from "./routes/teachers/teacher.js";
import classesRoute from "./routes/classes/classes.js";

const PORT = 6000;

const server = express();

server.use(express.json());

server.use("/", studentsRoute);
server.use("/", teachersRoute);
server.use("/", classesRoute);


mongoose.connect('mongodb+srv://andre90mexican:kKGF8EsYVNsejPJU@corsoepicode.91bakel.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Errore di connessione al database...'));
db.once('open', () => {
  console.log('Connessione al database effettuata con successo...');
});

server.listen(PORT, () => console.log(`Server avviato alla posta ${PORT}`));

