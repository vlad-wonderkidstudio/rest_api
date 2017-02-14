

module( "Login" );

/*
curl --include \
     --request POST \
     --header "Content-Type: application/json" \
     --data-binary '{ "username" : "system@inventoryoptix.com", "password": "system" }'  http://127.0.0.1:3000/login
*/
QUnit.test( "Login", function() {
    ok( 0 == "0", "Passed!" );
    ok( 0 == "1", "Passed!" );
});

QUnit.test( "chech one", function() {
    ok( 1 == "1", "Passed!" );
});


module( "UserAccount" );
QUnit.test( "chech zero", function() {
    ok( 0 == "0", "Passed!" );
});
QUnit.test( "chech one", function() {
    ok( 1 == "1", "Passed!" );
});