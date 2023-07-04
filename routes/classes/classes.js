import { Router } from "express";
import classModel from "../../models/classes/classModel.js";
import studentModel from "../../models/students/studentModel.js";
import teacherModel from "../../models/teachers/teacherModel.js";

const router = Router();

//GET
router.get("/classes", async (req, res) => {
    const { page = 1, pageSize = 13 } = req.query;

    try {
        const classes = await classModel
            .find()
            .populate("class.students")
            .populate("class.teachers")
            .limit(pageSize)
            .skip((page - 1) * pageSize);
        
        const totalClasses = await classModel.count();

        res.status(200).send({
            currentPage: +page,
            totalClasses: totalClasses,
            classes,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server",
            error: error.message,
            statusCode: 500
        })
    }
});
//POST --> tengo in considerazione che insegnanti e studenti siano già stati creati
router.post("/classes", async (req, res) => {
    const { section, teachers, students} = req.body;
    //quando monto frontend metto controllo per la section 
    //ciclo con condizionale per la section su array di studenti che arriva nella request + return 
    const classToInsert = await classModel({
        class: {
            section: req.body.class.section,
            teachers: req.body.class.teachers,
            students: req.body.class.students
        }
    })
    console.log(classToInsert)
    try {
        const sectionExist = await classModel.findOne({
            section: req.body.section
        });
        if (sectionExist) {
            return res.status(409).send({
                message: "Sezione già registrata",
                statusCode: 409
            })
        }
        const newClass = await classToInsert.save();
        res.status(201).send({
            message: "Registrazione effettuata",
            statusCode: 201,
            payload: newClass
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server",
            error: error.message,
            statusCode: 500
        })
    }
});

//PATCH PER MODIFICARE LISTA STUDENTI E DOCENTI (AGGIUNGERE O TOGLIERE)

//DELETE PER CANCELLARE CLASSE, TOGLIERE STUDENTE O DOCENTE

export default router;