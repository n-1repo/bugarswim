"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/types";

export function useActionToast(state: ActionState, defaultMessage: string, onSuccess?: () => void) {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? defaultMessage);
      onSuccessRef.current?.();
    }
  }, [state, defaultMessage]);
}
