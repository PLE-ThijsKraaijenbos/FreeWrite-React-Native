export type JourneyPhase = {
  id: string;
  title: string;
  order: number;
};

export type JournalContent = {
  id: string;
  assignment_type: 'journal';
  title_text: string;
};

export type LetterContent = {
  id: string;
  assignment_type: 'letter';
  title_text: string;
};

export type ScaleContent = {
  id: string;
  assignment_type: 'scale';
  title_text: string;
  left_label: string;
  right_label: string;
};

export type BubblePopContent = {
  id: string;
  assignment_type: 'bubble_pop';
  title_text: string;
  thoughts: Array<{ text: string }>;
};

export type SpeechBubbleContent = {
  id: string;
  assignment_type: 'speech_bubble';
  title_text: string;
  bubbles: Array<{ text: string }>;
};

export type ChoiceStoryNode = {
  text: string;
  choices: Array<{ next: string; label: string }>;
  ending?: string;
};

export type ChoiceStoryContent = {
  id: string;
  assignment_type: 'choice_story';
  title_text: string;
  story_content: Record<string, ChoiceStoryNode>;
};

export type JourneyContent =
  | JournalContent
  | LetterContent
  | ScaleContent
  | BubblePopContent
  | SpeechBubbleContent
  | ChoiceStoryContent;

export type StepStatus = 'UNAVAILABLE' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export type JourneyStep = {
  id: string;
  title: string;
  description: string;
  banner_url: string;
  assignment_type: JourneyContent['assignment_type'];
  is_core: boolean;
  order: number;
  phase: JourneyPhase;
  content: JourneyContent | null;
};

export type JourneyStepProgress = {
  id: string;
  status: StepStatus;
  bookmarked: boolean;
  started_at: string | null;
  completed_at: string | null;
  response_data: unknown | null;
  step: JourneyStep;
};

export type Journey = {
  id: string;
  step_progresses: JourneyStepProgress[];
};
