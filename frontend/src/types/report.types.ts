import type { HerzbergCategory, MaslowCategory, McclellandCategory  } from "./frontend.types";
import { MotivationTheory } from "./frontend.types";

export class DiagramTableData{
    category:MaslowCategory|McclellandCategory|HerzbergCategory;
    score:number;
}

export class TableByAnswerData{
    question:string;
    answer:string;
    category:MaslowCategory[]|McclellandCategory[]|HerzbergCategory[];
    score:number;
}

export class AnswerScores{
    category:MaslowCategory[]|McclellandCategory[]|HerzbergCategory[];
    score:number
}

export class AnswerRankResponse{
    table:TableByAnswerData[];
    report:AnswerScores[];
    averageScore:number;
}



export class CriteriaReport{
    surveyId:string
    answerIds:string[]
    theories:MotivationTheory[] = [MotivationTheory.Maslow,MotivationTheory.Herzberg,MotivationTheory.Mcclelland]
    eligible:boolean[]
    ineligibleMessages:string[]
}

export class AnswerRankBatch{
    index:number
    report:AnswerRankResponse
}
        

// bar chart
export class BarCategoryData{
    category:MaslowCategory|HerzbergCategory|McclellandCategory;
    score:number;
}

export class BarData{
    label:string;
    averageScore:number;
    categoricalScores:BarCategoryData[];
}


    