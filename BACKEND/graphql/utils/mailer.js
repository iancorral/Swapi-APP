const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (correo, codigo) => {
  const mailOptions = {
    from: `"Swapi Verification" <${process.env.EMAIL_FROM}>`,
    to: correo,
    subject: 'Código de verificación Swapi',
    text: `Tu código de verificación es: ${codigo}`,
    html: `
      <h2>Bienvenido a nuestra app escolar Swapi</h2>
      <p>Tu código de verificación es:</p>
      <h3 style="color:#007bff">${codigo}</h3>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📨 Correo enviado: ', info.messageId);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
};

module.exports = { sendVerificationEmail };