"use client";

import { useActionState } from "react";
import { useActionToast } from "@/components/shared/use-action-toast";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionState } from "@/lib/actions/types";

type StateAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

export function ActionForm({
  action,
  fields,
  confirmMessage,
  successMessage,
  pendingLabel,
  children,
  ...buttonProps
}: ButtonProps & {
  action: StateAction;
  fields: Record<string, string>;
  confirmMessage?: string;
  successMessage: string;
  pendingLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  useActionToast(state, successMessage);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" disabled={pending} {...buttonProps}>
        {pending && pendingLabel ? pendingLabel : children}
      </Button>
    </form>
  );
}
