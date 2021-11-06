var express = require("express")
var app = express()
var db = require("./db/database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});


// lista de empresas
app.get("/api/empresas", (req, res, next) => {
    var sql = "select * from empresas"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// ver empresa
app.get("/api/empresa/:id", (req, res, next) => {
    var sql = "select * from empresas where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


// inserir empresa
app.post("/api/empresa/", (req, res, next) => {
    var errors=[]
    if (!req.body.companyname){
        errors.push("No company name specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        companyname: req.body.companyname,
        email: req.body.email,
        nivel : req.body.nivel,
        pontos : req.body.pontos
    }
    var sql ='INSERT INTO empresa (companyname, email, nivel, pontos) VALUES (?,?,?,?)'
    var params =[data.companyname, data.email, data.nivel, data.pontos]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// atualizar empresa
app.patch("/api/empresas/:id", (req, res, next) => {
    var data = {
        companyname: req.body.companyname,
        email: req.body.email,
        nivel : req.body.nivel,
        pontos : req.body.pontos
    }
    db.run(
        `UPDATE empresas set 
           companyname = COALESCE(?,companyname), 
           email = COALESCE(?,email), 
           nivel = COALESCE(?,nivel),
           pontos = COALESCE(?,pontos),
           WHERE id = ?`,
        [data.companyname, data.email, data.nivel, data.pontos, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

// deletar empresas
app.delete("/api/empresa/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});