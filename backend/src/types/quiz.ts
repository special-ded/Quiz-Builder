export interface OptionData {
    text: string;
    isCorrect: boolean;
}

export interface QuestionData {
    text: string;
    type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
    options: OptionData[];
}

export interface CreateQuizRequest {
    title: string;
    questions: QuestionData[];
}