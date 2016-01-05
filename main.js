$(document).ready(function() {

	// set vertical height
	var height = $(window).height();
	var width = $(window).width();

	// settings
	var set = {
		weatherClass: 'none',
		energySphere: "<div class='energy-container'><div class='energy-sphere'></div></div>",
		sphereNumber: 15,
		sphereCounter: 1,
		spawnMargin: 100,
		shardOrigin: 0.15,

		// colours
		shardColors: {
			sunshine: {
				shard1:'#F34436',
				shard2:'#FF9600',
				shard3:'#FF7E7E',
				shard4:'#FFDF16',
				bg:'#FFDF4E',
				bg2:'#FFC24E'
			},
			rain: {
				shard1:'#8CF6FF',
				shard2:'#D2DCF9',
				shard3:'#90D6D6',
				shard4:'#54A5EC',
				bg:'#6AA8FF'
			},
			clouds: {
				shard1:'#CCDAFF',
				shard2:'#3DACD4',
				shard3:'#3B729E',
				shard4:'#88A9E2',
				bg:'#9AA4B3'
			}
		},

		// messages
		result: {
			sunshine: 'Skies are clear and the sun is shining in ',
			rain: 'Rain is falling in ',
			clouds: 'Clouds cover the sky in ',
			wind: 'The wind is blowing in ',
			errorMessage: 'The shard is struggling to connect, maybe try another city...'
		},
		success: {
			message: 'Hooray, the weather has returned, ',
			sunshine: 'the sun shines on Lineousus!',
			rain: 'the rain falls on Lineousus!',
			clouds: 'clouds cover the sky in Lineousus',
			wind: 'wind blows through the trees in Lineousus!',
			complaining: 'But then the people started complaining.....and the ', // + weatherClass +
			gone: ' went away.'
		},
		// changes result message second time round
		secondLoop: {
			message1: 'Again?!!',
			message2: 'Oh well, you could give them one more chance if you\'re feeling benevolent...'
		}
	}

	if (width < 981) {
		set.sphereNumber = 10;
		set.spawnMargin = 100;
	}


	// responsive design features -- scales heights and margins
	$(window).on('load resize', function() {
		var height = $(window).height();
		var width = $(window).width();
		if (width > 980 && height > 650) {
			$('#scene').css('margin-top', height/4-90);
		} else {
			$('#scene').css('margin-top', height/4-120);
		}
		$('#weather-shard-1').css('margin-top', height/2-150);
		$('#container').css('height', height-300);
		$('#weather-shard-3').css('top', height*set.shardOrigin);
	});


	// adds spheres invisibly
	for (var i=0; i<set.sphereNumber; i++) {
		$('#container').append(set.energySphere);
		var x = set.spawnMargin + Math.random()*width/1.5;
		var y = set.spawnMargin + Math.random()*height/2;
		var size = (Math.random()*30) + 15;
		TweenMax.set($('.energy-container:last-child'), {top: y, left: x});
		TweenMax.set($('.energy-container:last-child .energy-sphere'), {width: size, height: size, borderRadius: size/2});
	}

	// rain effect
	var raindrops = $('.raindrop');
	for (var i=0; i<raindrops.length; i++) {
		TweenMax.set(raindrops[i], {y: -(Math.random()*1500) + 900, opacity: 0});
	}
	var shower = TweenMax.to(raindrops, 0.5, {y: '+=1000', repeat: -1, ease: Power0.easeNone});


	// welcome sequence
	// hide initial weather shard
	$('#weather-shard-1').one('click', function() {
		TweenMax.to($(this), 0.2, {opacity: 0, display: 'none'});
		TweenMax.to(raindrops, 1, {opacity: 1, delay: 4.5, ease: Power0.easeNone});
		// TweenMax.to($('html'), 3, {backgroundColor: '#A3CDF5', delay: 4})
		// welcome animation
		// TweenMax.to($('html'), 8, {backgroundColor: '#A3CDF5', delay: 4})
		// welcome animation 
		var welcome = new TimelineLite({delay: 1.5});
		welcome.to($('#scene'), 4, {opacity: 1, ease: Power0.easeIn}, 'start')
		       .to($('.welcome'), 3, {opacity: 1}, 'start+=6')
		       .to($('#begin'), 1, {opacity: 1, display: 'inline-block'}, 'start+=8');
	});

	// story sequence
	(function story() {
		$('#begin').one('click', function() {
			var story = new TimelineLite();
			story.to($(this), 1, {opacity: 0, display: 'none'}, 'start')
			     .to($('.welcome'), 2, {opacity: 0, display: 'none'}, 'start')
			     .to($('#story'), 0.1, {display: 'block'})
			     .to($('#story #section-1'), 2, {opacity: 1, display: 'block', ease: Power0.easeIn}, 'one')
			     .to($('#next-1.next'), 2, {opacity: 1, display: 'block'}, 'one+=2');
		});
		var section = 2;
		var slideSpeed = 0.8;
		var totalSlides = 5;
		var id = '#story';
		$('#next-1').on('click', function() {
			if (section === totalSlides+1) {
				var instructions = new TimelineLite({delay: slideSpeed/2});
				instructions.to($('#next-1, #story'), slideSpeed/2, {opacity: 0, display: 'none'})
							.to($('#instructions'), 0.1, {display: 'block'})
							.to($('#weather-shard-2'), 1, {opacity: 1, display: 'block'})
							.to($('#instructions #section-1'), 1, {opacity: 1, display: 'block'})
							.to($('#next-2'), 1, {opacity: 1, display: 'block'});
			} else if (section === 3) {
				// TweenMax.to($('html'), 2.5, {backgroundColor: '#fff', delay: 1.5});
				TweenMax.to(raindrops, 2.5, {opacity: 0, display: 'none', delay: 1.5});
			}
			var previous = $(id + ' #section-' + (section-1));
			var next = $(id + ' #section-' + section);
			TweenMax.to(previous, slideSpeed, {opacity: 0, display: 'none'});
			TweenMax.to(next, slideSpeed, {opacity: 1, display: 'block', delay: slideSpeed});
			section ++;
		});

	}());

	(function instructions() {
		var section = 2;
		var slideSpeed = 0.8;
		var totalSlides = 3;
		var id = '#instructions';
		$('#next-2').on('click', function() {
			if (section === totalSlides+1) {
				var city = new TimelineLite({delay: slideSpeed/2});
				city.to($('#next-2, #instructions'), 1, {opacity: 0, display: 'none'})
					.to($('#choose-city'), 1, {opacity: 1, display: 'block'})
			}
			var previous = $(id + ' #section-' + (section-1));
			var next = $(id + ' #section-' + section);
			TweenMax.to(previous, slideSpeed, {opacity: 0, display: 'none'});
			TweenMax.to(next, slideSpeed, {opacity: 1, display: 'block', delay: slideSpeed});
			section ++;
		});
	}());


	// get weather data
	$('#find-weather').on('click', function() {
		$('#city-form').on('submit', function(e) {
			e.preventDefault();
			var city = $('#city').val();
			if (city) {
			//AJAX call to google weather maps
				$.ajax({
					url: 'http://api.openweathermap.org/data/2.5/weather?',
					type: 'GET',
					data: 'q=' + city + '&APPID=bf70ec09855f00481d68c070f24d634a',
					dataType: 'json',
					success: function(json) {
						var weather = json.weather[0].main;
						console.log(json.weather[0]);
						var rain = json.weather[0].description;
						var windSpeed = json.wind.speed;
						var city = json.name;

						set.weatherClass = $('#result').attr('class');
						$('#result').removeClass(set.weatherClass);
						// output messages depending on location
						if (weather === 'Clouds') {
							$('#result').text(set.result.clouds + city).addClass('clouds');
						}
						if (weather === 'Clear') {
							$('#result').text(set.result.sunshine + city).addClass('sunshine');
						}
						if (rain === 'moderate rain' && weather === 'Rain') {
							$('#result').text(set.result.rain + city).addClass('rain');
						} else if (weather === 'Rain') {
							// different message for light rain or heavy rain
							$('#result').text('A ' + rain + ' is falling in ' + city).addClass('rain');
						}
						if (windSpeed >= 11) {
							$('#result').text(set.result.wind + city).addClass('wind');
						}

						TweenMax.to($('#result'), 1, {opacity:1, display:'block'});
						TweenMax.to($('#connect'), 1, {opacity: 1, display:'block', delay:1});

					},
					error: function() {
						$('#result').text(set.result.errorMessage);
						TweenMax.to($('#result'), 1, {opacity:1, display:'block'});
					}
				});
			}
			$('#city-form')[0].reset();
		});
	});


	// set messages based on weather and add show energy spheres
	$('#connect').on('click', function() {
		// sets colour of energy spheres
		set.weatherClass = $('#result').attr('class');
		$('.energy-sphere').addClass(set.weatherClass);

		// sets messages based on the weather
		if (set.weatherClass === 'rain') {
			$('#success-message').text(set.success.message + set.success.rain);
		} else if (set.weatherClass === 'sunshine') {
			$('#success-message').text(set.success.message + set.success.sunshine);
		} else if (set.weatherClass === 'clouds') {
			$('#success-message').text(set.success.message + set.success.clouds);
		} else {
			$('#success-message').text(set.success.message + set.success.wind);
		}

		$('#complaining').text(set.success.complaining + set.weatherClass + set.success.gone);


		// hide last seciton
		TweenMax.to($('#choose-city, #result, #connect'), 1, {opacity: 0, display:'none'});
		TweenMax.to($('#gather-energy'), 1, {opacity: 1, display:'block', delay: 1});

		// make energy spheres visible
		TweenMax.staggerTo($('.energy-container'), 1, {opacity: 1, display: 'inline-block'}, 0.1);
	    TweenMax.staggerTo($('.energy-container'), 2, {y: -20,
											    repeat: -1,
											    yoyo: true,
												ease: Power1.easeInOut}, 0.1);
		TweenMax.to($('#weather-shard-3'), 1, {opacity: 1, display: 'block', delay: 2});
	});


	// collect energy and power up shard
	$('.energy-container').on('click', function() {
		// snap spheres to origin point
		var sphere = $(this);
		TweenMax.set(sphere, {'top': height*set.shardOrigin, 'left': '48%'});
		TweenMax.to(sphere, 0.2, {opacity: 0, display: 'none', delay: 0.2});

		// defines animations for each power level of shard (1-8)
		shardPower(set.weatherClass, set.shardColors, set.sphereCounter);

		function shardPower(weather, shardColors, sphereCounter) {
			set.sphereCounter++;

			if (set.sphereCounter > 8) {
				set.sphereCounter = 1;
				TweenMax.killAll();

				TweenMax.fromTo($('html'), 5,
					{backgroundColor: '#fff'},
					{backgroundColor: shardColors[weather].bg,
					 yoyo: true,
					 repeat: 1,
					 delay: 0.5,
					 ease: Power4.easeOut});

				// reduce animations for smaller screen sizes
				if (window.innerWidth > 980) {
					TweenMax.to($('.energy-container'), 1.5, {opacity: 0, y: -500, display:'none'});
					TweenMax.to($('#weather-shard-3'), 2, {opacity: 0, display:'none'});
				} else {
					TweenMax.to($('.energy-container'), 1.5, {opacity: 0, display:'none'});
					TweenMax.to($('#weather-shard-3'), 4, {opacity: 0, display:'none'});
				}

				var success = new TimelineLite();

				// end sequence
				success.to($('#gather-energy'), 1, {opacity: 0, display: 'none'})
				       .to($('#success, #success-message'), 1, {opacity: 1, display:'block'}, 'complain')
				       .to($('#success-message'), 1, {opacity: 0, display: 'none', delay: 6})
				       .to($('#complaining'), 1, {opacity: 1, display:'block'})
				       .to($('#whoops'), 1, {opacity: 1, display: 'block', delay: 1})
				       .to($('#whoops, #complaining'), 1, {opacity: 0, display: 'none', delay: 2})
				       .to($('#maybe'), 1, {opacity: 1, display: 'block'})
				       .to($('#maybe'), 1, {opacity: 0, display: 'none', delay: 2, onComplete: resetState})
				       .to($('#choose-city'), 1, {opacity: 1, display: 'block'});

				// resets colours and positions of weather elements
				function resetState() {
					var container = $('.energy-container');
					TweenMax.set(container, {clearProps: 'all'});
					container.each(function() {
						var x = set.spawnMargin + Math.random()*width/1.5;
						var y = set.spawnMargin + Math.random()*height/2;
						TweenMax.set($(this), {top: y, left: x});
					});
					$('.energy-sphere, #result').removeClass(weather);

					for (var i=0; i<4; i++) {
						TweenMax.set($('#weather-shard-3 #shard-' + (i+1)), {clearProps: 'fill'});
					}
					$('#whoops').text(set.secondLoop.message1);
					$('#maybe').text(set.secondLoop.message2);
				}

			}
			else if (set.sphereCounter > 7) {
				for (var i=0; i<4; i++) {

					TweenMax.fromTo($('#weather-shard-3 #shard-' + (i+1)), 0.2,
						{fill: shardColors[weather]['shard' + (i+1)]},
						{fill: shardColors[weather]['shard' + (4-i)],
						 repeat: -1,
						 yoyo: true,
						 ease: Power1.easeInOut});
				}
			}
			else if (set.sphereCounter > 6) {
				for (var i=0; i<4; i++) {

					TweenMax.fromTo($('#weather-shard-3 #shard-' + (i+1)), 0.3,
						{fill: shardColors[weather]['shard' + (i+1)]},
						{fill: shardColors[weather]['shard' + (4-i)],
						 repeat: -1,
						 yoyo: true,
						 ease: Power1.easeInOut});
				}
			}
			else if (set.sphereCounter > 5) {
				for (var i=0; i<4; i++) {

					TweenMax.fromTo($('#weather-shard-3 #shard-' + (i+1)), 0.5,
						{fill: shardColors[weather]['shard' + (i+1)]},
						{fill: shardColors[weather]['shard' + (4-i)],
						 repeat: -1,
						 yoyo: true,
						 ease: Power1.easeInOut});
				}
			}
			else if (set.sphereCounter > 4) {
				// console.log(shardColors[weather].shard1, set.sphereCounter);
				TweenMax.to($('#weather-shard-3 #shard-1'), 2, {fill: shardColors[weather].shard1});
			}
			else if (set.sphereCounter > 3) {
				// console.log(shardColors[weather].shard2, set.sphereCounter);
				TweenMax.to($('#weather-shard-3 #shard-2'), 2, {fill: shardColors[weather].shard2});
			}
			else if (set.sphereCounter > 2) {
				// console.log(shardColors[weather].shard3, set.sphereCounter);
				TweenMax.to($('#weather-shard-3 #shard-3'), 2, {fill: shardColors[weather].shard3});
			}
			else if (set.sphereCounter > 1) {
				// console.log(shardColors[weather].shard4, set.sphereCounter);
				TweenMax.to($('#weather-shard-3 #shard-4'), 2, {fill: shardColors[weather].shard4});
			}
		}

	});
});
