import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CERTIFICATION_FIELD from '@salesforce/schema/Project_Assignment__c.Certifications__c';
//import QUALIFIED_ROLES_FIELD from '@salesforce/schema/Work_Info__c.Qualified_Role_s__c';
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
    
    certificationOptions;    
    skillsOptions;

    returnedResources;


    //qualifiedRolesOptions; qualifiedRolesValue="";
    //TABLE COLUMS=============================================================
    columns = [
        { label: 'NAME', fieldName: 'Name' },
        { label: 'EMAIL', fieldName: 'Email' , type: 'email'},
        { label: 'AVAILABLE', fieldName: 'Available' },  
        { label: 'CLEARANCE', fieldName: 'Clearance' }, 
        { label: 'CERTIFICATION', fieldName: 'Certification' },
        { label: 'SKILLS', fieldName: 'Skills' },    
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
    /*
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: QUALIFIED_ROLES_FIELD })    
    qualifiedRolePicklistValue({ error, data })
    {
        //Get data from Picklist----------------------------------------------
        if(data)
        {
            //Vars------------------------------------------------------------
            let qualifiedRoleHolder = [];
            const qualifiedRoleArr = data.values;

            //Add Null Search Value--------------------------------------------
            qualifiedRoleHolder.push({'label' : '--ANY--', 'value' : ''});

            //Get label and values---------------------------------------------
            for(let x of qualifiedRoleArr)
            {
                qualifiedRoleHolder.push({'label' : x.label, 'value' : x.value});                
            }
            
            this.qualifiedRolesOptions = qualifiedRoleHolder; 
            this.error = undefined;
        }
        else if(error)
        {
            this.error = error;
            this.qualifiedRolesOptions = undefined;
        }
    }
    */

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

    /*
    //Qualified Roles Value Changed===========================================
    qualifiedRolesChange(event)
    {
        this.qualifiedRolesValue = event.detail.value;
    }*/

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

        console.log('Clear End');       
    }

    //Send Search Object To Controller=========================================
    enterRS_Clicked(event)
    {
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

        //Call Controller============================================
        getResources({ searchObjStr: JSON.stringify(this.resourceSearchJSON)})
        .then( result => 
        {
            let curWorkInfoObjArr = [];
            let skillsGroup;

            for(let cResult of result)
            {
                //Get Skills---------------------------------------------------
                skillsGroup = "";
                if(cResult.My_Skills__r != null)
                {
                    for(let cSkill of cResult.My_Skills__r)
                    {
                        skillsGroup = skillsGroup + cSkill.Concentration__c + " ";
                    }
                }
                


                curWorkInfoObjArr.push({
                    "Name" : cResult.Name,
                    "Email" : cResult.Email__c,
                    "Available" : cResult.Available_for_Assignment__c,
                    "Skills" : skillsGroup,
                    "Certification" : null,
                    "Clearance": null
                });
            }

            this.returnedResources = curWorkInfoObjArr;
            this.error = undefined;

            console.log('Result: ' + JSON.stringify( result));

        })
        .catch((error)=>{
            this.error = error;
            console.log('Error: ' + this.error);
        });

    }

    //#########################################################################
}