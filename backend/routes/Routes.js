require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const Routes = express.Router();

// Controllers & Models
const Contact = require('../controller/contact'); // Make sure this is updated as shown below
const controllerData = require('../controller/controller');
const Cycle = require('../models/model1');
const exerciseController = require("../controller/ExerciseControllers");
const meditationController = require("../controller/MeditationController");
const yogaController = require("../controller/yogaController");

// ✨ Update sendMail function to receive subject & message
const sendMail = async (email, name, subjectText, messageText) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Fit Track Pro 🏋️‍♂️" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out! 💪",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f9fc; color: #333;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #0A1019; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">Fit Track Pro</h2>
              <p style="margin: 5px 0;">Your Wellness Partner</p>
            </div>
            <div style="padding: 20px;">
              <h3 style="color: #0A1019;">Hi ${name},</h3>
              <p style="line-height: 1.6;">
                Thank you for reaching out to us! 💬<br>
                We’ve received your message and one of our team members will get back to you as soon as possible.
              </p>
              <hr style="margin: 20px 0;">
              <p><strong>Your Subject:</strong> ${subjectText}</p>
              <p><strong>Your Message:</strong><br>${messageText}</p>
              <p style="margin-top: 20px; font-style: italic; color: #555;">
                Until then, stay active and stay healthy! 💚
              </p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://yourdomain.com" style="padding: 10px 20px; background-color: #55E6A5; color: #0A1019; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Fit Track Pro</a>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Fit Track Pro. All rights reserved.
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};


Routes.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save(); // ✅ Works here

    await sendMail(email, name, subject, message);

    res.status(200).json({ message: "Contact submitted and email sent!" });
  } catch (err) {
    console.error("❌ Contact submission error:", err);
    res.status(500).json({ error: "Failed to submit contact form" });
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

// Other Routes...
Routes.post('/get-data', controllerData.getData);
Routes.post('/check-data', controllerData.checkData);
Routes.post('/user-data', controllerData.userData);
Routes.get('/getuser-data/:username', controllerData.getuserData);
Routes.post('/storeCycleData', async (req, res) => {
  const { selectedDate, cycleDays } = req.body;
  try {
    const newCycle = new Cycle({ selectedDate: new Date(selectedDate), cycleDays });
    await newCycle.save();
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('❌ Error storing cycle data:', error);
    res.status(500).json({ error: 'Failed to store cycle data' });
  }
});

Routes.post("/saveSelectedExercises", exerciseController.saveSelectedExercises);
Routes.post("/saveSelectedMeditations", meditationController.saveSelectedMeditations);
Routes.post("/saveSelectedYogas", yogaController.saveSelectedYogas);
Routes.get("/getSelectedExercises/:username", exerciseController.getSelectedExercises);

module.exports = Routes;
