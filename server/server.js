const express = require('express');
const app = express();

const repertoires = require('./repertoires');

const cors = require('cors');
const corsOptions = {origin: ['http://localhost:3001']}

const port = 8081;

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const dateFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// POST repertory
app.post('/api/repertory', async function (req, res) {
    const {
        name,
        startDate,
        endDate,
        submitterName,
        submitterEmail,
        submitterPhone,
        repertoryRows
    } = req.body;

    if (!name || !startDate || !endDate || !repertoryRows || repertoryRows.length === 0) {
        console.log('Required fields are missing')
        return res.status(400).send('Required fields are missing')
    }

    if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
        return res.status(400).send('Invalid start date or end date format. Expected format: yyyy-MM-dd HH:mm:ss');
    }

    try {
        const repertoryId = await repertoires.addRepertoryData(name, startDate, endDate, submitterName, submitterEmail, submitterPhone, repertoryRows);
        res.status(201).send({ repertoryId });
    } catch (error) {
        console.error('Error adding repertory:', error);
        res.status(500).send('Internal server error');
    }
});

// GET repertory by ID
app.get('/api/repertory/:id', async function (req, res) {
    const repertoryId = req.params.id;

    try {
        const repertory = await repertoires.getRepertoryWithRows(repertoryId);
        if (!repertory) {
            return res.status(404).send('Repertory not found');
        }
        res.send(repertory);
    } catch (error) {
        console.error('Error fetching repertory:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});