import bcrypt from "bcrypt";
import Joi from "joi";
const generator = require("generate-password");
const nodemailer = require("nodemailer");
import {
  loginUser,
  createUser,
  getUsers,
  deleteUsers,
  disableUser,
  updateUser,
} from "../models/users";

let transporter = nodemailer.createTransport({
  host: "",
  port: 587,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
});

const inputSchema = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required(),
  last_name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  home_address: Joi.string(),
  work_address: Joi.string(),
  profile_pic: Joi.object(),
  admin_rights: Joi.number(),
});

export const getUsersController = async (req: any, res: any) => {
  console.log("Entering getUsersController");
  let response = await getUsers();
  console.log(response);
  if (response) {
    res.send(response);
  }
};

export const createUserController = async (req: any, res: any) => {
  console.log("Entering createUserController");
  try {
    let validationResponse = await inputSchema.validate(req.body);

    if (validationResponse.error) {
      res.send(validationResponse.error?.details[0].message);
    } else {
      var password = generator.generate({
        length: 10,
        numbers: true,
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      let formJson: any = req.body;
      formJson.password = hashedPassword;
      let response = await createUser(formJson);
      console.log(password);
      if (response) {
        res.send(response);
        let info = await transporter.sendMail({
          from: '"admin@gmail.com',
          to: req.body.email,
          subject: "Account created",
          text: `Hello ${req.body.first_name} ${req.body.last_name} 
         Account is created with credentials
         email:${req.body.email}
         password:${password}`,
        });
        console.log(info);
      }
    }
  } catch {}
};

export const createAdminUserController = async (req: any, res: any) => {
  console.log("Entering createAdminUserController");
  try {
    let validationResponse = await inputSchema.validate(req.body);

    if (validationResponse.error) {
      res.send(validationResponse.error?.details[0].message);
    } else {
      var password = generator.generate({
        length: 10,
        numbers: true,
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      let formJson: any = req.body;
      formJson.password = hashedPassword;
      formJson.admin_rights = 1;
      let response = await createUser(formJson);
      if (response) {
        res.send(response);
        let info = await transporter.sendMail({
          from: '"admin@gmail.com',
          to: req.body.email,
          subject: "Account created",
          text: `Hello ${req.body.first_name} ${req.body.last_name} 
         Account is created with credentials
         email:${req.body.email}
         password:${password}`,
        });
        console.log(info);
      }
    }
  } catch {}
};

export const loginUserController = async (req: any, res: any) => {
  console.log("Entering loginUserController");
  try {
    const { email, password } = req.body;
    let user: any = await loginUser(email);

    if (user.length > 0) {
      bcrypt
        .compare(password, user[0].password)
        .then(async (response: any) => {
          if (response) res.json({ data: user });
          else res.send("Incorrect user details");
        })
        .catch((err: any) => console.log(err));
    } else res.send("User disabled or does not exist");
  } catch {}
};

export const deleteUsersController = async (req: any, res: any) => {
  console.log("Entering deleteUsersController");
  try {
    let response = await deleteUsers(req.body.id);
    console.log(response);
    if (response) {
      res.send(response);
    }
  } catch {}
};

export const disableUserController = async (req: any, res: any) => {
  console.log("Entering disableUserController");
  let response = await disableUser(req.body.id);
  console.log(response);
  if (response) {
    res.send(response);
  }
};

export const updatePasswordController = async (req: any, res: any) => {
  console.log("Entering updatePasswordController");
  try {
    const { email, old_password, new_password } = req.body;
    let user: any = await loginUser(email);

    if (user.length > 0) {
      bcrypt
        .compare(old_password, user[0].password)
        .then(async (response: any) => {
          if (response) {
            const hashedPassword = await bcrypt.hash(new_password, 10);
            let updateResponse = await updateUser(user[0].id, {
              password: hashedPassword,
            });
            res.send(updateResponse);
          } else res.send("Incorrect user details");
        })
        .catch((err: any) => console.log(err));
    } else res.send("User disabled or does not exist");
  } catch {}
};

export const updateUserController = async (req: any, res: any) => {
  console.log("Entering updateUserController");
  try {
    const updateObj: any = req.body;

    if (!updateObj.password && !updateObj.email) {
      let updateResponse = await updateUser(req.params.id, updateObj);
      res.send(updateResponse);
    } else res.send("Cannot update Password and Email");
  } catch {}
};
