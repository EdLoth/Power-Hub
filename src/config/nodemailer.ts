import mailer from "nodemailer";

// export const mail = mailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAILER_EMAIL,
//     pass: process.env.MAILER_PASS,
//   },
// });

export const mail = mailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  // tls: {
  //   ciphers: "SSLv3",
  // },
  auth: {
    type :'login',
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS,
  },
});
