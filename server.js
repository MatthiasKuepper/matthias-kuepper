// server.js 
// where your node app starts 
// init project 
const express = require("express"); 
const nodemailer = require("nodemailer"); 
const multiparty = require("multiparty"); 
const bodyParser = require("body-parser"); 
require("dotenv").config(); 
const app = express(); 
const fs = require("fs"); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
//Initialisierung 
const cors = require("cors");
app.use(cors());

const path = require("path");

app.set("view engine", "ejs");

const matter = require('gray-matter');

//Definition des Blogs - Initialisierung
app.set("views", path.join(__dirname, "blog"));

//Alle Seiten auf HTTPS umleiten.
function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`. 
// Die statischen Seiten in public und content werden als "statisch" definiert. So können Sie direkt adressiert werden. 
app.use(express.static("public"));
app.use(express.static("secure"));
app.use(express.static("content"));
app.use(express.static("content/news"));

// *******************************
// Passwortgeschützter Bereich
// *******************************

//Render die Datei admin.ejs, wenn die Admin-Seite aufgerufen wird
app.get("/secure", (req, res) => {
  app.set("views", path.join(__dirname, "secure"));
  res.render("login", {
     posts: ' ',
  });
});

//Wenn die Anmeldedaten eingegeben worden sind, wird die Richtigkeit überprüft
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
  
  var userName1 = process.env.userName1;
  var userPass1 = process.env.userPass1;
  
  var userName2 = process.env.userName2;
  var userPass2 = process.env.userPass2;
  
  var userName3 = process.env.userName3;
  var userPass3 = process.env.userPass3;
  
 
	// Ensure the input fields exists and are not empty
	if (username && password) {
    
    if ((username !== userName1 || password !== userPass1) && (username !== userName2 || password !== userPass2) && (username !== userName3 || password !== userPass3)) {
              
              //Wenn die Logindaten nicht korrekt sind, melde dies;
              app.set("views", path.join(__dirname, "secure"));
              response.render("login", {
                  posts: 'Benutzername oder Passwort falsch!', 
              });
 
            } else {
              // Wenn die Daten korrekt sind, wird der passwortgeschützte Bereich aufgerufen
              response.redirect(`/safe-area.html#loggedin`);
              app.set("views", path.join(__dirname, "views"));
            }
  }	
})

// This is the basic-routing 
app.get("/", (request, response) => { 
  response.sendFile(`${__dirname}/views/index.html`); 
}); 
// Routing der index.html als /index 
app.get("/index", (request, response) => { 
  response.sendFile(`${__dirname}/views/index.html`); 
}); 
// Routing der glitch.html als /glitch 
app.get("/wer-bin-ich", (request, response) => { 
  response.sendFile(`${__dirname}/views/wer-bin-ich.html`); 
}); 
// Routing der bildergalerie.html als /bildergalerie 
app.get("/bildergalerie", (request, response) => { 
  response.sendFile(`${__dirname}/views/bildergalerie.html`); 
}); 
// Routing der kontakt.html als /kontakt 
app.get("/kontakt", (request, response) => { 
  response.sendFile(`${__dirname}/views/kontakt.html`); 
}); 
// Routing der kontakt.html als /impressum 
app.get("/impressum", (request, response) => { 
  response.sendFile(`${__dirname}/views/impressum.html`); 
}); 
// Routing der kontakt.html als /erfahrungen 
app.get("/erfahrungen", (request, response) => { 
  response.sendFile(`${__dirname}/views/erfahrungen.html`); 
}); 
// Routing der ehrenaemter.html als /ehrenaemter 
app.get("/ehrenaemter", (request, response) => { 
  response.sendFile(`${__dirname}/views/ehrenaemter.html`); 
}); 
// Routing der content/news/praktikumimbundestag.html als /sankt-martin 
app.get("/praktikumimbundestag", (request, response) => { 
;response.sendFile(`${__dirname}/views/aktuelles/praktikumimbundestag.html`); 
})
// Routing der links.html als /links
app.get("/links", (request, response) => { 
  response.sendFile(`${__dirname}/views/links.html`); 
}); 
// Routing der suchen.html als /suchen
app.get("/suchen", (request, response) => { 
  response.sendFile(`${__dirname}/views/suchen.html`); 
});

// Routing der socialmedia.html als /socialmedia
app.get("/socialmedia", (request, response) => { 
  response.sendFile(`${__dirname}/views/socialmedia.html`); 
}); 
// Routing der politik.html als /politik
app.get("/politik", (request, response) => { 
  response.sendFile(`${__dirname}/views/bilder/Politik.html`); 
}); 
// Routing der .html als /ehrenaemter-beitrag
app.get("/ehrenaemter-beitrag", (request, response) => { 
  response.sendFile(`${__dirname}/views/ehrenaemter-beitrag.html`); 
}); 
// Routing der .html als /sitemap.xml
app.get("/sitemap.xml", (request, response) => { 
  response.sendFile(`${__dirname}/sitemap.xml`); 
});
// Routing der .html als /sitemap.xml
app.get("/blog/index.json", (request, response) => { 
  response.sendFile(`${__dirname}/blog/index.json`); 
});
// Routing der .html als /sitemap.xml
app.get("/generateIndex.js", (request, response) => { 
  response.sendFile(`${__dirname}/generateIndex.js`); 
});
// Routing der .html als /sitemap.xml
app.get("/index.json", (request, response) => { 
  response.sendFile(`${__dirname}/index.json`); 
});

// The E-Mail-Transport initializing 
const transporter = nodemailer.createTransport({ 
  host: "smtp.web.de", //replace with your email provider - this is the host for google mail  
  port: 587, // this port number is usally standard 
  auth: { 
    user: process.env.EMAIL, //This is your E-Mail-Address as environment variable -> see .env 
    pass: process.env.PASS,  //This is your E-Mail-Password as environment variable -> see .env 
  }, 
}); 

// verify connection configuration 
transporter.verify(function (error, success) { 
  if (error) { 
    console.log(error); 
  } else { 
    console.log("Server is ready to take our messages"); 
  } 
}); 
//Funktion für das Senden der E-Mail, hier werden alle Felder des Formulars mit den Daten "vorbereitet" 
app.post("/send", (req, res) => { 
  // Sendig the E-Mail 
  let form = new multiparty.Form(); 
  let data = {}; 
  form.parse(req, function (err, fields) { 
    console.log(fields); 
    Object.keys(fields).forEach(function (property) { 
      data[property] = fields[property].toString(); 
    }); 
    //Hier wird die E-Mail an Euch definiert. Bitten halten Sie sich genau an der vorgegebenen Schreibweise, Info: \n ist ein Umbruch 
    const mail1 = { 
      from: process.env.EMAIL, 
      to: process.env.EMAIL, 
      subject: `Mail von der Website: ${data.reason}`, 
      text: ` Name: ${data.fullname} \n E-Mail: <${data.email}> \n Nachricht: ${data.formmessage}`, 
    }; 
    //Hier wird die E-Mail abgesendet 
    transporter.sendMail(mail1, (err, data) => { 
      if (err) { 
        console.log(err); 
        res.status(500).send("Something went wrong."); 
      } else { 
        res.status(200).send("Email successfully sent to recipient!"); 
      } 
    }); 
     //Hier wird die E-Mail an den Sender definiert, der eine Kopie seiner Nachricht erhält. 
    const mail2 = { 
      from: process.env.EMAIL, 
      to: data.email, 
      subject: `Ihre Mail von der Website: ${data.reason}`, 
      text: ` Name: ${data.fullname} \n E-Mail: <${data.email}> \n Nachricht: ${data.formmessage}`, 
    }; 
    //Hier wird die E-Mail abgesendet 
    transporter.sendMail(mail2, (err, data) => { 
      if (err) { 
        console.log(err); 
      res.status(500).send("Something went wrong."); 
      } else { 
        res.status(200).send("Email successfully sent to recipient!"); 
      } 
    }); 
  }); 
}); 
// listen for requests :) 
var listener = app.listen(process.env.PORT, () => { 
  console.log(`Your app is listening on port ${listener.address().port}`); 
}); 

//Definition des Blogs - Initialisierung
//const cors = require("cors");
app.use(cors());

//const path = require("path");

app.set("views", path.join(__dirname, "blog"));
app.set("view engine", "ejs");

//const matter = require('gray-matter');

 
// *******************************
// Blog - Handling
// *******************************
app.get("/blog", (req, res) => {
  app.set("views", path.join(__dirname, "blog"));
  const dateienVerzeichnis = './blog/'; // Verzeichnis mit deinen Markdown-Dateien
  fs.readdir(dateienVerzeichnis, (err, dateien) => {
    if (err) {
      console.error(err);
      res.status(500).send('Fehler beim Lesen des Verzeichnisses');
      return;
    }
      const mdDateien = dateien.filter(datei => path.extname(datei) === '.md');
      const dateiDaten = mdDateien.map((datei) => {
      const dateiPfad = path.join(dateienVerzeichnis, datei);
      const dateiInhalt = fs.readFileSync(dateiPfad, 'utf8');
      const { data } = matter(dateiInhalt); // Front Matter extrahieren
 
       // Fehlerbehandlung für fehlende oder ungültige Daten
        if (!data.title || typeof data.title !== 'string') {
          data.title = "Blogeintrag";
        }  
        if (!data.description || typeof data.description !== 'string') {
          data.description = "Dieser Blogeintrag ist in Arbeit.";
        }  
        if (!data.date || typeof data.date !== 'string') {
             const today = new Date();
             var month = '' + (today.getMonth() + 1);
             var day = '' + today.getDate();
             var year = today.getFullYear();

             if (month.length < 2) 
                month = '0' + month;
             if (day.length < 2) 
                day = '0' + day;
          
             data.date = [year, month, day].join('-');
             // console.log(data.date);
        } else {
          const dateParts = data.date.split('.');
          // console.log(dateParts);
          if (dateParts.length === 3) {
            data.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
    
        }  
        if (!data.img_bloglist || typeof data.img_bloglist !== 'string') {
          const img_bloglist = "";
        }  
        
        return {
  title: data.title,
  description: data.description,
  date: data.date,
  path: dateiPfad,
  img: data.img_bloglist,
   category: Array.isArray(data.category) ? data.category : [data.category || "Allgemein"]
};

    });
    res.render('blog', { dateiDaten });
  });
});

app.get("/blog/:article", (req, res) => {
  app.set("views", path.join(__dirname, "blog"));
  const file = matter.read(__dirname + '/blog/' + req.params.article + '.md');
 
  var md = require("markdown-it")();
  let content = file.content;
  var result = md.render(content);
  
  res.render("index", {
    post: result,
    title: file.data.title,
    slug: req.params.article,
    description: file.data.description,
    image1: file.data.img1,
    image2: file.data.img2,
    date: file.data.date
  });
});




///////////***************BilderGalerie*****************///////

