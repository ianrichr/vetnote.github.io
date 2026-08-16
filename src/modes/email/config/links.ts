/**
 * Every external URL used by an email template, by id.
 *
 * Templates reference links by id rather than pasting URLs inline, for two
 * reasons. Product pages get relisted and documents move, so a dead link should
 * be corrected in one place even if several templates use it. And because
 * EmailLinkId is derived from these keys, a mistyped id is a compile error
 * rather than a broken link discovered by a client.
 */
export const EMAIL_LINKS = {
  chewyKidneyDietDry:
    'https://www.chewy.com/hills-prescription-diet-kd-kidney/dp/54761',
  chewyKidneyDietWet:
    'https://www.chewy.com/hills-prescription-diet-kd-kidney/dp/110400',
  vinChronicKidneyDisease:
    'https://veterinarypartner.vin.com/default.aspx?pid=19239&id=4951452',
  cornellChronicKidneyDisease:
    'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/chronic-kidney-disease',
} as const;

export type EmailLinkId = keyof typeof EMAIL_LINKS;

export const resolveLink = (id: EmailLinkId): string => EMAIL_LINKS[id];
