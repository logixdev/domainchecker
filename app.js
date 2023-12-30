const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

const checkReferer = (req, res, next) => {
  const allowedReferer = 'https://whois.logixdev.pl';

  const referer = req.get('Referer');
  if (!referer || !referer.startsWith(allowedReferer)) {
    console.log(`Odrzucono połączenie z niedozwolonego źródła: ${referer}`);
    res.status(403).send('Forbidden.');
    return;
  }

  next();
};

app.use(cors());
app.use(checkReferer);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/checkDomainAvailability', async (req, res) => {
    const domainName = req.query.domain;
    const apiUrl = `https://domainr.p.rapidapi.com/v2/status?mashape-key=a1424a33c8msh0781cc06fa61e8bp12852cjsn83fdd171a4fc&domain=${domainName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                "X-RapidAPI-Host": "domainr.p.rapidapi.com",
                "X-RapidAPI-Key": "a1424a33c8msh0781cc06fa61e8bp12852cjsn83fdd171a4fc"
            }
        });

        const data = response.data;

        if (data.status && Array.isArray(data.status) && data.status.length > 0) {
            res.json(data.status[0]);
        } else {
            res.status(500).json({ error: "Nieprawidłowy format odpowiedzi z API." });
        }
    } catch (error) {
        console.error("Błąd podczas sprawdzania dostępności domeny:", error, ".");
        res.status(500).json({ error: "Wystąpił błąd." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}.`);
});