var set = require('./settings.js')
var $ = require('jquery')
var TweenMax = require('gsap')

$(document).ready(function () {
  // set vertical height
  var height = $(window).height()
  var width = $(window).width()

  if (width < 981) {
    set.sphereNumber = 10
    set.spawnMargin = 100
  }

  // adds spheres invisibly
  for (var i = 0; i < set.sphereNumber; i++) {
    $('#container').append(set.energySphere)
    var x = set.spawnMargin + Math.random() * width / 1.5
    var y = set.spawnMargin + Math.random() * height / 2
    var size = (Math.random() * 30) + 15
    TweenMax.set($('.energy-container:last-child'), {top: y, left: x})
    TweenMax.set($('.energy-container:last-child .energy-sphere'), { width: size, height: size, borderRadius: size / 2 })
  }

  // welcome sequence
  // hide initial weather shard
  $('#weather-shard-1').one('click', function () {
    TweenMax.to($(this), 0.2, {opacity: 0, display: 'none'})
    // welcome animation
    var welcome = new TimelineLite({delay: 1.5})
    welcome.to($('#scene'), 4, {opacity: 1, ease: Power0.easeIn, delay: 0}, 'start')
      .to($('.welcome'), 3, {opacity: 1}, 'start+=3')
      .to($('#begin'), 1, {opacity: 1, display: 'inline-block'}, 'start+=5')
  })

  // story sequence
  ;(function story () {
    $('#begin').one('click', function () {
      var story = new TimelineLite()
      story.to($(this), 1, {opacity: 0, display: 'none'}, 'start')
        .to($('.welcome'), 2, {opacity: 0, display: 'none'}, 'start')
        .to($('#story'), 0.1, {display: 'block'})
        .to($('#story #section-1'), 2, { opacity: 1, display: 'block', ease: Power0.easeIn }, 'one')
        .to($('#next-1.next'), 2, {opacity: 1, display: 'block'}, 'one+=2')
    })

    var section = 2
    var slideSpeed = 0.8
    var totalSlides = 5
    var id = '#story'
    $('#next-1').on('click', function () {
      if (section === totalSlides + 1) {
        var instructions = new TimelineLite({delay: slideSpeed / 2})
        instructions.to($('#next-1, #story'), slideSpeed / 2, {opacity: 0, display: 'none'})
          .to($('#instructions'), 0.1, {display: 'block'})
          .to($('#weather-shard-2'), 1, {opacity: 1, display: 'block'})
          .to($('#instructions #section-1'), 1, {opacity: 1, display: 'block'})
          .to($('#next-2'), 1, {opacity: 1, display: 'block'})
      }
      var previous = $(id + ' #section-' + (section - 1))
      var next = $(id + ' #section-' + section)
      TweenMax.to(previous, slideSpeed, {opacity: 0, display: 'none'})
      TweenMax.to(next, slideSpeed, {opacity: 1, display: 'block', delay: slideSpeed})
      section++
    })
  }())

  ;(function instructions () {
    var section = 2
    var slideSpeed = 0.8
    var totalSlides = 3
    var id = '#instructions'
    $('#next-2').on('click', function () {
      if (section === totalSlides + 1) {
        var city = new TimelineLite({delay: slideSpeed / 2})
        city.to($('#next-2, #instructions'), 1, {opacity: 0, display: 'none'})
          .to($('#choose-city'), 1, {opacity: 1, display: 'block'})
      }
      var previous = $(id + ' #section-' + (section - 1))
      var next = $(id + ' #section-' + section)
      TweenMax.to(previous, slideSpeed, {opacity: 0, display: 'none'})
      TweenMax.to(next, slideSpeed, {opacity: 1, display: 'block', delay: slideSpeed})
      section++
    })
  }())

  // get weather data
  $('#find-weather').on('click', function () {
    $('#city-form').on('submit', function (e) {
      e.preventDefault()
      var city = $('#city').val()
      if (city) {
        // AJAX call to google weather maps
        $.ajax({
          url: 'http://api.openweathermap.org/data/2.5/weather?',
          type: 'GET',
          data: 'q=' + city + '&APPID=bf70ec09855f00481d68c070f24d634a',
          dataType: 'json',
          success: function (json) {
            var weather = json.weather[0].main
            var rain = json.weather[0].description
            var windSpeed = json.wind.speed
            var city = json.name

            set.weatherClass = $('#result').attr('class')
            $('#result').removeClass(set.weatherClass)
            // output messages depending on location
            if (weather === 'Clouds') {
              $('#result').text(set.result.clouds + city).addClass('clouds')
            }
            if (weather === 'Clear') {
              $('#result').text(set.result.sunshine + city).addClass('sunshine')
            }
            if (rain === 'moderate rain' && weather === 'Rain') {
              $('#result').text(set.result.rain + city).addClass('rain')
            } else if (weather === 'Rain') {
              // different message for light rain or heavy rain
              $('#result').text('A ' + rain + ' is falling in ' + city).addClass('rain')
            }
            if (windSpeed >= 11) {
              $('#result').text(set.result.wind + city).addClass('wind')
            }

            TweenMax.to($('#result'), 1, {opacity: 1, display: 'block'})
            TweenMax.to($('#connect'), 1, {opacity: 1, display: 'block', delay: 1})
          },
          error: function () {
            $('#result').text(set.result.errorMessage)
            TweenMax.to($('#result'), 1, {opacity: 1, display: 'block'})
          }
        })
      }
      $('#city-form')[0].reset()
    })
  })

  // set messages based on weather and add show energy spheres
  $('#connect').on('click', function () {
    // sets colour of energy spheres
    set.weatherClass = $('#result').attr('class')
    $('.energy-sphere').addClass(set.weatherClass)

    // sets messages based on the weather
    if (set.weatherClass === 'rain') {
      $('#success-message').text(set.success.message + set.success.rain)
    } else if (set.weatherClass === 'sunshine') {
      $('#success-message').text(set.success.message + set.success.sunshine)
    } else if (set.weatherClass === 'clouds') {
      $('#success-message').text(set.success.message + set.success.clouds)
    } else {
      $('#success-message').text(set.success.message + set.success.wind)
    }

    $('#complaining').text(set.success.complaining + set.weatherClass + set.success.gone)

    // hide last seciton
    TweenMax.to($('#choose-city, #result, #connect'), 1, {opacity: 0, display: 'none'})
    TweenMax.to($('#gather-energy'), 1, {opacity: 1, display: 'block', delay: 1})

    // make energy spheres visible
    TweenMax.staggerTo($('.energy-container'), 1, {opacity: 1, display: 'inline-block'}, 0.1)
    TweenMax.staggerTo($('.energy-container'), 2, { y: -20,
      repeat: -1,
      yoyo: true,
			ease: Power1.easeInOut
		}, 0.1)
    TweenMax.to($('#weather-shard-3'), 1, {opacity: 1, display: 'block', delay: 2})
  })

  // collect energy and power up shard
  $('.energy-container').on('click', function () {
    // snap spheres to origin point
    var sphere = $(this)
    TweenMax.set(sphere, { 'top': '10vh', 'left': '48%', opacity: 1 })
    TweenMax.to(sphere, 0.2, { opacity: 0, display: 'none', delay: 0.2 })

    // defines animations for each power level of shard (1-8)
    shardPower(set.weatherClass, set.shardColors, set.sphereCounter)

		function alternateShardColors (speed, shardColors, weather) {
			for (var i = 0; i < 4; i++) {
				TweenMax.fromTo($('#weather-shard-3 #shard-' + (i + 1)), speed,
					{ fill: shardColors[weather]['shard' + (i + 1)]},
					{ fill: shardColors[weather]['shard' + (4 - i)],
						repeat: -1,
						yoyo: true,
					ease: Power1.easeInOut })
			}
		}

		function colorShard (i, shardColors, weather) {
			TweenMax.to($(`#weather-shard-3 #shard-${i}`), 2, {fill: shardColors[weather][`shard${i}`]})
		}

    function shardPower (weather, shardColors, sphereCounter) {
      set.sphereCounter++

      if (set.sphereCounter > 8) {
        set.sphereCounter = 1
        TweenMax.killAll()

        TweenMax.fromTo($('html'), 5,
          {backgroundColor: '#fff'},
          {backgroundColor: shardColors[weather].bg,
            yoyo: true,
            repeat: 1,
            delay: 0.5,
          ease: Power4.easeOut})

        // reduce animations for smaller screen sizes
        if (window.innerWidth > 980) {
          TweenMax.to($('.energy-container'), 1.5, {opacity: 0, y: -500, display: 'none'})
          TweenMax.to($('#weather-shard-3'), 2, {opacity: 0, display: 'none'})
        } else {
          TweenMax.to($('.energy-container'), 1.5, {opacity: 0, display: 'none'})
          TweenMax.to($('#weather-shard-3'), 4, {opacity: 0, display: 'none'})
        }

        var success = new TimelineLite()

        // end sequence
        success.to($('#gather-energy'), 1, {opacity: 0, display: 'none'})
          .to($('#success, #success-message'), 1, {opacity: 1, display: 'block'}, 'complain')
          .to($('#success-message'), 1, {opacity: 0, display: 'none', delay: 6})
          .to($('#complaining'), 1, {opacity: 1, display: 'block'})
          .to($('#whoops'), 1, {opacity: 1, display: 'block', delay: 1})
          .to($('#whoops, #complaining'), 1, {opacity: 0, display: 'none', delay: 2})
          .to($('#maybe'), 1, {opacity: 1, display: 'block'})
          .to($('#maybe'), 1, {opacity: 0, display: 'none', delay: 2, onComplete: resetState})
          .to($('#choose-city'), 1, {opacity: 1, display: 'block'})

        // resets colours and positions of weather elements
        function resetState () {
          var container = $('.energy-container')
          TweenMax.set(container, {clearProps: 'all'})
          container.each(function () {
            var x = set.spawnMargin + Math.random() * width / 1.5
            var y = set.spawnMargin + Math.random() * height / 2
            TweenMax.set($(this), {top: y, left: x})
          })
          $('.energy-sphere, #result').removeClass(weather)

          for (var i = 0; i < 4; i++) {
            TweenMax.set($('#weather-shard-3 #shard-' + (i + 1)), {clearProps: 'fill'})
          }
          $('#whoops').text(set.secondLoop.message1)
          $('#maybe').text(set.secondLoop.message2)
        }
      }
      else if (set.sphereCounter > 7) alternateShardColors(0.2, shardColors, weather)
      else if (set.sphereCounter > 6) alternateShardColors(0.3, shardColors, weather)
      else if (set.sphereCounter > 5) alternateShardColors(0.5, shardColors, weather)
      else if (set.sphereCounter > 4) colorShard(1, shardColors, weather)
      else if (set.sphereCounter > 3) colorShard(2, shardColors, weather)
      else if (set.sphereCounter > 2) colorShard(3, shardColors, weather)
      else if (set.sphereCounter > 1) colorShard(4, shardColors, weather)
    }
  })
})
