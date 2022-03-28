const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");
const Terms = require("./models/terms");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/types", async (req, res) => {
  try {
    let typesRaw = await Terms.find();

    let typesObj = {};
    typesRaw.forEach((doc) => {
      if (typesObj[doc.type]) {
        typesObj[doc.type] = typesObj[doc.type].concat(doc.terms);
      } else {
        typesObj[doc.type] = doc.terms;
      }
    });

    const types = Object.entries(typesObj).map((type) => {
      return {
        type: parseInt(type[0]),
        terms: type[1],
      };
    });

    res.send(types);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/terms", async (req, res) => {
  const type = req.body.type;

  try {
    let termsCount = await Terms.find();
    const newTypes = termsCount.filter((data) => {
      if (data.type === type) {
        return data;
      }
    });
    const terms = newTypes.map((type) => type.terms).flat();

    let termsObj = {};
    terms.forEach((term) => {
      if (termsObj[term]) {
        termsObj[term]++;
      } else {
        termsObj[term] = 1;
      }
    });

    res.send(termsObj);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/add", async (req, res) => {
  let newRecord = req.body;

  try {
    const record = new Terms(newRecord);
    await record.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(process.env.PORT || 5000);
