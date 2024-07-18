import { z } from "zod";

const userSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
  });