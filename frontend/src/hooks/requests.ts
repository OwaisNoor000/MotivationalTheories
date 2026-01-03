
import type { AnswerIdsResponse, ClassificationResponse, MotivationTheory, SurveyTableData } from "../types/frontend.types";
import type { AnswerRankResponse, CriteriaReport, AnswerRankBatch, TableByAnswerData, BarData } from "../types/report.types";



export async function saveSurvey(fileName: string, surveyJson: any) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, surveyJson }),
    });

    const data = await response.json();

    if (!response.ok) {
      // handle non-200 HTTP codes
      console.error("Error saving survey:", data);
      return { success: false, ...data };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}


export async function updateSurvey(fileName: string, surveyJson: any) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/survey`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, surveyJson }),
    });

    const data = await response.json();

    if (!response.ok) {
      // handle non-200 HTTP codes
      console.error("Error saving survey:", data);
      return { success: false, ...data };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}


export async function getSurveys():Promise<SurveyTableData[]>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/survey/metadata`);

  
    if (!response.ok) {
      // handle non-200 HTTP codes
      const errData = await response.json();
      console.log(errData);
    }

    const surveyData:SurveyTableData[] = await response.json();

    return surveyData;

}

export async function getSurveyDataById(surveyId:string):Promise<any>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/survey/${surveyId}`);

  if(!response.ok){
    console.log("an error ocurred");
    const errorData = await response.json();
    console.log(errorData);
    throw Error("An error occured when fetching the survey " + errorData);
  }

    const surveyData = await response.json();
    return surveyData;
}

export async function getSurveyAnswerIds(surveyId:string):Promise<AnswerIdsResponse>{
  const response  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/survey/${surveyId}/answer`);
  if(!response.ok){
    const errorData = await response.json()
    throw Error(errorData);
  }

  const answerIds:AnswerIdsResponse = await response.json()

  return answerIds;
}


export async function saveSurveyAnswer(
  surveyId: string,
  answerId: string,
  answersJson: any
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/survey/${surveyId}/answer/${answerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answersJson,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error saving survey answer:", data);
      return { success: false, ...data };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}


export async function getSurveyAnswer(
  surveyId: string,
  answerId: string
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/survey/${surveyId}/answer/${answerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching survey answer:", data);
      return { success: false, ...data };
    }

    return data;
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}


export async function generateSurveyClassificationReport(
  surveyId: string,
  theory: string,
  overwrite: boolean
):Promise<ClassificationResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/survey/classification/report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId,
          theory,
          overwrite,
        }),
      }
    );

    const data:ClassificationResponse = await response.json();

    if (!response.ok) {
      console.error("Error generating classification report:", data);
      return { ...data };
    }

    return  data;
  } catch (err) {
    console.error("Network error:", err);
    return err;
  }
}

export async function getExistingEvaluations(surveyId:string,theory:MotivationTheory)
:Promise<ClassificationResponse[]>
{

  try{
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/survey/classification`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(
          {
            theory,
            surveyId
          }
        )
      }
    );

    const data:ClassificationResponse[] = await response.json();

    if(!response.ok){
      return {...data}
    }

    return data;


  }catch(err){
    console.log(err);
    return err;
  }

}



export async function getAnswerEvaluations(surveyId:string,answerId:string,theory:MotivationTheory)
:Promise<AnswerRankResponse>
{
  console.log("theory",theory)
  try{
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/survey/answer/rank`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(
          {
            theory,
            surveyId,
            answerId
          }
        )
      }
    );

    const data:AnswerRankResponse = await response.json();

    if(!response.ok){
      return {...data}
    }

    return data;


  }catch(err){
    console.log(err);
    return err;
  }

}



export async function getCriteriaReport()
:Promise<CriteriaReport[]>
{
  try{
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/eligibility`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        },
      }
    );

    const data:CriteriaReport[] = await response.json();

    if(!response.ok){
      return {...data}
    }

    return data;


  }catch(err){
    console.log(err);
    return err;
  }

}



export async function getCriteriaReportBatch(surveyId:string,answerId:string,theory:MotivationTheory)
:Promise<AnswerRankBatch[]>
{
  try{
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/report/eligibility/${surveyId}/${answerId}/${theory}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        },
      }
    );

    const data:AnswerRankBatch[] = await response.json();

    if(!response.ok){
      return {...data}
    }

    return data;


  }catch(err){
    console.log(err);
    return err;
  }

}



export async function getBarChartData(surveyId:string,theory:MotivationTheory)
:Promise<BarData[]>
{
  try{
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/report/chart-data/${surveyId}/${theory}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        },
      }
    );

    const data:BarData[] = await response.json();

    if(!response.ok){
      return {...data}
    }

    return data;


  }catch(err){
    console.log(err);
    return err;
  }

}