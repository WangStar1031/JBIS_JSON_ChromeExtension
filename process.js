
	console.clear();

	var races = [];
	var tracks = [];
	var track_pos = 0;
	var race_pos = 0;
	var arr_horses = [];
	var step_name = "init";
	var str_pos = 0;
	var str_date = "3/24";
	var prevData = false;

	str_date = prompt("Please enter race date", "3/23");

	function send_msg(data) {
		if(step_name == "init"){			
			data = data.split('<?xml version="1.0" encoding="shift_jis"?>').join('');
			data = data.split('elements').join('div');
			data = data.split('oneday').join('p');
			data = data.split('place').join('span');

			hrefs = jQuery(data).find("p");
			hrefs.each(function(){
				if(jQuery(this).attr("date") == str_date){
					for(i=0; i<jQuery(this).children("span").length; i++)
						tracks[tracks.length] = jQuery(this).children("span").eq(i).attr("link");
				}
			});

			get_track_content();

		} else if(step_name == "track"){
			hrefs = jQuery(data).find("#str-main td a");
			hrefs.each(function(){
				if( jQuery(this).attr("href").indexOf("/race/") != -1)
					races[races.length] = jQuery(this).attr("href");
				if( jQuery(this).attr("href").indexOf("/result/") != -1)
					prevData = true;
			});
			track_pos++;
			get_track_content();

		} else if(step_name == "start"){

			hrefs = jQuery(data).find(".tbl-data-04 tr");
			hrefs.each(function(){
				if(jQuery(this).find("td").length > 6){
					if( prevData == false){
						arr_horses[arr_horses.length] = {
							"race": races[race_pos],
							"href": jQuery(this).find("td").eq(1).find("a:first").attr("href"),
							"jpn": jQuery(this).find("td").eq(1).find("a:first").text().replace("(JPN)", ""),
							"eng": "",
							"number": jQuery(this).find("td").eq(0).text(),
							"jockey": jQuery(this).find("td").eq(3).find("a:first").text(),
							"trainer": jQuery(this).find("td").eq(5).find("a:first").text(),
						};
					} else{
						arr_horses[arr_horses.length] = {
							"race": races[race_pos],
							"href": jQuery(this).find("td").eq(2).find("a:first").attr("href"),
							"jpn": jQuery(this).find("td").eq(2).find("a:first em").text(),
							"eng": "",
							"number": jQuery(this).find("td").eq(1).text(),
							"jockey": jQuery(this).find("td").eq(4).find("a:first").text(),
							"trainer": jQuery(this).find("td").eq(12).find("a:first").text(),
						};
					}
				}
			});
			
			race_pos++;
			get_race_content();
		} else if(step_name == "grab_name"){
			eng_name = jQuery(data).find(".hdg-l1-02-container .sup p span:first").text().replace("(JPN)", "").replace("(USA)", "");
			arr_horses[str_pos].eng = eng_name;

			str_pos++;
			grab_horse_info();
		}
	}

	function grab_horse_info() {
		if(str_pos >= arr_horses.length) {
			var send_data = JSON.stringify(arr_horses);

			jQuery.post("http://193.168.0.70/JTS/library/trans_api.php", {"case": 8, "data": send_data, "date": str_date}, function(data){
				alert("Finished!");
			});
		} else {
			step_name = "grab_name";
			get_url_content("http://www.jbis.or.jp"+arr_horses[str_pos].href);
		}
	}

	function get_race_content() {
		if(race_pos >= races.length) grab_horse_info();
		else {
			step_name = "start";
			get_url_content("http://www.jbis.or.jp" + races[race_pos]);
		}
	}

	function get_url_content(str_url) {
		jQuery.ajaxSetup({
			'beforeSend': function( xhr ) {
				xhr.overrideMimeType('text/html; charset=Shift_JIS');
			},
			'error': function(xhr){
		        console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
		        get_track_content();
		    },
		});

		setTimeout(function(){
			jQuery.get(str_url, function(data){
			    send_msg(data);
			});
		}, 100);
	}

	function get_track_content() {
		if(track_pos >= tracks.length) get_race_content();
		else {
			step_name = "track";
			get_url_content("http://www.jbis.or.jp" + tracks[track_pos]);
		}		
	}
	
	function get_start() {
		get_url_content("http://www.jbis.or.jp/shared/media/xml/calendar.xml");
	}

	get_start();