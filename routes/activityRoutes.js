import express from "express";
const router = express.Router();

// Mock activities data - you can replace with actual API
router.get('/search', async (req, res) => {
  try {
    const { city } = req.query;
    
    // Mock activities data
    const activities = [
      {
        id: 1,
        name: 'City Tour',
        description: 'Explore the city with a guided tour',
        price: 50,
        duration: '4 hours',
        rating: 4.5,
        image: 'https://images.pexels.com/photos/291732/pexels-photo-291732.jpeg'
      },
      {
        id: 2,
        name: 'Museum Visit',
        description: 'Visit the famous city museum',
        price: 25,
        duration: '3 hours',
        rating: 4.2,
        image: 'https://images.pexels.com/photos/236171/pexels-photo-236171.jpeg'
      }
    ];
    
    res.json(activities);
  } catch (error) {
    console.error('Activities search error:', error);
    res.status(500).json({ error: 'Failed to search activities' });
  }
});

export default router