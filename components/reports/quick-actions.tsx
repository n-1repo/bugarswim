"use client";

import { AddMemberDialog } from "@/components/members/add-member-dialog";
import { AddClassDialog } from "@/components/schedule/add-class-dialog";
import { AddSubscriptionDialog } from "@/components/billing/add-subscription-dialog";
import { AddPromoDialog } from "@/components/promo/add-promo-dialog";
import { AddPayrollDialog } from "@/components/payroll/add-payroll-dialog";
import { AddAdjustmentDialog } from "@/components/cash-ledger/add-adjustment-dialog";
import type { Lookup } from "@/lib/data/lookups";

export function QuickActions({
  locations,
  coaches,
  classTypes,
  childOptions,
  packages,
}: {
  locations: Lookup[];
  coaches: Lookup[];
  classTypes: Lookup[];
  childOptions: Lookup[];
  packages: Lookup[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <AddMemberDialog locations={locations} />
      <AddClassDialog coaches={coaches} locations={locations} classTypes={classTypes} />
      <AddSubscriptionDialog childOptions={childOptions} packages={packages} />
      <AddPromoDialog />
      <AddPayrollDialog coaches={coaches} />
      <AddAdjustmentDialog />
    </div>
  );
}
