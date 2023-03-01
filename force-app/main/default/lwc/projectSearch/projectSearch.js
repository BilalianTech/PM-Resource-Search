import { LightningElement, api, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CERTIFICATION_FIELD from '@salesforce/schema/Project_Assignment__c.Certifications__c';
import ROLES_FIELD from '@salesforce/schema/Project_Assignment__c.Project_Role__c';
//import getProjectAssignments from '@salesforce/apex/ProjectSearchController.getProjectAssignments';


export default class ProjectSearch extends LightningElement 
{
    //MAIN VAR=================================================================
    @api projectSearchJSON;    
    rowOffset = 0;
    clearanceValue = "";   
    certificationValue="";    
    roleValue="";
    startDateValue="";
    openAssignmentValue = true;
    recordCount = 0;
    
    certificationOptions;    
    roleOptions;

    returnedProjects;
    isLoadingProjects = false;

    //TABLE COLUMS=============================================================
    columns = [
        { label: 'ASSIGNMENT #', fieldName: 'assignmentUrl', type: 'url', 
          typeAttributes: {label: {fieldName: 'AssignmentName'}, target: '_blank'}
        },
        { label: 'PROJECT NAME', fieldName: 'ProjectName' },
        { label: 'ROLE', fieldName: 'Role' },
        { label: 'START', fieldName: 'StartDate' },
        { label: 'MANAGER', fieldName: 'Manager' },
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
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: ROLES_FIELD })    
    rolePicklistValue({ error, data })
    {
        //Get data from Picklist----------------------------------------------
        if(data)
        {
            //Vars------------------------------------------------------------
            let rolesHolder = [];
            const rolesArr = data.values;

            //Add Null Search Value--------------------------------------------
            rolesHolder.push({'label' : '--ANY--', 'value' : ''});

            //Get label and values---------------------------------------------
            for(let x of rolesArr)
            {
                rolesHolder.push({'label' : x.label, 'value' : x.value});                
            }
            
            this.roleOptions = rolesHolder; 
            this.error = undefined;
        }
        else if(error)
        {
            this.error = error;
            this.roleOptions = undefined;
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

    //Certification Value Changed===========================================
    roleChange(event)
    {
        this.roleValue = event.detail.value;
    }

    //Start Date Value Changed===========================================
    startDateChange(event)
    {
        this.startDateValue = event.detail.value;
    }

    //Send Search Object To Controller================================================
    enterRS_Clicked(event)
    {

    }

     //Clear Search=============================================================
     clearSearchClicked()
     {   
         console.log('Clear Start');        
                
         this.template.querySelector("lightning-combobox[data-in-id=clearanceCMB]").value = "";
         this.template.querySelector("lightning-combobox[data-in-id=certificationCMB]").value = "";
         this.template.querySelector("lightning-combobox[data-in-id=roleCMB]").value = "";
         this.template.querySelector("lightning-input[data-in-id=startDatePKR]").value = "";
 

         this.clearanceValue = "";   
         this.certificationValue="";  
         this.roleValue = "";
         this.startDateValue="";
 
         console.log('Clear End');       
     }
 


    //#########################################################################
}