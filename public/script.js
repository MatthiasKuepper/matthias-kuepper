
/* -- ----------------------------- */ 

/* -- BKSD - Remove Active         */ 

/* -- ----------------------------- */ 

function active_remove() { 

  $('.active').each(function () { 

    $(this).removeClass('active'); 

  }); 

} 

  

/* -- ------------------------------ */ 

/* -- BKSD - Set Active Menü        */ 

/* -- ------------------------------ */ 

function setActiveMenu(id) { 

  active_remove(); 

  jQuery(id).addClass('active'); 

} 

  

/* ------------------------------------------ */ 

/* -- Inhalte laden                          */ 

/* ------------------------------------------ */ 

function load_content(bereich, page) { 

  let obj1 = document.getElementById(bereich); 

  if (obj1) { 

    $(obj1).load('/' + page); 

  } 

} 

  

/* ------------------------------------------ */ 

/* -- Funktion für das Versenden der Mail    */ 

/* ------------------------------------------ */ 

const sendMail = (mail) => { 

  fetch("/send", { 

    method: "post", 

    body: mail, 

  }) 

    .then((response) => response.text()) 

    .then((text) => { 

      console.log("Serverantwort:", text); 

    }) 

    .catch((error) => { 

      console.error("Fehler beim Versenden der Mail:", error); 

    }); 

}; 
/* --------------------------------------------------------- */ 

/* -- Eingabeprüfung für das Kontaktformular                 */ 

/* -- ---------------- --------------------------------------*/ 

function validateForm() { 

   

// Definiere die Variable zur Benennung der Form 

const contactForm = document.getElementById("myForm"); 

 

var alert_flag = "true"; 

 if(contactForm.fullname.value == "")  { 

   alert("Geben Sie bitte Ihren Namen an!"); 

   contactForm.fullname.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

  if(contactForm.email.value == "") { 

   alert("Geben Sie bitte Ihre E-Mail-Adresse an!"); 

   contactForm.email.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

   if(contactForm.email.value.indexOf('@') == -1) { 

   alert("Dies ist keine gültige E-Mail-Adresse!"); 

   contactForm.email.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

 if(contactForm.reason.value == "")  { 

   alert("Geben Sie bitte Ihr Anliegen an!"); 

   contactForm.reason.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

 if(contactForm.formmessage.value == "")  { 

   alert("Geben Sie bitte einen Nachrichtentext an!"); 

   contactForm.formmessage.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

 if(contactForm.ds_check.checked == false)  { 

   alert("Wenn Sie die Speicherung Ihrer Daten nicht wünschen, nehmen Sie bitte mit uns telefonisch Kontakt auf. Die Kontaktinformationen finden Sie ebenfalls auf unserer Web-site."); 

   contactForm.ds_check.focus(); 

   var alert_flag = "false"; 

   return false; 

  } 

 if(alert_flag == "true") { 

     

    /* Zeigt den E-Mail-Versands an und versteckt gleichzeitig den Sendebutton */ 

    let obj_erg_form = document.getElementById('ergebnis_send'); 

    let obj_submit = document.getElementById('Submit'); 

    obj_erg_form.style.display = 'block'; 

    obj_submit.style.display = 'none'; 

  

    //Dies stellt sicher, dass die Mail nur einmal gesendet wird 

    event.preventDefault(); 

     

    //Hole die Daten  

    let mail = new FormData(contactForm); 

 

    //Rufe die Funktion "sendMail" für die Versendung der Mail auf.  

    sendMail(mail); 

    

   //Leere das Formular nach der Versendung der E-Mail 

   contactForm.fullname.value = ""; 

   contactForm.email.value = ""; 

   contactForm.reason.value = ""; 

   contactForm.formmessage.value = ""; 
 } 
} 
