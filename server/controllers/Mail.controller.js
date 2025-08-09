import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import { sendMail } from "../utils/mail.js";

// @route POST /api/mail/send
export const sendBulkMail = asyncHandler(async (req, res) => {
  const { subject, template, context, roles } = req.body;

  let users;
  if (roles && roles.length > 0) {
    users = await User.find({ role: { $in: roles } });
  } else {
    users = await User.find();
  }

  const results = [];
  for (const user of users) {
    await sendMail({
      to: user.email,
      subject,
      template,
      context: { ...context, username: user.username },
    });
    results.push(user.email);
  }

  res.status(200).json({
    success: true,
    message: `Sent "${subject}" to ${results.length} users.`,
    data: results,
  });
});
