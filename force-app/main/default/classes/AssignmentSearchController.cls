public with sharing class AssignmentSearchController 
{    
    @AuraEnabled
    public static List<sObject> getAssignments(string searchJsonStr)
    {
        try 
        {            
            //Main Var---------------------------------------------------------            
            List<sObject> cAssignmentList;           

            //Parse Object-----------------------------------------------------
            AssignmentSearchJSON assignmentSearchObj = (AssignmentSearchJSON) JSON.deserialize(searchJsonStr, AssignmentSearchJSON.class);
            String clearTypeStr = assignmentSearchObj.clearanceStr;
            String certNameStr = assignmentSearchObj.certificationStr;
            String roleStr = assignmentSearchObj.roleStr;
            String startDateStr = assignmentSearchObj.startDateStr;
            Date startDate;
            String dateNote;

            //Check And Set Date Value---------------------------------------------
            try
            {
                if(startDateStr != '')
                {
                    startDate = Date.parse(startDateStr);
                    //dateNote = ' Date.parse ';
                }
                else
                {
                    startDate = Date.today().addYears(-1);
                    //dateNote = ' startDateStr null ';
                }
            }
            catch (Exception e) 
            {
                startDate = Date.today().addYears(-1);
                //dateNote = ' Date Error ' + e.getMessage();
            }

            //getAssignmentList@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //Boolean andRoleBool, string roleNameStr, Boolean andCertBool, 
            //string certNameStr, Boolean andClearBool, string clearTypeStr,
            //Date startDate
            //getAssignmentList@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            if((roleStr != '') && (certNameStr != '') && (clearTypeStr != ''))
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(true, roleStr, true, certNameStr, true, clearTypeStr, startDate);
            }
            else if((roleStr != '') && (certNameStr != '')) 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(true, roleStr, true, certNameStr, false, null, startDate);
            }
            else if((roleStr != '') && (clearTypeStr != '')) 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(true, roleStr, false, null, true, clearTypeStr, startDate);
            }
            else if((certNameStr != '') && (clearTypeStr != '')) 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(false, null, true, certNameStr, true, clearTypeStr, startDate); 
            }
            else if(roleStr != '') 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(true, roleStr, false, null, false, null, startDate);
            }
            else if(certNameStr != '') 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(false, null, true, certNameStr, false, null, startDate);
            }
            else if(clearTypeStr != '') 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(false, null, false, null, true, clearTypeStr, startDate);
            }
            else 
            {
                cAssignmentList = AssignmentSearchController.getAssignmentList(false, null, false, null, false, null, startDate); 
            }

            //Project_Assignment__c paObj = new Project_Assignment__c();
            //paObj.Notes__c = 'date = ' + startDate + ' ' + dateNote;

            //cAssignmentList.add(paObj);
            //Return List------------------------------------------------------
            return cAssignmentList;            
        } 
        catch (Exception e) 
        {
            System.debug('An Exception: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    } 

    //Get Assignment List======================================================
    public static List<sObject> getAssignmentList(  Boolean andRoleBool,
                                                    string roleNameStr,
                                                    Boolean andCertBool,
                                                    string certNameStr,
                                                    Boolean andClearBool,
                                                    string clearTypeStr,
                                                    Date startDate )
    {
        try 
        {
            //Return List------------------------------------------------------
            List<sObject> cAssignList; 

            //SELECT FROM WHERE Str--------------------------------------------
            String rAssignmentStr = 'SELECT Name, Id, Start_Date_on_Project__c, '+
            ' Project_CGS__r.Name, Project_Role__c, Project_Manager__c '+
            ' FROM Project_Assignment__c WHERE (Resource__r.Name = null) '+
            ' AND (Start_Date_on_Project__c > :startDate)';

            //Check For Role--------------------------------------------------
            if(andRoleBool == true)
            {
                rAssignmentStr = rAssignmentStr + ' AND (Project_Role__c = :roleNameStr) ';
            }

            //Check For Certification------------------------------------------
            if(andCertBool == true)
            {
                rAssignmentStr = rAssignmentStr + ' AND (Certifications__c includes (:certNameStr) ) ';
            }

            //Check For Clearance---------------------------------------------
            if(andClearBool == true)
            {
                rAssignmentStr = rAssignmentStr + ' AND (Clearance_Authority__c = :clearTypeStr) ';                     
            }
            //END OF CLEARANCE CHECK-----------------------------------------

            //QUERY STRING#####################################################
            cAssignList = Database.query(rAssignmentStr); 
            
            /*
            cAssignList = new List<sObject>();
            Project_Assignment__c paObj = new Project_Assignment__c();
            paObj.Notes__c = rAssignmentStr;
            cAssignList.add(paObj);*/

            return cAssignList; 
        } 
        catch (Exception e) 
        {
            System.debug('An Exception: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }



    //Assignment Search JSON CLASS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    public class AssignmentSearchJSON
    {        
        public String clearanceStr;
        public String certificationStr;
        public String roleStr;
        public String startDateStr;
    }

    //Search Opportunity Controller############################################ 
}