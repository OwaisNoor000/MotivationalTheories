enum MaslowCategory {
  Physiological @description("Basic survival needs such as salary, rest, and physical working conditions")

  Safety @description("Job security, stable income, safe environment, and protection from uncertainty")

  Belongingness @description("Social connection, teamwork, relationships, and feeling included at work")

  Esteem @description("Recognition, respect, achievement, status, and confidence in one's abilities")

  SelfActualization @description("Personal growth, creativity, autonomy, and fulfilling one's potential")

  Other @description("Anything that does fit into the categories from the Maslow's theory of hierarchy of needs")
}

enum HerzbergCategory {
  Hygiene @description("Extrinsic factors that prevent dissatisfaction such as salary, company policies, job security, working conditions, and management quality")

  Motivator @description("Intrinsic factors that increase satisfaction such as achievement, recognition, meaningful work, responsibility, and personal growth")

  Other @description("Anything that does not clearly fit into Herzberg's hygiene or motivator factors")
}

enum McClellandCategory {
  Achievement @description("Desire to excel, accomplish challenging goals, and receive feedback on performance")

  Affiliation @description("Desire for friendly relationships, belonging, collaboration, and social harmony")

  Power @description("Desire to influence, lead, take responsibility, and have impact or control over others")

  Other @description("Anything that does not clearly fit into McClelland's core motivational needs")
}




class TextQuestion {
    question string
}

class ListQuestion{
    question string
    options string[]
}

class MaslowClassification {
    question string
    classification MaslowCategory[]
}


class HerzbergClassification {
    question string
    classification HerzbergCategory[]
}

class McClellandClassification {
    question string
    classification McClellandCategory[]
}

enum QuestionType{
    Text
    Checkbox
    RadioGroup
    Dropdown

}

class QuestionSuggestion{
    question string
    questionType QuestionType
}

class Suggestion{
    recommendation string
    suggestedQuestions QuestionSuggestion[]
    
}

class MaslowQuestionAnswerPair{
    question string
    answer string
    category MaslowCategory[]
    choices string[]
}


class HerzbergQuestionAnswerPair{
    question string
    answer string
    category HerzbergCategory[]
    choices string[]
}
class McClellandQuestionAnswerPair{
    question string
    answer string
    category McClellandCategory[]
    choices string[]
}

class MaslowQuestionAnswerResponse{
    question string
    score string
    answer string
    category MaslowCategory[]
}


class HerzbergQuestionAnswerResponse{
    question string
    score string
    answer string
    category HerzbergCategory[]
}


class McClellandQuestionAnswerResponse{
    question string
    score string
    answer string
    category McClellandCategory[]
}


function ClassifyMaslow(questions:(TextQuestion | ListQuestion)[]) -> MaslowClassification[] {
    client OpenRouter
    prompt #"
        Please classify questions from this motivational survey into the relevant category from the Maslow's hierarchy of needs. 
        One question may fall into more than one category
        {{ questions }}

        {{ ctx.output_format }}
    "#
}

function ClassifyHerzberg(questions:(TextQuestion | ListQuestion)[]) -> HerzbergClassification[] {
    client OpenRouter
    prompt #"
        Please classify questions from this motivational survey into the relevant category from the Herzberg two factor theory. 
        One question may fall into more than one category
        {{ questions }}

        {{ ctx.output_format }}
    "#
}


function ClassifyMcClelland(questions:(TextQuestion | ListQuestion)[]) -> McClellandClassification[] {
    client OpenRouter
    prompt #"
        Please classify questions from this motivational survey into the relevant category from the McClelland three needs theory. 
        One question may fall into more than one category
        {{ questions }}

        {{ ctx.output_format }}
    "#
}

function GetMaslowCategoricalJustification(questions:string[],category:(MaslowCategory))->Suggestion{
    client OpenRouter
    prompt #"
        These questions are from a motivational employee survey and follow the Maslow's hierarchy of needs framework:
        {{questions}}
        These questions have been extracted {{category}} category part of the survey.
        Please give me a one or two line recommendation on what other sub areas of the  {{category}} category I can make further questions on to get a better insights on the employee motivation.
        Your recommendation must be in second person
        
        Also, please suggest some questions I can add according to the missing sub areas you identified, along with their datatypes.
        The datatypes you suggest must be restricted to Text, RadioGroup,Checkbox and Dropdown

        {{ctx.output_format}}
    "#

}


function GetHerzbergCategoricalJustification(questions:string[],category:(HerzbergCategory))->Suggestion{
    client OpenRouter
    prompt #"
        These questions are from a motivational employee survey and follow the Herzberg two factor theory framework:
        {{questions}}
        These questions have been extracted {{category}} category part of the survey.
        Please give me a one or two line recommendation on what other sub areas of the  {{category}} category I can make further questions on to get a better insights on the employee motivation. 
        Your recommendation must be in second person

        {{ctx.output_format}}
    "#

}


function GetMcclellandCategoricalJustification(questions:string[],category:(McClellandCategory))->Suggestion{
    client OpenRouter
    prompt #"
        These questions are from a motivational employee survey and follow the McClelland three needs theory:
        {{questions}}
        These questions have been extracted {{category}} category part of the survey.
        Please give me a one or two line recommendation on what other sub areas of the  {{category}} category I can make further questions on to get a better insights on the employee motivation.
        Your recommendation must be in second person

        {{ctx.output_format}}
    "#

}

function ScoreMaslowAnswers(pairs:MaslowQuestionAnswerPair[])->MaslowQuestionAnswerResponse[]{
    client OpenRouter
    prompt #"
        These question and answer pairs are from a survey meant to guage employee motivation.
        Each question has been assigned a category from the maslow's hierarchy of needs.
        Some questions which may be in the form of a dropdown, checkbox or radio also have the choices provided.
        {{pairs}} 

        I want you to rank the answer from a discrete scale of 1 to 5.
        If no choices are provided, you can guage the score yourself.
        If a list of possible answers are provided in the choices, then be wary as it may not be as simple as each possible choice having a unique rank of 1 to 5
        Be wise.

        {{ctx.output_format}}

    "#
}


function ScoreHerzbergAnswers(pairs:HerzbergQuestionAnswerPair[])->HerzbergQuestionAnswerResponse[]{
    client OpenRouter
    prompt #"
        These question and answer pairs are from a survey meant to guage employee motivation.
        Each question has been assigned a category from the Herzberg two factor theory of motivation.
        Some questions which may be in the form of a dropdown, checkbox or radio also have the choices provided.
        {{pairs}} 

        I want you to rank the answer from a discrete scale of 1 to 5.
        If no choices are provided, you can guage the score yourself.
        If a list of possible answers are provided in the choices, then be wary as it may not be as simple as each possible choice having a unique rank of 1 to 5
        Be wise.

        {{ctx.output_format}}

    "#
}



function ScoreMclellandAnswers(pairs:McClellandQuestionAnswerPair[])->McClellandQuestionAnswerResponse[]{
    client OpenRouter
    prompt #"
        These question and answer pairs are from a survey meant to guage employee motivation.
        Each question has been assigned a category from the Mcclelland's three need theory of motivation.
        Some questions which may be in the form of a dropdown, checkbox or radio also have the choices provided.
        {{pairs}} 

        I want you to rank the answer from a discrete scale of 1 to 5.
        If no choices are provided, you can guage the score yourself.
        If a list of possible answers are provided in the choices, then be wary as it may not be as simple as each possible choice having a unique rank of 1 to 5
        Be wise.

        {{ctx.output_format}}

    "#
}

test TestClassify {
    functions [ClassifyMaslow]
    args {
        questions [
            {question:"What is your current role or job title?"},
            {
               question:"I feel my work is meaningful and contributes to a larger purpose." 
               options:["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]
            },

            {
                question:"What best describes your level of autonomy at work?",
                options:["I have full control over my work","i get micromanaged a lot"]
            }
            ]
    }
}


