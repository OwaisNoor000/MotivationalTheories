from baml_client.types import MaslowCategory,McClellandCategory,HerzbergCategory
from pydantic import BaseModel
from typing import List,Union
from enum import Enum

class CreateSurveyRequest(BaseModel):
    fileName:str
    surveyJson:dict


class SurveyAnswersRequest(BaseModel):
    answersJson:dict


class MotivationTheory(Enum):
    Herzberg = "herzberg"
    Mcclelland= "mcclelland"
    Maslow="maslow"


class ClassificationRank(Enum):
    Good="good",
    Okay="okay",
    Bad="bad"

class SurveyClassificationRequest(BaseModel):
    theory:MotivationTheory
    surveyId:str
    overwrite:bool



class ReportEntry:
    def __init__(self):
        self.category:MaslowCategory|HerzbergCategory|McClellandCategory
        self.count:int
        self.score:float
        self.rank:ClassificationRank
        self.justification:str = ""
    
    def to_dict(self):
        return {
            "category":self.category,
            "count":self.count,
            "score":self.score,
            "rank":self.rank.value,
            "justification":self.justification
        }


class Report:
    def __init__(self):
        self.entries:List[ReportEntry]

    def to_dict(self):
        return [entry.to_dict() for entry in self.entries]



class ReportCheckRequest(BaseModel):
    theory:MotivationTheory
    surveyId:str
    
class AnswerRankRequest(BaseModel):
    surveyId:str
    theory:MotivationTheory
    answerId:str

class AnswerReportEntry:
    def __init__(self):
        self.category:MaslowCategory|HerzbergCategory|McClellandCategory
        self.score:float
    
    def to_dict(self):
        return {
            "category":self.category.value,
            "score":self.score
        }


class CriteriaReport:
    def __init__(self):
        self.surveyId:str
        self.answerIds:List[str]
        self.theories:List[MotivationTheory] = [MotivationTheory.Maslow,MotivationTheory.Herzberg,MotivationTheory.Mcclelland]
        self.eligible:List[bool]
        self.ineligibleMessages:List[EligibilityMessage]

    def to_dict(self):
        return {
            "surveyId":self.surveyId,
            "answerIds":self.answerIds,
            "theories":[t.value for t in self.theories],
            "eligible":self.eligible,
            "ineligibleMessages":[i.value for i in self.ineligibleMessages],
        }

class EligibilityMessage(Enum):
    NO_EVAL_GENERATED="No evaluations were generated for this theory. Please generate it first under the 'Evaluate Survey' menu option "
    CATEROGORY_ISSUE="This survey has too many questions that cannot be tied to a motivation theory. Ensure atleast 50% of survey questions do not belong to the Category='Other'"
    OKAY=""
    NO_ANSWERS="No answers are available for this survey. Please fill it out first under the 'Edit/Fill out Survey' Menu option"
