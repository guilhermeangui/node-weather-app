const chalk = require('chalk')
const yargs = require('yargs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const onSearchLocation = ({ error, data }) => {
	if ( error ) return console.log(error)

	if ( data ) {
		const { latitude, longitude, location } = data

		if ( !latitude || !longitude || !location ) 
			return console.log('Error fetching latitude and longitude! :(')
		
		console.log(chalk.green.inverse(`Forecast for ${location}`))

		forecast({
			latitude,
			longitude,
			callback: onSearchForecast
		})
	}
}

const onSearchForecast = ({ error, data }) => {
	if ( error ) return console.log(error)
	
	if ( data ) {
		const { weather_description, summary } = data

		if ( !weather_description || !summary ) 
			return console.log('Error fetching weather data! :(')
		
		console.log(chalk.white.inverse(weather_description))
		console.log(chalk.white(summary))
	}
}

yargs.command({
	command: 'search',
	describe: 'Pesquisar endereço',
	builder: {
		address: {
			describe: 'Endereço a ser pesquisado',
			demandOption: true,
			type: 'string'
		},
	},
	handler: (argv) => {
		geocode({ 
			address: argv.address, 
			callback: onSearchLocation 
		})
	}
})

yargs.parse()