const QuoteCollection = require("../models/Quotes");


exports.uploadQuotes = async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Invalid JSON structure" });
    }

    const collections = Object.entries(data).map(([key, value]) => {
      // if value is an array (like categories), store it directly
      if (Array.isArray(value)) {
        return {
          id: key,
          title: { en: key },
          quotes: value, // ✅ store array directly
        };
      }

      // otherwise, same as before
      const content =
        value.quotes || value.main || value.items || value.data || [];

      return {
        id: value.id || key,
        title: value.title || { en: key },
        quotes: content,
      };
    });

    await QuoteCollection.deleteMany();
    await QuoteCollection.insertMany(collections);

    res.status(201).json({ message: "Quotes uploaded successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading quotes",
      error: error.message,
    });
  }
};

// ✅ Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await QuoteCollection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


