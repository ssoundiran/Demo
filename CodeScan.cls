public with sharing class CodeScan {
    public string name {get;set;}
    public static void soqlinjection(){
        list<account> acclst = database.query('select id from account where name= \''+name+'\'');
		for(account acc :acclst ){
		  update acc;
		}
    }
}