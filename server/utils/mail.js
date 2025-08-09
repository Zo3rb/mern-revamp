import nodemailer from "nodemailer";
import appConfig from "../config/index.js";
import fs from "fs";
import path from "path";

// Load template as a string and replace {{variable}} with context values
function renderTemplate(templateName, context = {}) {
  const templatePath = path.join(
    process.cwd(),
    "emails",
    `${templateName}.html`
  );
  let html = fs.readFileSync(templatePath, "utf-8");
  for (const [key, value] of Object.entries(context)) {
    html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
  }
  return html;
}

const transporter = nodemailer.createTransport({
  host: appConfig.EMAIL_HOST,
  port: appConfig.EMAIL_PORT,
  auth: {
    user: appConfig.EMAIL_USER,
    pass: appConfig.EMAIL_PASS,
  },
  secure: false,
});

export const sendMail = async ({ to, subject, template, context }) => {
  const html = renderTemplate(template, context);
  return transporter.sendMail({
    from: `"snippets" <${appConfig.EMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });
};
