const { Location } = require('@aws-sdk/client-location');

const locationService = new Location();

async function getLocationCoordinates(placeIndex) {
  const params = {
    IndexName: 'GroupProject', 
    Text: placeIndex,
  };

  try {
    const result = await locationService.searchPlaceIndexForText(params);
    if (result && result.Results && result.Results.length > 0) {
      const coordinates = result.Results[0].Place.Geometry.Point;
      return coordinates;
    } else {
      throw new Error('Place index not found or invalid.');
    }
  } catch (error) {
    throw error;
  }
}

async function getLocationAddress(latitude, longitude) {
  const params = {
    IndexName: 'GroupProject',
    Position: [longitude, latitude],
  };

  try {
    const result = await locationService.searchPlaceIndexForPosition(params);
    if (result && result.Results && result.Results.length > 0) {
      const addressDetails = result.Results[0].Place.Address;
      return addressDetails;
    } else {
      throw new Error('Address not found or invalid.');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getLocationCoordinates,
  getLocationAddress
}
