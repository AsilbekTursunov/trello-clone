import { PlanProvider } from "@/context/PlanContext";
import { auth } from "@clerk/nextjs/server";



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { has } = await auth()
  const hasProPlan = has({ plan: 'pro_user' })
  const hasEnterprisePlan = has({ plan: 'enterprice_user' })


  return <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>{children}</PlanProvider>;
}