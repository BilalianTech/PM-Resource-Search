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
            List<sObject> cWorkInfoList;
            List<sObject> cClearanceList;

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
                    //'Available clearanceStr certificationStr skills';
                    //getClearanceList(clearTypeStr,availableBool,andCertBool,certNameStr,andSkillsBool,skillsNameStr)
                    cWorkInfoList = ResourceSearchController.getClearanceList(clearanceStr, true, true, certificationStr, true, skillsStr);
                }
                else if((clearanceStr != '') && (skillsStr != ''))
                {
                    //'Available clearanceStr skills';
                    //getClearanceList(clearTypeStr,availableBool,andCertBool,certNameStr,andSkillsBool,skillsNameStr)
                    cWorkInfoList = ResourceSearchController.getClearanceList(clearanceStr, true, false, null, true, skillsStr);

                }
                else if((certificationStr != '') && (skillsStr != ''))
                {
                    //Available certificationStr skills';
                    selectStr = selectStr + ',( SELECT Name,'+
                    ' Skilled_Individual__c, Concentration__c FROM My_Skills__r'+
                    ' WHERE Concentration__c = :skillsStr) ,'+ 

                    '(SELECT Certified_Individual__c, '+
                    'Name, Certification_Name__c '+ 
                    'FROM My_Certifications__r ' +
                    'WHERE Certification_Name__c = :certificationStr ) '+ 

                    ' FROM Work_Info__c WHERE Available_for_Assignment__c = true'+
                    
                    ' And ID IN( SELECT Skilled_Individual__c FROM Employee_Skills__c' +
                    ' WHERE Concentration__c =  :skillsStr )'+

                    ' AND ID IN( SELECT Certified_Individual__c FROM CGS_Employee_Certification__c ' +
                    ' WHERE Certification_Name__c =  :certificationStr )';

                    cWorkInfoList = Database.query(selectStr);

                }
                else if((clearanceStr != '') && (certificationStr != ''))
                {
                    //'Available clearanceStr certificationStr';
                    //getClearanceList(clearTypeStr,availableBool,andCertBool,certNameStr,andSkillsBool,skillsNameStr)
                    cWorkInfoList = ResourceSearchController.getClearanceList(clearanceStr, true, true, certificationStr, false, null);

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

                    cWorkInfoList = Database.query(selectStr);
                    
                }
                else if(certificationStr != '')
                {
                    //'Available certificationStr';
                    selectStr = selectStr + ', (SELECT Certified_Individual__c, '+
                    'Name, Certification_Name__c '+ 
                    'FROM My_Certifications__r ' +
                    'WHERE Certification_Name__c = :certificationStr ) '+ 

                    'FROM Work_Info__c WHERE Available_for_Assignment__c = true '+

                    'AND ID IN( SELECT Certified_Individual__c FROM CGS_Employee_Certification__c ' +
                    'WHERE Certification_Name__c =  :certificationStr )';

                    cWorkInfoList = Database.query(selectStr);
                }
                else if(clearanceStr != '')
                {
                    //'Available clearanceStr';
                    //getClearanceList(clearTypeStr,availableBool,andCertBool,certNameStr,andSkillsBool,skillsNameStr)

                    cWorkInfoList = ResourceSearchController.getClearanceList(clearanceStr, true, false, null, false, null);

                }
                else 
                {
                    //Available Only;
                    selectStr = selectStr + ' FROM Work_Info__c WHERE Available_for_Assignment__c = true';
                    cWorkInfoList = Database.query(selectStr);
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

           
            //return cWorkInfoList;
            return cWorkInfoList;
            
        } 
        catch (Exception e) 
        {
            System.debug('An Exception: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<sObject> getClearanceList(string clearType, 
                                                 Boolean availableBool,
                                                 Boolean andCertBool,
                                                 string certName,
                                                 Boolean andSkills,
                                                 string skillsName
                                                 )
    {
        try 
        {
            List<sObject> cClearanceList; 
            string selectStr = 'SELECT Name, Id, Email__c, Available_for_Assignment__c,';
                       
           //Check For Sub Query-----------------------------------------------



            //Check For Clearance Type Set WHERE-------------------------------
            string noneValue = 'None'; 
            switch on clearType 
            {
                when 'CFPB' 
                {                    
                    selectStr = selectStr +' CFPB__c FROM Work_Info__c'+
                    ' WHERE CFPB__c != :noneValue';
                }
                when 'DHS' 
                {
                    selectStr =  selectStr +' DHS__c FROM Work_Info__c '+
                    ' WHERE DHS__c != :noneValue';
                }
                when 'DOC' 
                {
                    selectStr =  selectStr +' DOC__c FROM Work_Info__c '+
                    'WHERE DOC__c != :noneValue';
                }
                when 'DOD' 
                {
                    selectStr =  selectStr +' DOD__c FROM Work_Info__c '+
                    'WHERE DOD__c != :noneValue';
                }
                when 'DOE' 
                {
                    selectStr =  selectStr +' DOE__c FROM Work_Info__c '+
                    'WHERE DOE__c != :noneValue';
                }
                when 'DOJ' 
                {
                    selectStr =  selectStr +' DOJ__c FROM Work_Info__c '+
                    'WHERE DOJ__c != :noneValue';
                }
                when 'FDA' 
                {
                    selectStr =  selectStr +' FDA__c FROM Work_Info__c '+
                    'WHERE FDA__c != :noneValue';
                }
                when 'FDIC' 
                {
                    selectStr =  selectStr +' FDIC__c FROM Work_Info__c '+
                    'WHERE FDIC__c != :noneValue';
                }
                when 'GSA' 
                {
                    selectStr =  selectStr +' GSA__c FROM Work_Info__c '+
                    'WHERE GSA__c != :noneValue';
                }
                when 'HHS' 
                {
                    selectStr =  selectStr +' HHS__c FROM Work_Info__c '+
                    'WHERE HHS__c != :noneValue';
                }
                when 'IRS' 
                {
                    selectStr =  selectStr +' IRS__c FROM Work_Info__c '+
                    'WHERE IRS__c != :noneValue';
                }
                when 'NARA' 
                {
                    selectStr =  selectStr +' NARA__c FROM Work_Info__c '+
                    'WHERE NARA__c != :noneValue';
                }
                when 'SBA' 
                {
                    selectStr =  selectStr +' SBA__c FROM Work_Info__c '+
                    'WHERE SBA__c != :noneValue';
                }
                when 'SEC' 
                {
                    selectStr =  selectStr +' SEC__c FROM Work_Info__c '+
                    'WHERE SEC__c != :noneValue';
                }
                when 'USAGM' 
                {
                    selectStr =  selectStr +' USAGM__c FROM Work_Info__c '+
                    'WHERE USAGM__c != :noneValue';
                }
                when 'USDA' 
                {
                    selectStr =  selectStr +' USDA__c FROM Work_Info__c '+
                    'WHERE USDA__c != :noneValue';
                }
                when 'VA' 
                {
                    selectStr =  selectStr +' VA__c FROM Work_Info__c '+
                    'WHERE VA__c != :noneValue';                    
                }
                when else 
                {
                    selectStr =  selectStr + '  FROM Work_Info__c';
                }
                
            }
            
            //Check For availablity--------------------------------------------
            if(availableBool == true)
            {
                selectStr = selectStr + ' AND Available_for_Assignment__c = :availableBool';
            }

            //Check For Cert---------------------------------------------------
            if(andCertBool == true)
            {
                selectStr = selectStr + ' AND ID IN ( SELECT Certified_Individual__c '+
                'FROM CGS_Employee_Certification__c WHERE Certification_Name__c = :certName)';
            }

            //Check For Skills-------------------------------------------------
            if(andSkills == true)
            {
                selectStr = selectStr + ' AND ID IN ( SELECT Skilled_Individual__c '+
                'FROM Employee_Skills__c WHERE Concentration__c = :skillsName)';
            }

            cClearanceList = Database.query(selectStr);            
            return cClearanceList;
            
        } catch (Exception e) 
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