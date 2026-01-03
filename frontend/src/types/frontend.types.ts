export class SurveyTableData{
    name:string;
    questions:number;
    answerIds:string[]|null|undefined;
}


export class AnswerIdsResponse{
    answerIds:string[]
}

export enum MaslowCategory{
    Physiological="Physiological",
    Safety="Safety",
    Belongingness="Belongingness",
    Esteem="Esteem",
    SelfActualization="SelfActualization",
}

export enum HerzbergCategory{
    Hygiene="Hygiene",
    Motivation="Motivation",
}

export enum McclellandCategory{
    Acheivement="Acheivement",
    Afilliation="Afilliation",
    Authority="Authority",
}


export enum ClassificationRank{
    good,
    okay,
    bad
}

export type TableByCategoryData = {
    category:McclellandCategory|MaslowCategory|HerzbergCategory;
    nQuestions:number;
    rank:ClassificationRank;
    justification:string
}

export enum QuestionType{
    checkbox="checkboxes",
    dropdown="dropdown",
    text="text",
    radio="radiogroup"
}

export type TableByQuestionData = {
    question:string;
    questionType:QuestionType;
    category:McclellandCategory[]|MaslowCategory[]|HerzbergCategory[];
    page:number;
}



export type SuggestionData = {
    question:string;
    category:McclellandCategory|MaslowCategory|HerzbergCategory;
    questionType:QuestionType;
}

export let rainbow:string[] = [
    "bg-red-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-cyan-500",
    "bg-blue-500",
]


export let rainbowText:string[] = [
    "text-red-800",
    "text-orange-800",
    "text-green-800",
    "text-cyan-800",
    "text-blue-800",
]

export enum MotivationTheory{
    Herzberg = "herzberg",
    Mcclelland= "mcclelland",
    Maslow="maslow"
}

export class Classification{
    question:string;
    classification:MaslowCategory[]|HerzbergCategory[]|McclellandCategory[]
    questionType:QuestionType;
    page:number;
}


export class ReportEntry{
    category:MaslowCategory|HerzbergCategory|McclellandCategory
    count:number;
    score:number
    rank:ClassificationRank
    justification:string
}


export class SuggestionQuestion{
    question:string;
    questionType:QuestionType
}

export class SuggestionQuestionWithCategory extends SuggestionQuestion{
    category:MaslowCategory|HerzbergCategory|McclellandCategory;
}

export class SuggestionResponse{
    category:MaslowCategory|McclellandCategory|HerzbergCategory;
    suggestedQuestions:SuggestionQuestion[]

}

export class ClassificationResponse{
    classifications:Classification[];
    report:ReportEntry[];
    suggestions:SuggestionResponse[];
    index:string;
}


