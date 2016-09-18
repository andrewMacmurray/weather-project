// settings
module.exports = {
  weatherClass: 'none',
  energySphere: "<div class='energy-container'><div class='energy-sphere'></div></div>",
  sphereNumber: 15,
  sphereCounter: 1,
  spawnMargin: 100,
  shardOrigin: 0.15,

  // colours
  shardColors: {
    sunshine: {
      shard1: '#F34436',
      shard2: '#FF9600',
      shard3: '#FF7E7E',
      shard4: '#FFDF16',
      bg: '#FFDF4E',
      bg2: '#FFC24E'
    },
    rain: {
      shard1: '#8CF6FF',
      shard2: '#D2DCF9',
      shard3: '#90D6D6',
      shard4: '#54A5EC',
      bg: '#6AA8FF'
    },
    clouds: {
      shard1: '#CCDAFF',
      shard2: '#3DACD4',
      shard3: '#3B729E',
      shard4: '#88A9E2',
      bg: '#9AA4B3'
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
    message2: "Oh well, you could give them one more chance if you're feeling benevolent..."
  }
}
