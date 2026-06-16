import { Journey, JourneyStepProgress } from '@/types/journey';
import client from './client';

export async function getJourney(): Promise<Journey> {
  const res = await client.get<Journey>('/api/journey/');
  return res.data;
}

export async function startStep(progressId: string): Promise<JourneyStepProgress> {
  const res = await client.post<JourneyStepProgress>(
    `/api/journey/progress/${progressId}/start/`,
  );
  return res.data;
}

export async function bookmarkStep(progressId: string): Promise<JourneyStepProgress> {
  const res = await client.patch<JourneyStepProgress>(
    `/api/journey/progress/${progressId}/bookmark/`,
  );
  return res.data;
}

export async function completeStep(
  progressId: string,
  responseData: unknown,
): Promise<Journey> {
  const res = await client.post<Journey>(
    `/api/journey/progress/${progressId}/complete/`,
    { response_data: responseData },
  );
  return res.data;
}
