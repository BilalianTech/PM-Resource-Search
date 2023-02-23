public with sharing class ResourceSearchController 
{
    @AuraEnabled
    public static List<Work_Info__c> getResources()
    {
        try 
        {
            //Main Var-------------------------------------------------------
            List<Work_Info__c> currentWorkInfo = new List<Work_Info__c>();


            
            String selectStr;
            String whereParts;
            
        } 
        catch (Exception e) 
        {
            System.debug('An Exception: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }



}