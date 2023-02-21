import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

//import CLEARANCE_FIELD from '@salesforce/schema/Opportunity.StageName';
//import CERTIFICATION_FIELD from '@salesforce/schema/Opportunity.Type';
//import getResources from '@salesforce/apex/ResourceSearchController.getResources';

export default class ResourceSearch extends LightningElement 
{
    //MAIN VAR=================================================================
    @api searchJSON;    
    rowOffset = 0;
    clearanceValue = "";

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

    //Clearance Value Changed===========================================
    clearanceChange(event)
    {
        this.clearanceValue = event.detail.value;
    }


    //#########################################################################
}