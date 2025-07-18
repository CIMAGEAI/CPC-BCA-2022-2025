// Simple fare calculator controller
exports.calculateFare = (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: "From and To stations are required" });
  }

  // Dummy logic — replace with real logic if needed
  const fare = from === to ? 10 : Math.floor(Math.random() * 30) + 10;

  res.json({ from, to, fare });
};
