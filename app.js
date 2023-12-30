const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/checkDomainAvailability', async (req, res) => {
    const domainName = req.query.domain;
    const apiUrl = `https://domainr.p.rapidapi.com/v2/status?mashape-key=[API_KEY]&domain=${domainName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                "X-RapidAPI-Host": "domainr.p.rapidapi.com",
                "X-RapidAPI-Key": "[API_KEY]"
            }
        });

        const data = response.data;

        if (data.status && Array.isArray(data.status) && data.status.length > 0) {
            res.json(data.status[0]);
        } else {
            res.status(500).json({ error: "Nieprawidłowy format odpowiedzi z API." });
        }
    } catch (error) {
        console.error("Błąd podczas sprawdzania dostępności domeny:", error);
        res.status(500).json({ error: "Wystąpił błąd." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});