var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE empresas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyname text UNIQUE, 
            email text UNIQUE, 
            nivel text, 
            pontos text 
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO empresas (companyname, email, nivel, pontos) VALUES (?,?,?,?)'
                db.run(insert, ["Eletrolux","eletrolux@sustentabilidade.com", "8", "32234"])
                db.run(insert, ["Pepsi","pepsi@refri.com", "7", "43552"])
                db.run(insert, ["VoiceSound","vsstudio@studiosvs.com", "9", "164"])
            }
        });  
    }
});


module.exports = db
