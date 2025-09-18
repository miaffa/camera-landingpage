"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { appConfig } from "@/lib/config";
import { Mail, MapPin, Phone } from "lucide-react";
import { WebPageJsonLd } from "next-seo";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Thank you for your message! We'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/contact`}
        title="Contact Us"
        description="Get in touch with us. We'd love to hear from you."
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: appConfig.legal.phone,
            email: appConfig.legal.email,
            contactType: "customer service",
          },
        }}
      />
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-20">
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h1 className="text-3xl font-bold md:text-5xl text-gray-900 dark:text-white">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 dark:border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Fill up the form and our Team will get back to you within 24
                  hours.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: "Call Us",
                    details: [appConfig.legal.phone],
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    details: [appConfig.legal.email],
                  },
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    details: [
                      appConfig.projectName,
                      appConfig.legal.address.street,
                      `${appConfig.legal.address.city}, ${appConfig.legal.address.state}`,
                      `${appConfig.legal.address.postalCode}, ${appConfig.legal.address.country}`,
                    ],
                  },
                ].map((item, i) => {
                  const iconGradients = [
                    "from-blue-400 to-blue-600", // Phone - blue gradient
                    "from-purple-400 to-purple-600", // Email - purple gradient  
                    "from-blue-500 to-purple-500" // Address - blue to purple gradient
                  ];
                  
                  return (
                  <div key={i} className="flex gap-4 bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 dark:border-white/20 rounded-xl p-6 shadow-lg">
                    <div className="shrink-0">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${iconGradients[i]} shadow-lg`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      {item.details.map((detail, j) => (
                        <p key={j} className="text-gray-600 dark:text-gray-300">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 dark:border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us how we can help..."
                            className="min-h-[120px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
