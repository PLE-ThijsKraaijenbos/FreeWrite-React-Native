import { OnboardingFormData } from '@/types/onboarding';

type RelevantFields = Pick<OnboardingFormData, 'frequency' | 'duration' | 'previousAttempts'>;

export function isProfessionalHelpRecommended({ frequency, duration, previousAttempts }: RelevantFields): boolean {
  const isDaily = frequency === 'DAILY';
  const isLongDuration = duration === '>2Y';
  const hasMultipleRelapses = previousAttempts === 'MULTIPLE_RELAPSED';

  return isDaily && (isLongDuration || hasMultipleRelapses);
}
