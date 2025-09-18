import { ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

export function ProblemStatement() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background w-full" aria-label="Problem Statement">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto relative justify-center items-center w-full">
        <Card className="bg-red-200 dark:bg-red-800/50 text-foreground text-left md:text-center border-none w-fit">
          <CardHeader>
            <CardTitle>I&apos;ve struggled with expensive camera gear!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              I wanted to try professional camera equipment but was so frustrated with
              high rental costs, limited availability, and expensive gear that I couldn&apos;t afford.
              I almost gave up on my photography dreams.
            </p>
            <hr className="my-4 border-foreground/20" />
            <ul className="list-disc list-inside mb-4">
              <li>
                <b>$500+</b> monthly rental costs for basic gear
              </li>
              <li>
                <b>2 hrs+</b> searching for available equipment
              </li>
              <li>
                <b>1 hr+</b> traveling to rental shops
              </li>
              <li>
                <b>3 hrs+</b> dealing with rental shop policies
              </li>
              <li>
                <b>5 hrs+</b> lost opportunities due to gear unavailability
              </li>
              <li>
                <b>2 hrs+</b> learning new equipment on tight deadlines
              </li>
              <li>
                <b>4 hrs+</b> managing rental schedules and returns
              </li>
              <li>
                <b>10+ hrs+</b> lost clients to photographers with better gear
              </li>
              <li>
                <b>∞ hrs+</b> stress and frustration...
              </li>
            </ul>
            <p className="text-lg mb-4">
              <b>27+ hours of headaches per month</b>
            </p>
            <p className="text-lg">
              <b>No way to access professional equipment affordably</b>
            </p>
          </CardContent>
        </Card>
        <Link
          href="/#features"
          className="flex flex-row gap-2 items-center text-foreground/50 hover:text-foreground"
        >
          I knew there was a better way <ArrowDown className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
