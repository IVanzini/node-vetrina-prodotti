import express, { Request, Response, NextFunction } from "express";
import prodotti from "./data";

const port = 3000;
const app = express();

function getResponse(pathId: string, res: Response, json: boolean) {
    const id = Number(pathId);
    if (isNaN(id)) {
        res.status(400).send("Id non numerico");   
    } else {
        const prodotto = prodotti.find(p => p.id == id);
        if (!prodotto) {
            res.status(404).send("Prodotto non trovato");
        } else {
            if (json) {
                res.json(prodotto);
            } else {
                res.render("prodotto", { pageTitle: "Product detail", prodotto: prodotto });
            }
        }
    }
}

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("log:", req.method, req.url, req.get('user-agent'), new Date().toDateString());
    
    next();
});

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
    res.render("prodotti", { pageTitle: "Product list", prodotti: prodotti });
});

app.get("/prodotti/:id", (req: Request, res: Response) => {
    getResponse(req.params["id"], res, false);
});

app.get("/api/prodotti", (req: Request, res: Response) => {
    res.json(prodotti);
});

app.get("/api/prodotti/:id", (req: Request, res: Response) => {
    getResponse(req.params["id"], res, true);
});

app.use((req: Request, res: Response) => {
    res.status(404).send("Pagina non trovata");
});

app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});