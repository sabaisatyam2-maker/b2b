const sendEmail = require("../utils/sendEmail");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const emailHtml = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail({
      to: "satyamsabai2@gmail.com",
      subject: "New Contact Form Message — BizSphere",
      html: emailHtml,
    });

    res.status(200).json({ message: "Thanks! We'll get back to you soon." });
  } catch (error) {
    console.error("Error in sendContactMessage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendContactMessage,
};
