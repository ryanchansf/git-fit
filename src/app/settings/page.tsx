"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import connectDB from "@/database/db";

// All fields are optional
// Can be empty, but if not empty, 2 <= chars <= 30
const formSchema = z.object({
  first: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(30, { message: "First name must be less than 30 characters." })
    .or(z.literal("")),
  last: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(30, { message: "Last name must be less than 30 characters." })
    .or(z.literal("")),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must be less than 30 characters." })
    .or(z.literal("")),
  email: z
    .string({ required_error: "Please input an email." })
    .max(30, { message: "Email must be less than 30 characters." })
    .email()
    .or(z.literal("")),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: "",
      last: "",
      username: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  //Object { first: "dddd", last: "aaaaa", username: "aaaaaa", email: "djdjd@gmail.comn" }
  //Object { first: "", last: "", username: "", email: "" }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">Settings</h1>
        <h1 className="text-lg">
          Change all, one, or none of the available fields.
        </h1>
        <hr></hr>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update first name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your first name as it appears publicly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your last name as it appears publicly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update username</FormLabel>
                  <FormControl>
                    <Input placeholder="user" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@domain.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the email address attached to your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <i style={{ color: "hsl(var(--primary))" }} />
              <span style={{ color: "hsl(var(--accent))" }}>
                Submit Changes
              </span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
