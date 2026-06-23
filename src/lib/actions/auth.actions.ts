"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  authenticateUser,
  registerUser,
} from "@/lib/services/user.service";
import { loginSchema, registerSchema } from "@/lib/validators/user";
import type { ZodIssue } from "zod";

function parseErrors(issues: ZodIssue[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    errors[issue.path.map(String).join(".")] = issue.message;
  }
  return errors;
}

export async function loginAction(
  formData: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parseErrors(parsed.error.issues) };
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return {
      success: false,
      errors: { _form: "Email sau parolă incorectă." },
    };
  }

  await createSession(user.id);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function registerAction(
  formData: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parseErrors(parsed.error.issues) };
  }

  const result = await registerUser({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    password: parsed.data.password,
  });

  if (!result.success) {
    return { success: false, errors: { _form: result.error } };
  }

  await createSession(result.user.id);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/autentificare");
}
