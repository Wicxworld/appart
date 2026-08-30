export const membershipPlans = [
  {
    id: "essential",
    name: "Essential",
    price: 19,
    priceLabel: "$19",
    description: "A focused private search for one home.",
    featured: false,
    features: [
      "Personalized apartment requirements",
      "Active property search",
      "Match notifications",
    ],
  },
  {
    id: "priority",
    name: "Priority",
    price: 37,
    priceLabel: "$37",
    description: "Faster matching with dedicated handling.",
    featured: true,
    features: [
      "Everything in Essential",
      "Priority property matching",
      "Dedicated search handling",
      "Faster match review",
    ],
  },
  {
    id: "executive",
    name: "Executive",
    price: 75,
    priceLabel: "$75",
    description: "For complex or highly specific briefs.",
    featured: false,
    features: [
      "Everything in Priority",
      "High-priority search",
      "Dedicated client handling",
      "Advanced requirement matching",
    ],
  },
] as const;

export type PlanId = (typeof membershipPlans)[number]["id"];

export function isPlanId(value: string | null | undefined): value is PlanId {
  return membershipPlans.some((plan) => plan.id === value);
}

export function planLabel(id: string | null | undefined) {
  if (!id) return "Free / none";
  return membershipPlans.find((plan) => plan.id === id)?.name ?? "Free / none";
}
