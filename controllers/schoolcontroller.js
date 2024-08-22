// For adding schools

const pool = require('../configure/db');

exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};


//for calculating results

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const [schools] = await pool.query('SELECT * FROM schools');

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

