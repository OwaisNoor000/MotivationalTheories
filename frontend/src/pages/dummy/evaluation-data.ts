import { MaslowCategory, QuestionType, type SuggestionData, type TableByCategoryData, type TableByQuestionData } from "../../types/frontend.types";

export const t1: TableByCategoryData[] = [
  {
    category: MaslowCategory.Physiological,
    nQuestions: 3,
    rank: 18,
    justification: "Respondent reports stable income and manageable workload, indicating core needs are largely satisfied"
  },
  {
    category: MaslowCategory.Safety,
    nQuestions: 6,
    rank: 14,
    justification: "Moderate concern about long-term job stability and organizational changes lowers perceived security."
  },
  {
    category: MaslowCategory.Belongingness,
    nQuestions: 12,
    rank: 20,
    justification: "Strong peer relationships and frequent collaboration contribute to a high sense of belonging."
  },
  {
    category: MaslowCategory.Esteem,
    nQuestions: 1,
    rank: 13,
    justification: "Limited feedback and infrequent recognition reduce feelings of professional appreciation."
  },
  {
    category: MaslowCategory.SelfActualization,
    nQuestions: 3,
    rank: 10,
    justification: "Lack of challenging tasks and personal development opportunities constrains self-fulfillment."
  }
];


export const t2: TableByQuestionData[] = [
  {
    question: "My income allows me to comfortably meet my basic needs.",
    questionType: QuestionType.radio,
    category: MaslowCategory.Physiological,
    page: 4
  },
  {
    question: "My work environment is physically comfortable and manageable.",
    questionType: QuestionType.checkbox,
    category: MaslowCategory.Physiological,
    page: 5
  },
  {
    question: "I feel secure in my job for the foreseeable future.",
    questionType: QuestionType.radio,
    category: MaslowCategory.Safety,
    page: 3
  },
  {
    question: "I understand my role and what is expected of me at work.",
    questionType: QuestionType.dropdown,
    category: MaslowCategory.Safety,
    page: 4
  },
  {
    question: "I feel like I belong within my team or organization.",
    questionType: QuestionType.radio,
    category: MaslowCategory.Belongingness,
    page: 5
  },
  {
    question: "I have positive relationships with my colleagues.",
    questionType: QuestionType.checkbox,
    category: MaslowCategory.Belongingness,
    page: 4
  },
  {
    question: "My work is recognized and appreciated by others.",
    questionType: QuestionType.radio,
    category: MaslowCategory.Esteem,
    page: 3
  },
  {
    question: "I am given responsibility and trust in my role.",
    questionType: QuestionType.dropdown,
    category: MaslowCategory.Esteem,
    page: 3
  },
  {
    question: "My job allows me to learn new skills and improve myself.",
    questionType: QuestionType.radio,
    category: MaslowCategory.SelfActualization,
    page: 2
  },
  {
    question: "I feel challenged and motivated by the work I do.",
    questionType: QuestionType.text,
    category: MaslowCategory.SelfActualization,
    page: 2
  }
];



export const t3: SuggestionData[] = [
  {
    question: "Are your basic financial and work-condition needs being fully met?",
    category: MaslowCategory.Physiological,
    subcategory: "Salary adequacy"
  },
  {
    question: "Do your working hours allow sufficient rest and personal time?",
    category: MaslowCategory.Physiological,
    subcategory: "Work–life balance"
  },
  {
    question: "Do you feel physically comfortable in your working environment?",
    category: MaslowCategory.Physiological,
    subcategory: "Workplace comfort"
  },
  {
    question: "Do you feel confident about the stability of your role?",
    category: MaslowCategory.Safety,
    subcategory: "Job security"
  },
  {
    question: "Are company policies and expectations clear to you?",
    category: MaslowCategory.Safety,
    subcategory: "Role clarity"
  },
  {
    question: "Do you feel protected and supported by management?",
    category: MaslowCategory.Safety,
    subcategory: "Management support"
  },
  {
    question: "Do you feel connected to your team?",
    category: MaslowCategory.Belongingness,
    subcategory: "Team belonging"
  },
  {
    question: "Do you have positive social interactions at work?",
    category: MaslowCategory.Belongingness,
    subcategory: "Workplace relationships"
  },
  {
    question: "Do you feel included in team decisions and discussions?",
    category: MaslowCategory.Belongingness,
    subcategory: "Social inclusion"
  },
  {
    question: "Do you feel your efforts are recognized?",
    category: MaslowCategory.Esteem,
    subcategory: "Recognition"
  },
  {
    question: "Do you feel respected for your skills and contributions?",
    category: MaslowCategory.Esteem,
    subcategory: "Professional respect"
  },
  {
    question: "Are you trusted with meaningful responsibility?",
    category: MaslowCategory.Esteem,
    subcategory: "Autonomy and responsibility"
  },
  {
    question: "Does your work allow you to develop new skills?",
    category: MaslowCategory.SelfActualization,
    subcategory: "Personal growth"
  },
  {
    question: "Are you able to express creativity in your role?",
    category: MaslowCategory.SelfActualization,
    subcategory: "Creativity"
  },
  {
    question: "Do you feel your work aligns with your personal goals and values?",
    category: MaslowCategory.SelfActualization,
    subcategory: "Purpose and meaning"
  }
];
