export interface Submission {
  id: string;
  flagSubmitted: string;
  isCorrect: boolean;
  userId: string;
  challengeId: string;
  createdAt: Date;
}
