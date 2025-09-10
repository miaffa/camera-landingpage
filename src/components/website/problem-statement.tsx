import { ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

export function ProblemStatement() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background w-full" aria-label="Problem Statement">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto relative justify-center items-center w-full">
        <Card className="bg-red-200 dark:bg-red-800/50 text-foreground text-left md:text-center border-none w-fit">
          <CardHeader>
            <CardTitle>I&apos;ve struggled with paper menus!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              I wanted to modernize my restaurant but was so frustrated with
              paper menus, printing costs, outdated prices, and losing customers
              to competitors. I almost gave up.
            </p>
            <hr className="my-4 border-foreground/20" />
            <ul className="list-disc list-inside mb-4">
              <li>
                <b>$200+</b> monthly printing costs
              </li>
              <li>
                <b>2 hrs+</b> updating prices manually
              </li>
              <li>
                <b>1 hr+</b> reprinting menus for changes
              </li>
              <li>
                <b>3 hrs+</b> dealing with customer complaints
              </li>
              <li>
                <b>5 hrs+</b> lost sales from outdated menus
              </li>
              <li>
                <b>2 hrs+</b> staff training on menu changes
              </li>
              <li>
                <b>4 hrs+</b> managing multiple menu versions
              </li>
              <li>
                <b>10+ hrs+</b> lost customers to digital competitors
              </li>
              <li>
                <b>∞ hrs+</b> stress and frustration...
              </li>
            </ul>
            <p className="text-lg mb-4">
              <b>27+ hours of headaches per month</b>
            </p>
            <p className="text-lg">
              <b>No way to compete with modern restaurants</b>
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
