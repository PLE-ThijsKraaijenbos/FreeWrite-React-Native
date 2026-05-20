import { z } from 'zod';

export const onboardingSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  substance: z.enum(['COCAINE', 'CATHINONES', 'AMPHETAMINE', 'MDMA']),
  duration: z.enum(['<6M', '6-12M', '1-2Y', '>2Y', 'NOT_SURE']),
  goal: z.enum(['USE_LESS', 'QUIT', 'NOT_SURE']),
  trigger: z.enum(['AT_A_PARTY', 'WHEN_BORED', 'WHEN_STRESSED', 'WHEN_DOWN']),
  frequency: z.enum(['RARELY', 'MONTHLY', 'WEEKLY', 'DAILY']),
  previousAttempts: z.enum(['WENT_WELL', 'ONCE_HARD', 'MULTIPLE_RELAPSED', 'THOUGHT_ABOUT_IT', 'NEVER']),
  name: z.string().min(1),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export type SubstanceValue = OnboardingFormData['substance'];
export type DurationValue = OnboardingFormData['duration'];
export type GoalValue = OnboardingFormData['goal'];
export type TriggerValue = OnboardingFormData['trigger'];
export type FrequencyValue = OnboardingFormData['frequency'];
export type PreviousAttemptsValue = OnboardingFormData['previousAttempts'];
