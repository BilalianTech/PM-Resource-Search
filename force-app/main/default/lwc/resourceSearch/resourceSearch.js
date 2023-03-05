import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CERTIFICATION_FIELD from '@salesforce/schema/Project_Assignment__c.Certifications__c';
import SKILL_SET_FIELD from '@salesforce/schema/Project_Assignment__c.Skill_Set_Concentrations__c';
import getResources from '@salesforce/apex/ResourceSearchController.getResources';

export default class ResourceSearch extends LightningElement 
{
    //MAIN VAR=================================================================
    @api resourceSearchJSON;    
    rowOffset = 0;
    clearanceValue = "";   
    certificationValue="";    
    skillsValue="";
    availabilityValue = true;
    recordCount = 0;
    
    certificationOptions;    
    skillsOptions;

    returnedResources;
    isLoadingResources = false;
    
    //TABLE COLUMS=============================================================
    columns = [
        { label: 'NAME', fieldName: 'NameUrl', type: 'url', 
          typeAttributes: {label: {fieldName: 'Name'}, target: '_blank'}
        },
        { label: 'EMAIL', fieldName: 'Email' , type: 'email'},
        { label: 'AVAILABLE', fieldName: 'Available' },
        { label: 'CLEARANCE', fieldName: 'Clearance' },
    ];

    //Set Clearance============================================================
    clearanceOptions = [
        {'label' : '--ANY--', 'value' : ''},
        {'label' : 'CFPB', 'value' : 'CFPB'},
        {'label' : 'DHS', 'value' : 'DHS'},
        {'label' : 'DOC', 'value' : 'DOC'},
        {'label' : 'DOD', 'value' : 'DOD'},
        {'label' : 'DOE', 'value' : 'DOE'},
        {'label' : 'DOJ', 'value' : 'DOJ'},
        {'label' : 'FDA', 'value' : 'FDA'},
        {'label' : 'FDIC', 'value' : 'FDIC'},
        {'label' : 'GSA', 'value' : 'GSA'},
        {'label' : 'HHS', 'value' : 'HHS'},
        {'label' : 'IRS', 'value' : 'IRS'},
        {'label' : 'NARA', 'value' : 'NARA'},
        {'label' : 'SBA', 'value' : 'SBA'},
        {'label' : 'SEC', 'value' : 'SEC'},
        {'label' : 'USAGM', 'value' : 'USAGM'},
        {'label' : 'USDA', 'value' : 'USDA'},
        {'label' : 'VA', 'value' : 'VA'},
    ];

    //PICKLISTVALUES====================================================
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: CERTIFICATION_FIELD })    
    certificationPicklistValue({ error, data })
    {
        //Get data from Picklist----------------------------------------------
        if(data)
        {
            //Vars------------------------------------------------------------
            let certificationHolder = [];
            const certificationArr = data.values;

            //Add Null Search Value--------------------------------------------
            certificationHolder.push({'label' : '--ANY--', 'value' : ''});

            //Get label and values---------------------------------------------
            for(let x of certificationArr)
            {
                certificationHolder.push({'label' : x.label, 'value' : x.value});                
            }
            
            this.certificationOptions = certificationHolder; 
            this.error = undefined;
        }
        else if(error)
        {
            this.error = error;
            this.certificationOptions = undefined;
        }
    }
    
    //PICKLISTVALUES====================================================
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: SKILL_SET_FIELD })    
    skillsPicklistValue({ error, data })
    {
        //Get data from Picklist----------------------------------------------
        if(data)
        {
            //Vars------------------------------------------------------------
            let skillsHolder = [];
            const skillsArr = data.values;

            //Add Null Search Value--------------------------------------------
            skillsHolder.push({'label' : '--ANY--', 'value' : ''});

            //Get label and values---------------------------------------------
            for(let x of skillsArr)
            {
                skillsHolder.push({'label' : x.label, 'value' : x.value});                
            }
            
            this.skillsOptions = skillsHolder; 
            this.error = undefined;
        }
        else if(error)
        {
            this.error = error;
            this.skillsOptions = undefined;
        }
    }

    //Clearance Value Changed===========================================
    clearanceChange(event)
    {
        this.clearanceValue = event.detail.value;
    }

    //Certification Value Changed===========================================
    certificationChange(event)
    {
        this.certificationValue = event.detail.value;
    }

    //Skills Value Changed====================================================
    skillsChange(event)
    {
        this.skillsValue = event.detail.value;
    }
    
    //Qualified Roles Value Changed===========================================
    availabilityChange(event)
    {
        this.availabilityValue = event.target.checked;
        console.log("avail:" + this.availabilityValue);
    }
    
    //Clear Search=============================================================
    clearSearchClicked()
    {   
        console.log('Clear Start');
        this.template.querySelector("lightning-input[data-in-id=availableCKB]").checked = true;
        this.availabilityValue=true;
               
        this.template.querySelector("lightning-combobox[data-in-id=clearanceCMB]").value = "";
        this.template.querySelector("lightning-combobox[data-in-id=certificationCMB]").value = "";
        this.template.querySelector("lightning-combobox[data-in-id=skillsCMB]").value = "";

        this.clearanceValue = "";   
        this.certificationValue="";    
        this.skillsValue="";
        this.returnedResources = [];
        this.recordCount = 0;

        console.log('Clear End');       
    }

    //Send Search Object To Controller=========================================
    enterRS_Clicked(event)
    {
        //Set JSON Search Values-----------------------------------------------
        this.resourceSearchJSON = 
        {
            clearanceStr: this.clearanceValue,   
            certificationStr: this.certificationValue,    
            skillsStr: this.skillsValue,
            availableBool: this.availabilityValue
        };

        console.log('Search : clearance = ' + 
        this.resourceSearchJSON.clearanceStr +
        ' certification = ' + this.resourceSearchJSON.certificationStr +
        ' skills = ' + this.resourceSearchJSON.skillsStr + 
        ' availability = ' + this.resourceSearchJSON.availableBool        
        );

        console.log('JSON STRING  '+ JSON.stringify(this.resourceSearchJSON) );


        //Show Spinner=========================================================
        this.isLoadingResources = true;

        //Call Controller======================================================
        getResources({ searchObjStr: JSON.stringify(this.resourceSearchJSON)})
        .then( result => 
        {
            let curWorkInfoObjArr = [];
            let curClearanceTxt;

            //Check Clearance Value--------------------------------------------
            if(this.clearanceValue == '')
            {
                curClearanceTxt = 'GSA'
            }
            else
            {
                curClearanceTxt = this.clearanceValue;
            }

            //SetUp Clearance--------------------------------------------------
            const clearanceC = curClearanceTxt +"__c";

            //get each result--------------------------------------------------
            for(let cResult of result)
            {
                curWorkInfoObjArr.push({
                    "Name" : cResult.Name,
                    "NameUrl": "/lightning/r/"+ cResult.Id + "/view" ,
                    "Email" : cResult.Email__c,
                    "Available" : cResult.Available_for_Assignment__c, 
                    "Clearance" : curClearanceTxt + " : " + cResult[clearanceC]           
                });                
            }

            this.returnedResources = curWorkInfoObjArr;
            this.error = undefined;
            this.recordCount = curWorkInfoObjArr.length;
            console.log('Result: ' + JSON.stringify(result));
            this.isLoadingResources = false;
        })
        .catch((error)=>{
            this.isLoadingResources = false;
            this.error = error;
            console.log('Error: ' + this.error);
        });

    }

    //#########################################################################
}