import { db } from "@/db/db";

export async function registerUser(data) {
  const exists = await db.users.where("email").equals(data.email).first();
  if (exists) {
    throw new Error("User already exists");
  }

  await db.users.add({
    name: data.name,
    email: data.email,
    password: data.password,
    country: data.country,
    role: data.role || "user", // ✅ FIX
  });

  return true;
}

export async function loginUser({ email, password }) {
  const user = await db.users.where("email").equals(email).first();

  if (!user) {
    throw new Error("User not found. Please register.");
  }

  if (user.password !== password) {
    throw new Error("Wrong password");
  }

  return user; // user.role included
}

export async function updateUser(userId, updates) {
  if (!userId) throw new Error("User id required");

  // Prevent changing email via this endpoint to keep login stable
  if (updates.email) delete updates.email;

  await db.users.update(userId, updates);
  const updatedUser = await db.users.get(userId);
  return updatedUser;
} 
