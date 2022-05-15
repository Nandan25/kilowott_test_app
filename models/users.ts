import { get, insert, remove, update } from "../config/database";

export const getUsers = async () => {
  console.log("Entering get users model");
  return await get(
    "SELECT `id`, `first_name`+`last_name` as name, `email`, `home_address`, `work_address`, `profile_pic`, if(`active`=1,'No','Yes') as disabled,`created_at` as created FROM `users` where admin_rights=0 "
  );
};

export const createUser = async (formJson: any) => {
  console.log("Entering create user model");
  return await insert("users", formJson);
};

export const loginUser = async (email: string) => {
  console.log("Entering login user model");
  return await get(
    `Select id, first_name,last_name,password, email, home_address,work_address, profile_pic,if(admin_rights=1,'Admin','Standard') as user_type,created_at as created from users where email='${email}' and active=1`
  );
};

export const deleteUsers = async (id: number) => {
  console.log("Entering delete users model");
  return await remove("users", id);
};

export const disableUser = async (id: number) => {
  console.log("Entering disable user model");
  return await update("users", { active: 0 }, id);
};

export const updateUser = async (id: number, dataJson: any) => {
  console.log("Entering update user model");
  return await update("users", dataJson, id);
};
