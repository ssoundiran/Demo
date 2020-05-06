public class CodeScan {
    public static void soqlinjection(){
        list<account> acclst = database.query('select id from account where name= \'Test\'');
    }
}