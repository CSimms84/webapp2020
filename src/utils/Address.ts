
export class Address {
	constructor() {

	}

	//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
	public static calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
		var R = 6371; // km
		var dLat = Address.toRad(lat2 - lat1);
		var dLon = Address.toRad(lon2 - lon1);
		var lat1 = Address.toRad(lat1);
		var lat2 = Address.toRad(lat2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d;
	}

	// Converts numeric degrees to radians
	public static toRad(Value: number): number {
		return Value * Math.PI / 180;
	}

	public static validateZipCode(zipCode: string, country: string) {
		let regex: any;
		let found: any;
		switch (country) {
			case 'Austria':
				regex = new RegExp(/^([0-9]{4})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Bosnia and Herzegovina':
				regex = new RegExp(/^([7-8]{1})([0-9]{4})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Belgium':
				regex = new RegExp(/^([0-9]{4})$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Brazil':
				regex = new RegExp(/^([0-9]{5})([-])?([0-9]{3})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Switzerland':
				regex = new RegExp(/^([0-9]{4})$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Germany':
				regex = new RegExp(/^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Spain':
			case 'France':
				regex = new RegExp(/^(?:[0-8]\d|9[0-8])\d{3}$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Italy':
				regex = new RegExp(/^([0-9]{5})$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Hungary':
				regex = new RegExp(/^([0-9]{4})$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Ireland':
				regex = new RegExp(/([AC-FHKNPRTV-Y]\d{2}|D6W)[0-9AC-FHKNPRTV-Y]{4}/, 'i');
				found = zipCode.match(regex);
				break;
			case 'India':
				regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Japan':
				regex = new RegExp(/^([0-9]{3})([-]?)([0-9]{4})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Portugal':
				regex = new RegExp(/^([0-9]{4})([-])([0-9]{3})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'United States':
				regex = new RegExp(/^([0-9]{5})(-[0-9]{4})?$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Canada':
				// CA Postal codes cannot contain D,F,I,O,Q,U and cannot start with W or Z. https://en.wikipedia.org/wiki/Postal_codes_in_Canada#Number_of_possible_postal_codes.
				regex = new RegExp(/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])([\ ])?(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/, 'i');

				
				found = zipCode.match(regex);

				
				break;
			case 'Poland':
				regex = new RegExp(/^([0-9]{2})([-])([0-9]{3})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Slovakia':
				regex = new RegExp(/^([0-9]{3})(\s?)([0-9]{2})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Netherlands':
				regex = new RegExp(/^([1-9][0-9]{3})(\s?)(?!SA|SD|SS)[A-Z]{2}$/i, 'i');
				found = zipCode.match(regex);
				break;
			case 'Slovenia':
				regex = new RegExp(/^([1-9][0-9]{3})$/, 'i');
				found = zipCode.match(regex);
				break;
			case 'Liechtenstein':
				regex = new RegExp(/^(94[8-9][0-9])$/, 'i');
				found = zipCode.match(regex);
				break;
			default:
				regex = true;
				found = ['true']
				break;
		}
		

		if (found) {
			return true;
		} else {
			false;
		}

	}
}
