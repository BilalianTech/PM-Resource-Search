public with sharing class ResourceSearchController 
{
    @AuraEnabled
    public static List<sObject> getResources(string searchObjStr)
    {
        try 
        {
            /*List<sObject>*/
            //Main Var-------------------------------------------------------
            String selectStr;
            selectStr = 'SELECT Name, Email__c , Availability_Status__c, Available_for_Assignment__c ';


            String whereParts;

            //Parse Object---------------------------------------------------
            ResourceSearchJSON resourceSearchObj = (ResourceSearchJSON) JSON.deserialize(searchObjStr, ResourceSearchJSON.class);
            Boolean availableBool = resourceSearchObj.availableBool;
            String clearanceStr = resourceSearchObj.clearanceStr;
            String certificationStr = resourceSearchObj.certificationStr;
            String skillsStr = resourceSearchObj.skillsStr;            
            
            if(availableBool == true)
            {                
                //Availabile SECTION@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
                if((clearanceStr != '') && (certificationStr != '') && (skillsStr != ''))
                {
                    selectStr = 'Available clearanceStr certificationStr skills';



                }
                else if((clearanceStr != '') && (skillsStr != ''))
                {
                    selectStr = 'Available clearanceStr skills';
                }
                else if((certificationStr != '') && (skillsStr != ''))
                {
                    selectStr = 'Available certificationStr skills';
                }
                else if((clearanceStr != '') && (certificationStr != ''))
                {
                    selectStr = 'Available clearanceStr certificationStr';
                }
                else if(skillsStr != '')
                {
                    //Available skillsStr
                    selectStr = selectStr + ',( SELECT Name,'+
                    ' Skilled_Individual__c, Concentration__c FROM My_Skills__r'+
                    ' WHERE Concentration__c = :skillsStr)'+ 
                    ' FROM Work_Info__c WHERE Available_for_Assignment__c = true'+
                    ' And ID IN( SELECT Skilled_Individual__c FROM Employee_Skills__c' +
                    ' WHERE Concentration__c =  :skillsStr )';
                }
                else if(certificationStr != '')
                {
                    //'Available certificationStr';
                    selectStr = selectStr + ',( SELECT Name,'+
                    ' Skilled_Individual__c, Concentration__c FROM My_Skills__r'+
                    ' WHERE Concentration__c = :skillsStr)'+ 
                    ' FROM Work_Info__c WHERE Available_for_Assignment__c = true'+
                    ' And ID IN( SELECT Skilled_Individual__c FROM Employee_Skills__c' +
                    ' WHERE Concentration__c =  :skillsStr )';



                }
                else if(clearanceStr != '')
                {
                    selectStr = 'Available clearanceStr';
                }
                else 
                {
                    //Available Only;
                    selectStr = selectStr + ' FROM Work_Info__c WHERE Available_for_Assignment__c = true';
                }
            }
            else 
            {
                //ALL SECTION@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
                if((clearanceStr != '') && (certificationStr != '') && (skillsStr != ''))
                {
                    selectStr = 'ALL clearanceStr certificationStr skills';
                }
                else if((clearanceStr != '') && (skillsStr != ''))
                {
                    selectStr = 'ALL clearanceStr skills';
                }
                else if((certificationStr != '') && (skillsStr != ''))
                {
                    selectStr = 'ALL certificationStr skills';
                }
                else if((clearanceStr != '') && (certificationStr != ''))
                {
                    selectStr = 'ALL clearanceStr certificationStr';
                }
                else if(skillsStr != '')
                {
                    selectStr = 'ALL skillsStr';
                }
                else if(certificationStr != '')
                {
                    selectStr = 'ALL certificationStr';
                }
                else if(clearanceStr != '')
                {
                    selectStr = 'ALL clearanceStr';
                }
                else 
                {
                    selectStr = 'ALL';
                }
            }
            
            //Select Query-----------------------------------------------------
            //selectStr = 'SELECT Name, Email__c , Availability_Status__c, Available_for_Assignment__c ' + whereParts;

            List<sObject> cWorkInfoList = Database.query(selectStr);
            //return cWorkInfoList;
            return cWorkInfoList;
            
        } 
        catch (Exception e) 
        {
            System.debug('An Exception: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Opportunity Search JSON CLASS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    public class ResourceSearchJSON
    {
        public Boolean availableBool;
        public String clearanceStr;
        public String certificationStr;
        public String skillsStr;
    }
    //Search Opportunity Controller############################################ 

}