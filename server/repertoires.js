const sqLite = require('sqlite3').verbose()

const con = new sqLite.Database('../data/repertoire-report.db', sqLite.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("Error happened opening the SQLite database connection", err)
    } else {
        console.log("Connected to SQLite database successfully")
    }
})

function addRepertoryData(name, start_date, end_date, submitter_name, submitter_email, submitter_phone, repertoryRows) {
    return new Promise((resolve, reject) => {

        for (let row of repertoryRows) {
            const { frequency, duration } = row;
            if (isNaN(frequency) || isNaN(duration) || frequency < 0 || duration < 0) {
                console.log('Frequency and duration have to be positive numbers');
                return reject(new Error('Frequency and duration have to be positive numbers'));
            }
        }

        const query = `INSERT INTO repertory (name, start_date, end_date, submitter_name, submitter_email,submitter_phone) VALUES (?, ?, ?, ?, ?, ?)`
        con.run(query, [name, start_date, end_date, submitter_name, submitter_email, submitter_phone],
            function (err) {
                if (err) {
                    console.error('Error inserting into repertory:', err.message);
                    return reject(err);
                }
                const repertoryId = this.lastID;

                const queryRow = `INSERT INTO repertory_row (repertory_id, title, performer, frequency, duration,authors, iswc) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                const promises = repertoryRows.map(row => {
                    return new Promise((resolve, reject) => {
                        con.run(queryRow, [repertoryId, row.title, row.performer, row.frequency, row.duration, row.authors, row.iswc],
                            function (err) {
                                if (err) {
                                    console.error('Error inserting into repertory_row:', err.message);
                                    return reject(err);
                                }
                                resolve();
                            });
                    });
                });
                Promise.all(promises)
                    .then(() => resolve(repertoryId))
                    .catch(reject);
            }
        );
    });
}

function getRepertoryWithRows(repertoryId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT r.id as repertoryId, r.name, r.start_date as startDate, r.end_date as endDate, r.submitter_name as submitterName,
                        r.submitter_email as submitterEmail, r.submitter_phone as submitterPhone, rr.title, rr.performer, rr.frequency, 
                        rr.duration, rr.authors, rr.work_id, rr.iswc
                        FROM repertory r LEFT JOIN repertory_row rr ON r.id = rr.repertory_id WHERE r.id = ?`;

        con.all(query, [repertoryId], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                resolve(null);
            } else {
                const repertory = {
                    name: rows[0].name,
                    startDate: rows[0].startDate,
                    endDate: rows[0].endDate,
                    submitterName: rows[0].submitterName,
                    submitterEmail: rows[0].submitterEmail,
                    submitterPhone: rows[0].submitterPhone,
                    repertoryRows: rows.map(row => ({
                        title: row.title,
                        performer: row.performer,
                        frequency: row.frequency,
                        duration: row.duration,
                        authors: row.authors,
                        work_id: row.work_id,
                        iswc: row.iswc
                    })).filter(row => row.title)
                };
                resolve(repertory);
            }
        });
    });
}

module.exports = {
    addRepertoryData,
    getRepertoryWithRows,
};