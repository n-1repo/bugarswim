import { Alert, AlertDescription } from "@/components/ui/alert";

export function QueryErrorAlert({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>Gagal memuat data: {error}</AlertDescription>
    </Alert>
  );
}
