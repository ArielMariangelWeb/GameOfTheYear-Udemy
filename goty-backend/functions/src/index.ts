import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://firestore-grafica-d151c.firebaseio.com"
  });

  const db = admin.firestore();


 export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({
      mensaje: "Hola mundo desde Funciones de Firebase!!!"
    });
 });

 export const getGOTY = functions.https.onRequest( async(request, response) => {
});

   // Express
   const app = express();
   app.use( cors({ origin: true }) );

   app.get('/goty', async(req, res) => {

    const gotyRef = db.collection('goty');
    const docsSnap = await gotyRef.get();
    const juegos = docsSnap.docs.map((doc: any ) => doc.data() );

    res.json( juegos );

   });

   app.post('/goty/:id', async(req, res) => {

    const id = req.params.id;
    const gameRef = db.collection('goty').doc( id );
    const gameSnap = await gameRef.get();

    if ( !gameSnap.exists ) {
      res.status(404).json({
        ok: false,
        mensaje: 'No existe un juego con ese ID'
      });
    } else {

      const antes = gameSnap.data() || { votos: 0};
      await gameRef.update({
        votos: antes.votos +1
      });

      res.json({
        ok: true,
        mensaje: `Gracias por tu voto a ${ antes.name }`

      });
    }


   });


   export const api = functions.https.onRequest( app );
