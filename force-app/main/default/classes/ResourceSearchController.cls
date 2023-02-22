public with sharing class ResourceSearchController 
{
    @AuraEnabled
    public static List<WorkInfo> getResources()
    {
        try 
        {
            //Main Var-------------------------------------------------------
            List<Opportunity> currentOpps = new List<Opportunity>();
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