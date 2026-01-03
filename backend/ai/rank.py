from baml_client.types import MaslowQuestionAnswerPair, HerzbergQuestionAnswerPair,McClellandQuestionAnswerPair
from baml_client.types import MaslowQuestionAnswerResponse,HerzbergQuestionAnswerResponse,McClellandQuestionAnswerResponse
from baml_client import b
from schemas import MotivationTheory
from typing import List,Union

def rankAnswers(theory:MotivationTheory,pairs:Union[List[MaslowQuestionAnswerPair],List[HerzbergQuestionAnswerPair],List[McClellandQuestionAnswerPair]])->Union[List[MaslowQuestionAnswerResponse],List[HerzbergQuestionAnswerResponse],List[McClellandQuestionAnswerResponse]]:
    rankings:Union[List[MaslowQuestionAnswerResponse],List[HerzbergQuestionAnswerResponse],List[McClellandQuestionAnswerResponse]] = []
    if theory == MotivationTheory.Maslow:
        rankings = b.ScoreMaslowAnswers(pairs)
    elif theory == MotivationTheory.Herzberg:
        rankings = b.ScoreHerzbergAnswers(pairs)
    elif theory ==MotivationTheory.Mcclelland:
        rankings = b.ScoreMclellandAnswers(pairs) 

    return rankings