import { LightningElement, api, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CERTIFICATION_FIELD from '@salesforce/schema/Project_Assignment__c.Certifications__c';
import ROLES_FIELD from '@salesforce/schema/Project_Assignment__c.Project_Role__c';
import CLEARANCE_AUTHORITY_FIELD from '@salesforce/schema/Project_Assignment__c.Clearance_Authority__c';
import getAssignments from '@salesforce/apex/AssignmentSearchController.getAssignments';

export default class ProjectSearch extends LightningElement 
{
    //MAIN VAR=================================================================
    @api assignmentSearchJSON;    
    rowOffset = 0;
    clearanceValue = "";   
    certificationValue="";    
    roleValue="";
    startDateValue="";    
    
    certificationOptions;    
    roleOptions;
    clearanceOptions;

    returnedAssignments;
    isLoadingAssignments = false;
    recordCount = 0;

    pickDefaultRecId = '012000000000000AAA';

    //TABLE COLUMS=============================================================
    columns = [
        { label: 'ASSIGNMENT #', fieldName: 'AssignmentUrl', type: 'url', 
          typeAttributes: {label: {fieldName: 'AssignmentName'}, target: '_blank'}
        },
        { label: 'PROJECT NAME', fieldName: 'ProjectName' },
        { label: 'ROLE', fieldName: 'Role' },
        { label: 'START', fieldName: 'StartDate' },
        { label: 'MANAGER', fieldName: 'Manager' },
    ];

    //PICKLISTVALUES====================================================
    @wire(getPicklistValues, { recordTypeId: pickDefaultRecId, fieldApiName: CERTIFICATION_FIELD })    
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
    @wire(getPicklistValues, { recordTypeId: pickDefaultRecId, fieldApiName: ROLES_FIELD })    
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

    //PICKLISTVALUES====================================================
    @wire(getPicklistValues, { recordTypeId: pickDefaultRecId, fieldApiName: CLEARANCE_AUTHORITY_FIELD })    
    clearancePicklistValue({ error, data })
    {
        //Get data from Picklist----------------------------------------------
        if(data)
        {
            //Vars------------------------------------------------------------
            let clearHolder = [];
            const clearArr = data.values;

            //Add Null Search Value--------------------------------------------
            clearHolder.push({'label' : '--ANY--', 'value' : ''});

            //Get label and values---------------------------------------------
            for(let x of clearArr)
            {
                clearHolder.push({'label' : x.label, 'value' : x.value});                
            }
            
            this.clearanceOptions = clearHolder; 
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

    //Start Date Value Changed=================================================
    startDateChange(event)
    {
        //Set Correct Format 01/12/2023----------------------------------------
        let eDate = event.detail.value;
        let dateArr = eDate.split("-");
        let fDateStr = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
        console.log(fDateStr);

        this.startDateValue = fDateStr;
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
        this.returnedAssignments = [];
        this.recordCount = 0;

        console.log('Clear End');       
    }
 
    //Send Search Object To Controller================================================
    enterRS_Clicked(event)
    {
        //Set JSON Search Values-----------------------------------------------
        this.assignmentSearchJSON = 
        {
            clearanceStr: this.clearanceValue,   
            certificationStr: this.certificationValue,  
            roleStr: this.roleValue,
            startDateStr: this.startDateValue 
        };

        console.log(
            ' role = ' + this.assignmentSearchJSON.roleStr +
            ' certification = ' + this.assignmentSearchJSON.certificationStr +
            ' clearance = ' + this.assignmentSearchJSON.clearanceStr + 
            ' start Date =' + this.assignmentSearchJSON.startDateStr
        );

        console.log('JSON STRING  '+ JSON.stringify(this.assignmentSearchJSON) );

        //Show Spinner=========================================================
        this.isLoadingAssignments = true;

        //Call AssignmentSearchController======================================
        getAssignments({ searchJsonStr: JSON.stringify(this.assignmentSearchJSON) })
        .then(result => 
        {
            let curAssignmentsObjArr = [];
            console.log('Result: ' + JSON.stringify(result));
            
            //get each result--------------------------------------------------
            for(let cResult of result)
            {
                curAssignmentsObjArr.push(
                {
                    "AssignmentName" : cResult.Name,
                    "AssignmentUrl" : "/lightning/r/"+ cResult.Id + "/view",
                    "ProjectName" : cResult.Project_CGS__r.Name,
                    "Role" : cResult.Project_Role__c,
                    "Manager" : cResult.Project_Manager__c,
                    "StartDate" : cResult.Start_Date_on_Project__c
                });
            }

            this.returnedAssignments = curAssignmentsObjArr;
            this.error = undefined;
            this.recordCount = curAssignmentsObjArr.length;
            this.isLoadingAssignments = false;
        })
        .catch((error)=>
        {
            this.isLoadingAssignments = false;
            this.error = error;
            console.log('Error: ' + this.error);
        });

    }


    //#########################################################################
}