import { Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/shared/login-form";
import { CLUB_NAME } from "@/lib/config";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-sidebar p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-gold-foreground">
          <Waves className="h-7 w-7" aria-hidden="true" />
        </span>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{CLUB_NAME}</CardTitle>
            <CardDescription>Masuk ke akun klub renang Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
