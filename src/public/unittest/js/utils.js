var mainUrl = 'http://127.0.0.1:3000';
function clearDB(){
	$.ajax
	({
		type: "GET",
		url: mainUrl+"/unittest/cleardb",
		dataType: "json",
	}).done(function (data, textStatus, jqXHR){
		_clearDB (jqXHR, textStatus);

	}).fail(function (jqXHR, textStatus, errorThrown){
		_clearDB (jqXHR, textStatus);
	});
}

function clearRedis(){
	$.ajax
	({
		type: "GET",
		url: mainUrl+"/unittest/clearredis",
		dataType: "json",
	}).done(function (data, textStatus, jqXHR){
		alert('done');
		alert(data);
		alert(textStatus);
		alert(jqXHR);

	}).fail(function (jqXHR, textStatus, errorThrown){
		alert('fail');
		alert(jqXHR);
		alert(textStatus);
		alert(errorThrown);
	});
}

function clearDBandRedis(){
	$.ajax
	({
		type: "GET",
		url: mainUrl+"/unittest/cleardbandredis",
		dataType: "json",
	}).done(function (data, textStatus, jqXHR){
		alert('done');
		alert(data);
		alert(textStatus);
		alert(jqXHR);

	}).fail(function (jqXHR, textStatus, errorThrown){
		alert('fail');
		alert(data);
		alert(textStatus);
		alert(errorThrown);
	});
}

function _clearDB (jqXHR, textStatus, data, errorThrown){
	if (jqXHR.status==200){
		alert('Cleared successfuly');
	}
	else{
		alert('An error while trying to clear DB happened');
	}
}