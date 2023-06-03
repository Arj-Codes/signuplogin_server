const users = require("../models/userSchema");
const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/signup", async (req, res) => {
  const { Name, Email } = req.body;
  if (!Name || !Email) {
    res.status(400).json({ error: "Enter all the input data" });
  }
  try {
    const preuser = await users.findOne({ Email: Email });
    if (preuser) {
      res.status(400).json({ error: "This user already exists!" });
    } else {
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const mail = {
        from: process.env.EMAIL,
        to: Email,
        subject: "OTP for verification to Highway Delite",
        text: `OTP : ${otp}`,
      };
      transporter.sendMail(mail, (error) => {
        if (error) {
          console.log(error);
          res.status(400).json("Email not sent");
        } else {
          console.log("Email sent");
          res.status(200).json("Email sent successfully");
        }
      });
      const userSignup = new users({ Name, Email, otp });
      const storeData = await userSignup.save();
      res.status(200).json(storeData);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details" });
  }
});

router.put("/otp", async (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    res.status(400).json({ error: "Enter your email" });
  }
  try {
    const preuser = await users.findOne({ Email: Email });
    if (preuser) {
      const otp = Math.floor(Math.random() * 900000) + 100000;
      // const preEmail = await userotp.findOne({ Email: Email });
      // if (preEmail) {
      const updateOTP = await users.findOneAndUpdate(
        { Email:Email },
        {
          otp,
        },
        {
          new: true,
        }
      );
      await updateOTP.save();
      const mail = {
        from: process.env.EMAIL,
        to: Email,
        subject: "OTP for verification to Highway Delite",
        text: `OTP : ${otp}`,
      };
      transporter.sendMail(mail, (error) => {
        if (error) {
          console.log(error);
          res.status(400).json("Email not sent");
        } else {
          console.log("Email sent");
          res.status(200).json(updateOTP);
        }
      });
    } else {
      res.status(400).json({ error: "This email is not registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details" });
  }
});

router.get("/userotp/:id", async (req, res) => {
  try {
    const u = await users.findById(req.params.id);
    res.status(200).json(u);
  } catch (error) {
    res.status(400).json("Email not found");
  }
});

router.put("/verification/:id", async (req, res) => {
  try {
    const u = await users.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: "true",
      },
      { new: true }
    );
    await u.save();
    res.status(200).json(u);
  } catch (error) {
    res.status(400).json("Could not verify");
  }
});

module.exports = router;
