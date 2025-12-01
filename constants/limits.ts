export interface LimitsDef {
    maxProjectsCount: number
}

export type AccountPlan = "free" | "pro";

export const LIMITS: (accountPlan: AccountPlan) => LimitsDef = (accountPlan: AccountPlan): LimitsDef => (
    accountPlan === "free" ? ({maxProjectsCount: 3}) : ({maxProjectsCount: 10})
)