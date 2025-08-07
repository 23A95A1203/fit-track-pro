require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const Routes = express.Router();

// Controllers & Models
const Contact = require('../controller/contact');
const controllerData = require('../controller/controller');
const Cycle = require('../models/model1');
const exerciseController = require("../controller/ExerciseControllers");
const meditationController = require("../controller/MeditationController");
const yogaController = require("../controller/yogaController");

// ✅ Mail Setup
const sendMail = async (email) => {
  try {
 const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});


const mailOptions = {
  from: '"fit-track-pro" <ravitejakatraju73@gmail.com>',  // ✅ Use a verified sender
  to: email,
  subject: "We will get back to you",
  text: `Thank you for reaching out to us...`
};


    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err; // Re-throw to trigger catch in route
  }
};


// ✅ Contact Form Submission
Routes.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();  // This could be failing
    await sendMail(email);    // Or this could be failing

    res.status(200).json({ message: 'Form submitted successfully and email sent.' });
  } catch (error) {
    console.error('❌ Error submitting form:', error); // Add this
    res.status(500).json({ error: 'Failed to submit the form', details: error.message });
  }
});

// ✅ Get All Contact Submissions
Routes.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({ error: 'Error fetching contact data' });
  }
});

// ✅ Data and Cycle Handling
Routes.post('/get-data', controllerData.getData);
Routes.post('/check-data', controllerData.checkData);
Routes.post('/user-data', controllerData.userData);
Routes.get('/getuser-data/:username', controllerData.getuserData);

Routes.post('/storeCycleData', async (req, res) => {
  const { selectedDate, cycleDays } = req.body;

  try {
    const newCycle = new Cycle({
      selectedDate: new Date(selectedDate),
      cycleDays,
    });

    await newCycle.save();
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('❌ Error storing cycle data:', error);
    res.status(500).json({ error: 'Failed to store cycle data' });
  }
});

// ✅ Save Selected Activities
Routes.post("/saveSelectedExercises", exerciseController.saveSelectedExercises);
Routes.post("/saveSelectedMeditations", meditationController.saveSelectedMeditations);
Routes.post("/saveSelectedYogas", yogaController.saveSelectedYogas);

// ✅ Get Saved Exercises
Routes.get("/getSelectedExercises/:username", exerciseController.getSelectedExercises);

module.exports = Routes;
