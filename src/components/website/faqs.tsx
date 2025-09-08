"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Stuf'd?",
    answer:
      "Stuf'd is a digital menu platform that helps restaurants convert their paper menus into interactive digital experiences. We provide real-time customer ratings, analytics, and tools to boost customer satisfaction and increase positive reviews.",
  },
  {
    question: "How does the digital menu work?",
    answer:
      "Restaurants can easily create digital menus using our drag-and-drop editor. Customers can view the menu on their phones, rate dishes, leave reviews, and share their favorite meals. All data is collected in real-time for restaurant owners to analyze.",
  },
  {
    question: "Do I need technical skills to set up Stuf'd?",
    answer:
      "Not at all! Stuf'd is designed to be user-friendly for restaurant owners and staff. Our setup process takes just 5 minutes, and you can update your menu anytime without any technical knowledge. We also provide training and support.",
  },
  {
    question: "Can I customize the menu design?",
    answer:
      "Yes! Stuf'd offers extensive customization options including your restaurant's branding, colors, fonts, and layout. You can create a menu that perfectly matches your restaurant's style and personality.",
  },
  {
    question: "What kind of analytics do I get?",
    answer:
      "You'll get real-time insights into which dishes are most popular, customer ratings and feedback, peak dining times, and customer preferences. This data helps you make informed decisions about your menu and operations.",
  },
  {
    question: "How does the rating system work?",
    answer:
      "Customers can rate dishes directly from the digital menu using a simple star system. They can also leave written reviews and share their favorite dishes on social media. All ratings are collected and displayed in your analytics dashboard.",
  },
  {
    question: "Can I update my menu in real-time?",
    answer:
      "Absolutely! You can update prices, add new dishes, mark items as unavailable, or make any changes instantly. Updates appear immediately on all customer devices and platforms.",
  },
  {
    question: "What devices does Stuf'd work on?",
    answer:
      "Stuf'd works on all devices - smartphones, tablets, and computers. Your digital menu is automatically optimized for each device type to provide the best viewing experience for your customers.",
  },
  {
    question: "How much does Stuf'd cost?",
    answer:
      "We offer flexible pricing plans starting at $29/month for small restaurants. All plans include a 14-day free trial, so you can try Stuf'd risk-free. Enterprise plans are available for restaurant chains and franchises.",
  },
  {
    question: "What support do you provide?",
    answer:
      "We provide comprehensive support including setup assistance, staff training, and ongoing technical support. Our team is available via email, phone, and live chat to help you get the most out of Stuf'd.",
  },
];

export function WebsiteFAQs() {
  return (
    <aside className="bg-muted/40 py-16 sm:py-24" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a
              href="/contact"
              className="font-medium text-primary hover:underline"
            >
              Contact our support team
            </a>{" "}
            for help
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </aside>
  );
}
