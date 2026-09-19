"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Alert variant="destructive">
        <AlertTitle>Terjadi kesalahan</AlertTitle>
        <AlertDescription>
          {error.message || "Halaman gagal dimuat. Silakan coba lagi."}
        </AlertDescription>
      </Alert>
      <Button onClick={reset} className="w-fit">
        Coba Lagi
      </Button>
    </div>
  );
}
