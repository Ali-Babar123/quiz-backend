const WriterQuotes = require("../models/WriterQuotes");

// 🟢 POST — Upload or replace writer quotes
exports.uploadWriterQuotes = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    if (!data || !Array.isArray(data.writers_quotes)) {
      return res.status(400).json({
        message: "Invalid input: 'writers_quotes' must be an array",
      });
    }

    // Format data properly
    const formatted = data.writers_quotes.map((item) => ({
      id: item.id || "quotes_by_writers",
      title: item.title || { en: "Quotes — By Writers" },
      quotes: item.quotes || [],
    }));

    // Remove old collection
    await WriterQuotes.deleteMany({});

    // Insert new collection
    await WriterQuotes.insertMany(formatted);

    res.status(201).json({ message: "Writer quotes uploaded successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading writer quotes",
      error: error.message,
    });
  }
};

// 🟣 GET — Fetch all writer quotes
exports.getWriterQuotes = async (req, res) => {
  try {
    const writersQuotes = await WriterQuotes.find();
    res.status(200).json(writersQuotes);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching writer quotes",
      error: error.message,
    });
  }
};

// 🔴 DELETE — Remove all writer quotes
exports.deleteWriterQuotes = async (req, res) => {
  try {
    await WriterQuotes.deleteMany({});
    res.status(200).json({ message: "All writer quotes deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting writer quotes",
      error: error.message,
    });
  }
};
