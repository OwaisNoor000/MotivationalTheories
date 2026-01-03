// components/SurveyCreator.tsx
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { useEffect, useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { SurveyCreatorComponent } from "survey-creator-react";
import Menu from "./ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";

// components/SurveyCreator.tsx
import {type ICreatorOptions } from "survey-creator-core";
import { Serializer } from "survey-core";
import { getSurveyDataById,  updateSurvey } from "../hooks/requests";
import { convertQuestionsToSurveyJson } from "./utils/utils";
import type { SuggestionQuestionWithCategory } from "../types/frontend.types";

const defaultCreatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  collapseOnDrag: true,
  questionTypes:["text","checkbox","radiogroup","dropdown","ratingscale"],
  showLogicTab:false,
  showJSONEditorTab:false,
};




export function SurveyEditorWidget(props: { surveyId:string,additionalQuestions?:SuggestionQuestionWithCategory[],  options?: ICreatorOptions }) {
  let [creator, setCreator] = useState<SurveyCreator>();

  if (!creator) {
    creator = new SurveyCreator(props.options || defaultCreatorOptions);
    creator.toolbox.forceCompact = false;
    
    // disable some options
    Serializer.getProperty("text", "readOnly").visible = false;
    Serializer.getProperty("text", "showTitle").visible = false;
    Serializer.getProperty("text", "autocomplete").visible = false;
    Serializer.getProperty("text", "dataList").visible = false;


    Serializer.getProperty("radiogroup", "readOnly").visible = false;
    Serializer.getProperty("radiogroup", "showTitle").visible = false;
    Serializer.getProperty("radiogroup", "showCommentArea").visible = false;


    Serializer.getProperty("checkbox", "readOnly").visible = false;
    Serializer.getProperty("checkbox", "showTitle").visible = false;
    Serializer.getProperty("checkbox", "showCommentArea").visible = false;


    Serializer.getProperty("dropdown", "readOnly").visible = false;
    Serializer.getProperty("dropdown", "showTitle").visible = false;
    Serializer.getProperty("dropdown", "showCommentArea").visible = false;
    Serializer.getProperty("dropdown", "autocomplete").visible = false;
    
    // Hide configurations in the property grid
    Serializer.removeProperty("navigation","Navigation");

    const whiteList = [ "survey", "page", "panel" ];
    const black_listed_tab_names = ["layout","mask","data","validation","logic","choices","choicesByUrl"]
    // for main menu
    const black_listed_mm_tab_names = ["layout","mask","data","validation","logic","choices","choicesByUrl","logo",
      "navigation","question","pages","logic","data","validation","showOnCompleted","timer"
    ]
    
    creator.onSurveyInstanceCreated.add((_, { area, obj, survey }) => {
        if (area === "property-grid") {
            if(obj!=undefined){
              
              // console.log("Property Grid Pages:");
              // survey.pages.forEach((page) => {
              //   console.log("Page name:", page.name);
              // });
              

              const surveyTabs = whiteList.indexOf(obj.getType()) === -1;
              if (surveyTabs) {
                  // A category is a panel if `propertyGridNavigationMode` is `"accordion"`; otherwise, it is a page.
                  for(let tab_name of black_listed_tab_names){
                    let tab = survey.getPageByName(tab_name) || survey.getPanelByName(tab_name);
                    if (tab) {
                        tab.delete();
                    }
                  }
              }else{
                // hide tabs for main menu

                  for(let tab_name of black_listed_mm_tab_names){
                    let tab = survey.getPageByName(tab_name) || survey.getPanelByName(tab_name);
                    if (tab) {
                        tab.delete();
                    }
                  }
              }
            
            }
        }
    });

    setCreator(creator);

  }


    // load survey questions
    useEffect(()=>{

      if(creator!=undefined){
        const fetchData = async()=>{
          let data = await getSurveyDataById(props.surveyId);
          if(props.additionalQuestions!=undefined){
            alert("The selected suggested questions have been added to the last page")
            data =  convertQuestionsToSurveyJson(props.additionalQuestions,data);
          }
          creator.text = data;
        }

        fetchData()
      }
    },[]);

    const modifySurvey = async ()=>{
      let saveData = creator?.JSON

      const fileName = props.surveyId; 
      if(fileName!==undefined && fileName!==null){
        const response = await updateSurvey(fileName,saveData);

        if(response.success){
          alert(`survey ${props.surveyId} updated!`);
        }
      }
    }

  return (
    <div >
      

      <Menu>
          <img src={MenuIcon} className="h-12 w-12 m-4  top-4 left-4"></img>
      </Menu>
      <button onClick={modifySurvey}  className=" absolute m-4 top-2 right-2 border-[#19B394] text-[#19B394] font-bold border-2 px-4 py-2
      hover:bg-[#19B394] hover:text-white hover:cursor-pointer">Save Survey Edits</button>
      <div className="absolute top-2 left-1/2  -translate-x-1/2 m-4 text-2xl">Survey : <b>{props.surveyId}</b></div>
      <div className="w-screen h-screen p-20 ">
          <SurveyCreatorComponent creator={creator} style={{border:"1px solid black",}} />
      </div>


    </div>
  );
}