"use server";
import { createAuthSession, destorySession, verifyAuth } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import user from "@/lib/user";
import { lucia } from "lucia";
import { redirect } from "next/navigation";
export const authAction = async (prevState, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const errors = {};

  if (!email.includes("@")) {
    errors.email = "please enter valid email";
  }
  if (password.trim().length < 8) {
    errors.password = "password must be atleast 8 character long";
  }
  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }
  try {
    const hashedPassword = hashUserPassword(password);
    const id = user(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "email is already registered for an account",
        },
      };
    }
  }
  const isValidPassword = verifyPassword(
    existingUser.password,
    password,
    password
  );

  if (!isValidPassword) {
    return {
      errors: {
        password: "Could not authenticate user,please check your credentials",
      },
    };
  }
  await createAuthSession(existingUrl);
  redirect("/training");
};

export const logout =async()=>{
await destorySession()
redirect('/')
}