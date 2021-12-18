// Import Dependencies
const fs = require('fs');
const converter = require('json-2-csv');

// Import Data
const sessionsData = JSON.parse(fs.readFileSync('./inputData/sessions.json'));
// console.log("SESSIONS: ", Object.values(sessionsData.sessionProducts)[1]);
const speakersData = JSON.parse(fs.readFileSync('./inputData/speakers.json'));
// console.log("SESSIONS: ", Object.values(speakersData.speakers)[1]);

//Utilities
const stripHTML = str => str.replace(/<[^>]+>/g, '');
const stripLineBreaks = someText => someText.replace(/(\r\n|\n|\r)/gm, "");
const parseToCsv = async (jsonData, fileName) => {
  try {
    const csv = await converter.json2csvAsync(jsonData);
    // console.log("CSV", csv);
    fs.writeFileSync(`./output/${fileName}`, csv);
    console.log(`Wrote to CSV: ${fileName}`)
  } catch (err) {
      console.log("ERROR: ", err);
  }
} 

// Sessions
const mappedSessions = Object.values(sessionsData.sessionProducts)
  .map(({
      name, type, plainTextDescription, startTime, endTime, speakerIds
    }) => ({
    name,
    type,
    startTime: new Date(startTime).toLocaleString(),
    endTime: new Date(endTime).toLocaleString(),
    description: stripLineBreaks(plainTextDescription),
    speakerNames: Object.keys(speakerIds).map(speakerId => {
      return speakersData.speakers[speakerId].firstName + " " + speakersData.speakers[speakerId].lastName
    }).join(" ; ")
  }))

// console.log("mappedSessions: ", mappedSessions[3]);
// parseToCsv(mappedSessions, "sessions.csv")

// Speakers
const mappedSpeakers = Object.values(speakersData.speakers)
  .map(({
    firstName, lastName, company, 
    title, biography, facebookUrl,
    twitterUrl, linkedInUrl, profileImageUri, websites
  }) => ({
    firstName,
    lastName,
    company,
    title,
    biography, 
    facebookUrl,
    twitterUrl, 
    linkedInUrl, 
    profileImageUri, 
    links : Object.values(websites).map(websiteObject => {
     return websiteObject.relatedUrlName + ' - ' + websiteObject.relatedUrl
    }).join(" ; ")
  }))

console.log("mappedSpeakers: ", mappedSpeakers[1]);
parseToCsv(mappedSpeakers, "speakers.csv")


