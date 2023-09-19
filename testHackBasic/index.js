const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readGetForm = fs.readFileSync("./users.json", "utf8");
const jsonData = JSON.parse(readGetForm);

app.post("/api/users", (req, res) => {
    const newValue = req.body;
    const isCheckEmail = jsonData.find((item) => item.email === newValue.email);
    if (isCheckEmail) {
        return res.status(409).send({
            success: false,
            message: "Missing or invalid email",
        });
    }
    const newData = [...jsonData, { ...newValue, _id: crypto.randomUUID() }];
    fs.writeFileSync("./users.json", JSON.stringify(newData));
    res.status(200).send({
        success: jsonData ? true : false,
        message: "create successfully",
    });
});

app.get("/api/users", (req, res) => {
    res.status(200).send({
        success: jsonData ? true : false,
        data: jsonData ? jsonData : false,
    });
});

app.get("/api/user/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonData.find((item) => item._id === id);
    if (!response) {
        return res.status(200).send({
            success: false,
            message: "Missing input",
        });
    }
    return res.status(200).send({
        success: response ? true : false,
        data: response ? response : false,
    });
});

app.delete("/api/user/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonData.filter((item) => item._id !== id);
    if (!response) {
        return res.status(500).send({
            success: false,
            message: "delete failed",
        });
    }
    fs.writeFileSync("./users.json", JSON.stringify(response));
    return res.status(200).send({
        success: response ? true : false,
        message: "delete successfully",
    });
});

app.put("/api/user/:id", (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;
    const userIndex = jsonData.findIndex((item) => item._id === id);
    if (userIndex === -1) {
        res.status(504).send({
            success: false,
            message: "Người dùng không tồn tại.",
        });
    } else {
        jsonData[userIndex] = { ...jsonData[userIndex], ...updatedUserData };
        fs.writeFileSync("./users.json", JSON.stringify(jsonData));
        res.status(200).send({
            success: jsonData ? true : false,
            message: "updated successfully",
            data: jsonData ? jsonData : false,
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
