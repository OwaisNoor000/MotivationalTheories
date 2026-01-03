// components/SurveyCreator.tsx
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { SurveyCreatorComponent } from "survey-creator-react";
import Menu from "./ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";

// components/SurveyCreator.tsx
import {type ICreatorOptions } from "survey-creator-core";
import { Survey } from "survey-react-ui";
import { Serializer } from "survey-core";
import { saveSurvey } from "../hooks/requests";

const defaultCreatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  collapseOnDrag: true,
  questionTypes:["text","checkbox","radiogroup","dropdown","ratingscale"],
  showLogicTab:false,
  showJSONEditorTab:false
};




export function SurveyCreatorWidget(props: { json?: Object, options?: ICreatorOptions }) {
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
              
              survey.pages.forEach((page) => {
              });
              

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

    const persistSurvey = async ()=>{
      if(!creator){
        console.log(null)
      }
      let saveData = creator?.JSON

      const fileName = prompt("Give this survey a name",undefined);
      if(fileName!==undefined && fileName!==null){
        const response = await saveSurvey(fileName,saveData);

        if(response.success){
          alert("survey saved!");
        }
      }
    }

  return (
    <div >
      

      <Menu>
          <img src={MenuIcon} className="h-12 w-12 m-4  top-4 left-4"></img>
      </Menu>
      <div className="w-screen h-[800px] p-20">
          <SurveyCreatorComponent creator={creator} style={{border:"1px solid black",}}/>
      </div>
      <button onClick={persistSurvey}  className=" absolute m-4 top-2 right-2 border-[#19B394] text-[#19B394] font-bold border-2 px-4 py-2
      hover:bg-[#19B394] hover:text-white hover:cursor-pointer">Save Survey</button>


    </div>
  );
}