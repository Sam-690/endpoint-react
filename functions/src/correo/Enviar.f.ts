import * as functions from "firebase-functions";
import * as cors from "cors";
import * as nodemailer from 'nodemailer'
import * as express from "express";
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';

if(!admin.apps.length){
    admin.initializeApp();
}


const transportador = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sam.martinez690@gmail.com',
        pass: 'xxxxxxxxxxx'
    }
});

const endPointExpress = express();
const corsVal = cors({origin:true});
endPointExpress.options('*', corsVal);
endPointExpress.use(corsVal);
endPointExpress.use(cookieParser());

endPointExpress.post('*', async (req, res) =>{
    try{
        const _email = req.body.email;
        const _titulo = req.body.titulo;
        const _mensaje = req.body.mensaje;

        const emailOpciones = {
            from: 'sam.martinez.century@gmail.com',
            to: _email,
            subject: _titulo,
            html: '<p>' + _mensaje + '<p>'
        }

        transportador.sendMail(emailOpciones, function (err, info) {
            if (err) {
                res.send(err);
            } else {
                res.send("el email fue enviado correectamente")
            }
        })

    }
    catch(e){
        console.log('error===>', e);
        res.status(401);
        res.send(e)
    }
})

export = module.exports = functions.https.onRequest((request, response)=>{
    return endPointExpress(request, response);
})

