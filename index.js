import cheerio from "cheerio";
import pretty from "pretty";
import fs from "fs";
import axios from "axios";

const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

const scrapeData = async () => {
  try {
    //fetch html of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".plainlist ul li");
    const countries = [];
    let country;
    listItems.each((i, el) => {
      country = { name: "", iso3: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("a").text();
      country.iso3 = $(el).children("span").text();
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);

    fs.writeFile(
      "countries.json",
      JSON.stringify(countries, null, 1),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Successfully written data to file");
      }
    );
  } catch (err) {
    console.error(err);
  }
};

scrapeData();
