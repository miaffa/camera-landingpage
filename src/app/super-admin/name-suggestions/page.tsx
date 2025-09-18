import { Metadata } from "next";
import { db } from "@/db";
import { nameSuggestions } from "@/db/schema/name-suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Name Suggestions - Super Admin",
  description: "View and manage name suggestions from users.",
};

export default async function NameSuggestionsPage() {
  const suggestions = await db
    .select()
    .from(nameSuggestions)
    .orderBy(nameSuggestions.createdAt);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Name Suggestions</h1>
        <p className="text-muted-foreground">
          View and manage name suggestions from users.
        </p>
      </div>

      <div className="grid gap-4">
        {suggestions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No name suggestions yet.</p>
            </CardContent>
          </Card>
        ) : (
          suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    &ldquo;{suggestion.nameSuggestion}&rdquo;
                  </CardTitle>
                  <Badge variant="secondary">
                    {new Date(suggestion.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription>
                  From: {suggestion.email}
                </CardDescription>
              </CardHeader>
              {suggestion.reason && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <strong>Reason:</strong> {suggestion.reason}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
